import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  buildIsometricCadLattice,
  buildMountainTerrain,
  buildObservatoryDome,
  buildSteppedHaloPedestal,
  buildStoneStargateRing,
  createStoneTextures,
} from './proceduralStone';
import { buildAllMorphTargets, PARTICLE_COUNT } from './pointCloudShapes';
import { PROJECTS } from '../data/hubData';

// Volumetric 3D Micro-Sphere Point-Cloud Vertex & Fragment Shader (exact f09 & f10 shaded voxel particles!)
const PARTICLE_VERT = `
  attribute vec3 aTargetPos;
  attribute float aSeed;

  uniform float uMorph;
  uniform float uTime;
  uniform float uTurbulence;
  uniform float uPointScale;
  uniform vec3 uCursorWorld;
  uniform float uCursorActive;

  varying float vSeed;
  varying vec3 vViewPos;
  varying float vRim;

  void main() {
    vSeed = aSeed;
    vec3 p = mix(position, aTargetPos, uMorph);

    // Organic curl-like turbulence on outer boundary particles (matching f09 disintegrating edge!)
    float edgeMask = smoothstep(0.55, 1.0, aSeed);
    float waveX = sin(p.y * 3.4 + uTime * 1.7 + aSeed * 12.0);
    float waveY = cos(p.x * 3.1 - uTime * 1.4 + aSeed * 9.0);
    float waveZ = sin(p.z * 3.6 + uTime * 1.5 + aSeed * 15.0);
    p += vec3(waveX, waveY, waveZ) * (0.045 + uTurbulence * 0.34) * (0.25 + edgeMask * 0.95);

    // Interactive cursor velocity repulsion (especially dramatic in Vortex footer!)
    vec3 toPoint = p - uCursorWorld;
    float d = length(toPoint);
    if (d < 1.35 && uCursorActive > 0.01) {
      float push = (1.0 - d / 1.35);
      p += normalize(toPoint + vec3(0.001)) * push * push * 0.68 * uCursorActive;
      vRim = push;
    } else {
      vRim = 0.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vViewPos = -mvPosition.xyz;
    float dist = max(0.8, -mvPosition.z);
    float sizeJitter = 0.65 + fract(aSeed * 17.3) * 0.72;
    gl_PointSize = clamp((uPointScale * sizeJitter) / dist, 1.5, 16.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAG = `
  uniform vec3 uBaseLight;
  uniform vec3 uBaseShadow;
  uniform vec3 uAccentTint;
  uniform float uOpacity;

  varying float vSeed;
  varying vec3 vViewPos;
  varying float vRim;

  void main() {
    // Sculpt each point into a true shaded 3D sphere impostor!
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;

    float z = sqrt(1.0 - r2);
    vec3 normal = normalize(vec3(uv.x, -uv.y, z));

    // Overhead studio halo light (matching f10 top ring light!) + icy bounce fill
    vec3 lightTop = normalize(vec3(0.25, 0.92, 0.45));
    vec3 lightRim = normalize(vec3(-0.75, -0.25, 0.6));
    float diff = max(dot(normal, lightTop), 0.0);
    float back = max(dot(normal, lightRim), 0.0) * 0.38;
    float spec = pow(max(dot(reflect(-lightTop, normal), vec3(0.0, 0.0, 1.0)), 0.0), 18.0);

    vec3 col = mix(uBaseShadow, uBaseLight, diff * 0.85 + back);
    // Subtle world accent glint on specular & cursor-excited particles
    float accentMask = smoothstep(0.78, 0.99, fract(vSeed * 31.7)) * 0.45 + vRim * 0.85;
    col = mix(col, uAccentTint, clamp(accentMask, 0.0, 0.9));
    col += vec3(0.96, 0.99, 1.0) * spec * 0.45;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

// Fullscreen Single-Pass Post-Processing FBO (Radial Chromatic Aberration + Core Halation + Film Grain, exact f05!)
const POST_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const POST_FRAG = `
  uniform sampler2D tDiffuse;
  uniform float uChroma;
  uniform float uMistFlash;
  uniform float uTime;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 dir = vUv - vec2(0.5);
    float dist = length(dir);
    float aber = (0.0014 + uChroma * 0.026) * pow(dist * 1.45, 1.65);

    vec3 col;
    col.r = texture2D(tDiffuse, clamp(vUv + dir * aber * 1.35, 0.001, 0.999)).r;
    col.g = texture2D(tDiffuse, clamp(vUv + dir * aber * 0.25, 0.001, 0.999)).g;
    col.b = texture2D(tDiffuse, clamp(vUv - dir * aber * 1.15, 0.001, 0.999)).b;

    // Soft bright-core halation glow (5-tap cross blur on highlights > 0.82)
    vec3 b1 = texture2D(tDiffuse, clamp(vUv + vec2(0.004, 0.004), 0.0, 1.0)).rgb;
    vec3 b2 = texture2D(tDiffuse, clamp(vUv + vec2(-0.004, 0.004), 0.0, 1.0)).rgb;
    vec3 b3 = texture2D(tDiffuse, clamp(vUv + vec2(0.004, -0.004), 0.0, 1.0)).rgb;
    vec3 b4 = texture2D(tDiffuse, clamp(vUv + vec2(-0.004, -0.004), 0.0, 1.0)).rgb;
    vec3 avg = (b1 + b2 + b3 + b4) * 0.25;
    float lum = dot(avg, vec3(0.299, 0.587, 0.114));
    col += avg * smoothstep(0.76, 0.99, lum) * 0.28;

    // Cloud plunge mist wash during f06 & loop seam
    col = mix(col, vec3(0.68, 0.71, 0.76), uMistFlash * 0.84);

    // Subtle overcast vignette & tactile film grain
    col *= 1.0 - smoothstep(0.45, 1.08, dist) * 0.18;
    float grain = (hash12(vUv * 920.0 + fract(uTime * 7.3)) - 0.5) * 0.022;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function smoothStep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function ObservatoryExperience({
  scrollProgressRef,
  loadProgress,
  onHoverTriangleChange,
  onProjectedCadChange,
  onActiveStageChange,
  onSelectProject,
  modalOpen,
}) {
  const canvasRef = useRef(null);
  const loadRef = useRef(loadProgress);
  const modalRef = useRef(modalOpen);
  const callbacksRef = useRef({
    onHoverTriangleChange,
    onProjectedCadChange,
    onActiveStageChange,
    onSelectProject,
  });

  loadRef.current = loadProgress;
  modalRef.current = modalOpen;
  callbacksRef.current = {
    onHoverTriangleChange,
    onProjectedCadChange,
    onActiveStageChange,
    onSelectProject,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const mistColor = new THREE.Color('#a4abb7');
    scene.background = mistColor;
    scene.fog = new THREE.FogExp2('#a4abb7', 0.042);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 90);

    // Atmospheric Arctic/Mineral Studio Lighting (bright silver-mist bounce matching f04 & f11!)
    const hemi = new THREE.HemisphereLight(0xf6faff, 0x8b95a5, 2.35);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.85);
    sunLight.position.set(8, 14, 7);
    scene.add(sunLight);

    const coreLight = new THREE.PointLight(0xeaf8ff, 5.4, 14, 1.5);
    coreLight.position.set(0, 0.8, 0);
    scene.add(coreLight);

    // Procedural Stone Textures & Materials
    const { bumpTex, albedoTex } = createStoneTextures();
    const stoneMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      bumpMap: bumpTex,
      bumpScale: 0.09,
      roughness: 0.68,
      metalness: 0.06,
      emissive: new THREE.Color('#222832'),
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 1,
    });

    const wireBlockMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.78,
    });

    const wireTerrainMat = new THREE.MeshBasicMaterial({
      color: 0xeaf2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // 1. SURFACE WORLD (y = 0): Observatory Masonry Dome + Mountain Ridge + Isometric CAD Lattice
    const surfaceWorld = new THREE.Group();
    scene.add(surfaceWorld);

    const { group: domeGroup, blocks: domeBlocks, coreMesh } = buildObservatoryDome(
      stoneMat,
      wireBlockMat
    );
    surfaceWorld.add(domeGroup);

    const { group: terrainGroup, terrainMesh, terrainWire } = buildMountainTerrain(
      stoneMat,
      wireTerrainMat
    );
    surfaceWorld.add(terrainGroup);

    const { group: cadGroup, lineMat: cadLineMat, anchors: cadAnchors } = buildIsometricCadLattice();
    surfaceWorld.add(cadGroup);

    // 2. STARGATE PORTAL RING (y = -13): Horizontal XZ Aperture so descending camera frames the full 360° ring dead-center (f07 & f08!)
    const stargate = buildStoneStargateRing(stoneMat);
    stargate.group.position.set(0, -13, 0);
    stargate.group.rotation.x = Math.PI * 0.5;
    scene.add(stargate.group);

    // 3. SUB-SURFACE PEDESTAL CHAMBER (y = -28): Stepped Stone Pedestal + 15,000-Point Morphing Sculptures
    const chamberWorld = new THREE.Group();
    chamberWorld.position.set(0, -28, 0);
    scene.add(chamberWorld);

    const pedestal = buildSteppedHaloPedestal(stoneMat);
    chamberWorld.add(pedestal.group);

    const morphTargets = buildAllMorphTargets();
    const particleGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(new Float32Array(morphTargets[0]), 3);
    const targetAttr = new THREE.BufferAttribute(new Float32Array(morphTargets[1]), 3);
    const seedArr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      seedArr[i] = (i * 0.61803398875) % 1;
    }
    particleGeo.setAttribute('position', posAttr);
    particleGeo.setAttribute('aTargetPos', targetAttr);
    particleGeo.setAttribute('aSeed', new THREE.BufferAttribute(seedArr, 1));

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uTurbulence: { value: 0 },
        uPointScale: { value: 34.0 * dpr },
        uCursorWorld: { value: new THREE.Vector3(0, 0, 0) },
        uCursorActive: { value: 0 },
        uBaseLight: { value: new THREE.Color('#dbe4f0') },
        uBaseShadow: { value: new THREE.Color('#4c5565') },
        uAccentTint: { value: new THREE.Color(PROJECTS[0].tokens.accent) },
        uOpacity: { value: 1 },
      },
    });

    const sculpturePoints = new THREE.Points(particleGeo, particleMat);
    sculpturePoints.position.y = 0.08;
    chamberWorld.add(sculpturePoints);

    // Ambient floating snow/quartz dust motes across the whole vertical column
    const dustCount = 520;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = 6 - Math.random() * 40;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf4f9ff,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    // Single-Pass FBO Post-Processing Setup
    let renderTarget = new THREE.WebGLRenderTarget(
      Math.max(1, Math.floor(window.innerWidth * dpr)),
      Math.max(1, Math.floor(window.innerHeight * dpr)),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      vertexShader: POST_VERT,
      fragmentShader: POST_FRAG,
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uChroma: { value: 0 },
        uMistFlash: { value: 0 },
        uTime: { value: 0 },
      },
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
    postScene.add(postQuad);

    const resize = () => {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderTarget.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer & Raycaster for Dome Block Levitation + 1px Tracking Triangle + Vortex Interaction
    const pointerNDC = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    let pointerVelocity = 0;
    const raycaster = new THREE.Raycaster();

    const onPointerMove = (e) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
      pointerVelocity = Math.min(1.5, pointerVelocity + Math.hypot(nx - pointerNDC.x, ny - pointerNDC.y) * 3.5);
      pointerNDC.set(nx, ny);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Click on 3D Pedestal Sculpture opens the active Chamber Dossier!
    const onCanvasClick = (e) => {
      if (modalRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const cy = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      // Check if user is in Chamber zone (p = 0.28..0.82) and clicked near center sculpture
      const p = scrollProgressRef.current;
      if (p >= 0.28 && p <= 0.80 && Math.hypot(cx, cy) < 0.42) {
        const idx = Math.min(4, Math.max(0, Math.floor(((p - 0.28) / 0.52) * 5)));
        callbacksRef.current.onSelectProject?.(PROJECTS[idx].slug);
      }
    };
    canvas.addEventListener('click', onCanvasClick);

    let lastShapePairKey = '';
    let lastStageKey = '';
    let prevProgress = scrollProgressRef.current;
    let rafId = 0;
    let frameCounter = 0;
    const clock = new THREE.Clock();
    const tmpVec = new THREE.Vector3();
    const accentA = new THREE.Color();
    const accentB = new THREE.Color();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      frameCounter += 1;

      smoothPointer.lerp(pointerNDC, Math.min(1, dt * 5.0));
      pointerVelocity = Math.max(0, pointerVelocity - dt * 2.2);

      const loadP = loadRef.current;
      const p = scrollProgressRef.current;

      // Shortest circular delta around the [0, 1) infinite loop so wrap 0.99 -> 0.01 never spikes!
      let dP = p - prevProgress;
      if (dP > 0.5) dP -= 1;
      if (dP < -0.5) dP += 1;
      prevProgress = p;
      const scrollSpeed = Math.min(1.4, Math.abs(dP) * 42);

      // ============================================================
      // BEAT 0: ISOMETRIC WIREFRAME CAD -> MATERIALIZATION (f01 -> f03)
      // ============================================================
      const solidReveal = smoothStep(0.56, 0.96, loadP);
      const cadFade = 1 - smoothStep(0.72, 1.0, loadP);
      cadGroup.visible = cadFade > 0.01;
      cadLineMat.opacity = cadFade * 0.52;
      terrainMesh.visible = solidReveal > 0.02;
      stoneMat.opacity = Math.max(0.08, solidReveal);
      terrainWire.visible = loadP > 0.32 && cadFade > 0.02;
      terrainWire.material.opacity = Math.sin(smoothStep(0.32, 1.0, loadP) * Math.PI) * 0.42;
      wireBlockMat.opacity = THREE.MathUtils.lerp(0.88, 0.16, solidReveal);
      coreMesh.material.opacity = THREE.MathUtils.lerp(0.35, 1.0, solidReveal);

      // ============================================================
      // CONTINUOUS INFINITE LOOP CAMERA CHOREOGRAPHY (p in [0, 1))
      // 0.00..0.12 : Surface Observatory Hero (f04)
      // 0.10..0.19 : Exploding Masonry + Chromatic Cloud Plunge (f05 -> f06)
      // 0.19..0.28 : 8-Segment Carved Stone Stargate Ring Fly-Through (f07 -> f08)
      // 0.28..0.80 : 5 Morphing Volumetric Point-Cloud Relics on Stepped Pedestal (f09 -> f10)
      // 0.80..0.91 : Swirling Interactive Volumetric Particle Vortex Footer
      // 0.91..1.00 : Ascent Through Mist & Reassembling Masonry Blocks -> 0.00 (f11 -> f04)
      // ============================================================

      const camPos = new THREE.Vector3();
      const camLook = new THREE.Vector3();

      if (loadP < 0.99) {
        // Isometric CAD Loader framing -> sweeping smoothly into Hero view (f01 -> f03 -> f04)
        const sweep = smoothStep(0.62, 1.0, loadP);
        camPos.set(
          THREE.MathUtils.lerp(5.6, 3.85, sweep),
          THREE.MathUtils.lerp(5.8, 2.55, sweep),
          THREE.MathUtils.lerp(6.2, 6.65, sweep)
        );
        camLook.set(0, THREE.MathUtils.lerp(0.55, 0.95, sweep), 0);
      } else if (p < 0.18) {
        const t = smoothStep(0.04, 0.18, p);
        camPos.set(
          THREE.MathUtils.lerp(3.85, 0.0, t) + smoothPointer.x * 0.55 * (1 - t),
          THREE.MathUtils.lerp(2.55, -5.2, Math.pow(t, 1.35)) + smoothPointer.y * 0.28 * (1 - t),
          THREE.MathUtils.lerp(6.65, 0.35, t)
        );
        camLook.set(0, THREE.MathUtils.lerp(0.95, -13.5, t), 0);
      } else if (p < 0.29) {
        // Fly straight down through the center of the horizontal 8-Segment Stone Stargate Ring at y = -13 (exact f07 -> f08!)
        const t = smoothStep(0.18, 0.29, p);
        camPos.set(
          smoothPointer.x * 0.3,
          THREE.MathUtils.lerp(-5.2, -26.35, t),
          THREE.MathUtils.lerp(0.35, 6.25, smoothStep(0.38, 1.0, t))
        );
        camLook.set(0, THREE.MathUtils.lerp(-13.5, -27.95, t), 0);
      } else if (p < 0.80) {
        // Orbit gently around the Stepped Halo Pedestal & 5 Volumetric Relics (f09 -> f10)
        const chamberT = (p - 0.29) / 0.51;
        const orbitAngle = Math.sin(chamberT * Math.PI * 2) * 0.28 + smoothPointer.x * 0.32;
        const radius = 6.25;
        camPos.set(
          Math.sin(orbitAngle) * radius,
          -26.45 + smoothPointer.y * 0.32,
          Math.cos(orbitAngle) * radius
        );
        camLook.set(0, -27.95, 0);
      } else if (p < 0.91) {
        // Tilt above the Swirling Interactive Particle Vortex on the Pedestal Core!
        const t = smoothStep(0.80, 0.91, p);
        camPos.set(
          smoothPointer.x * 0.65,
          THREE.MathUtils.lerp(-26.45, -24.1, Math.sin(t * Math.PI * 0.85)),
          THREE.MathUtils.lerp(6.25, 3.85, t)
        );
        camLook.set(0, -28.1, 0);
      } else {
        // Seamless Infinite Loop Seam (0.91 -> 1.00 -> 0.00): Mist Wash -> Reassembling Masonry Observatory (f11 -> f04)!
        const t = smoothStep(0.91, 1.0, p);
        camPos.set(
          THREE.MathUtils.lerp(0.6, 3.85, t) + smoothPointer.x * 0.45 * t,
          THREE.MathUtils.lerp(5.4, 2.55, t),
          THREE.MathUtils.lerp(8.4, 6.65, t)
        );
        camLook.set(0, THREE.MathUtils.lerp(1.35, 0.95, t), 0);
      }

      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // ============================================================
      // DOME BLOCK EXPLOSION / REASSEMBLY + HOVER TRIANGLE RETICLE
      // ============================================================
      const explodeOut = p >= 0.04 && p <= 0.20 ? smoothStep(0.04, 0.15, p) : 0;
      const reassembleFromAir = p >= 0.90 ? 1 - smoothStep(0.91, 0.995, p) : 0;
      const burstAmount = Math.max(explodeOut, reassembleFromAir);

      let hoveredBlock = null;
      if (loadP >= 0.98 && (p < 0.14 || p > 0.92) && !modalRef.current) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(domeBlocks, false);
        if (hits.length > 0) hoveredBlock = hits[0].object;
      }

      domeBlocks.forEach((b) => {
        const u = b.userData;
        const isNearHover =
          hoveredBlock && u.basePos.distanceTo(hoveredBlock.userData.basePos) < 1.15;
        const targetLift = isNearHover ? (b === hoveredBlock ? 0.42 : 0.18) : 0;
        u.hoverLift = THREE.MathUtils.lerp(u.hoverLift, targetLift, Math.min(1, dt * 8));

        const totalOffset = burstAmount * u.scatterDist + u.hoverLift;
        b.position.copy(u.basePos).addScaledVector(u.scatterDir, totalOffset);
        b.quaternion.copy(u.baseQuat);
        if (burstAmount > 0.002) {
          b.rotateOnAxis(u.rotAxis, burstAmount * 1.15);
        }
      });

      // Project 3 nearby block centers to 2D screen coordinates for the f04 1px tracking triangle!
      if (frameCounter % 2 === 0) {
        if (hoveredBlock && burstAmount < 0.25) {
          const centerA = hoveredBlock;
          const neighbors = domeBlocks
            .filter((x) => x !== centerA)
            .sort(
              (a, b) =>
                a.userData.basePos.distanceTo(centerA.userData.basePos) -
                b.userData.basePos.distanceTo(centerA.userData.basePos)
            )
            .slice(0, 2);

          if (neighbors.length === 2) {
            const tri = [centerA, neighbors[0], neighbors[1]].map((m) => {
              tmpVec.copy(m.position).project(camera);
              return {
                x: (tmpVec.x * 0.5 + 0.5) * window.innerWidth,
                y: (-tmpVec.y * 0.5 + 0.5) * window.innerHeight,
                code: m.userData.code,
              };
            });
            callbacksRef.current.onHoverTriangleChange?.(tri);
          }
        } else {
          callbacksRef.current.onHoverTriangleChange?.(null);
        }

        // Project CAD vertex numbers during Beat 0 preloader (f01 & f02)
        if (cadFade > 0.08) {
          const pts = cadAnchors.map((a) => {
            tmpVec.copy(a.pos).project(camera);
            return {
              x: (tmpVec.x * 0.5 + 0.5) * window.innerWidth,
              y: (-tmpVec.y * 0.5 + 0.5) * window.innerHeight,
              val: Math.min(99, Math.round((a.num * loadP) + 4)),
            };
          });
          callbacksRef.current.onProjectedCadChange?.(pts);
        } else {
          callbacksRef.current.onProjectedCadChange?.([]);
        }
      }

      // ============================================================
      // STARGATE PORTAL & VOLUMETRIC POINT-CLOUD MORPHING (01..05 + VORTEX)
      // ============================================================
      stargate.innerSegs.forEach((seg) => {
        seg.rotation.z = seg.userData.baseRot.z + elapsed * seg.userData.speed;
      });
      stargate.glowRing.rotation.z = -elapsed * 0.35;

      // Determine continuous morph index across [0:Wiraloka, 1:KOMA, 2:SILIKA, 3:REDAM, 4:SOROT, 5:VORTEX]
      let morphFloat = 0;
      if (p >= 0.28 && p < 0.80) {
        morphFloat = ((p - 0.28) / 0.52) * 4.999;
      } else if (p >= 0.80) {
        morphFloat = 4 + smoothStep(0.80, 0.85, p);
      }

      const idxA = Math.min(5, Math.max(0, Math.floor(morphFloat)));
      const idxB = Math.min(5, idxA + 1);
      const localFrac = morphFloat - idxA;
      // Hold each sculpture 100% solid for the first 64% of its chamber window, then morph swiftly across 0.64..0.96!
      const easedMorph = smoothStep(0.64, 0.96, localFrac);

      const pairKey = `${idxA}-${idxB}`;
      if (pairKey !== lastShapePairKey) {
        lastShapePairKey = pairKey;
        posAttr.array.set(morphTargets[idxA]);
        posAttr.needsUpdate = true;
        targetAttr.array.set(morphTargets[idxB]);
        targetAttr.needsUpdate = true;
      }

      particleMat.uniforms.uMorph.value = easedMorph;
      particleMat.uniforms.uTime.value = elapsed;
      // Swirl/disintegrate edges mid-morph just like f09!
      particleMat.uniforms.uTurbulence.value =
        Math.sin(easedMorph * Math.PI) * 0.85 + (idxA === 5 ? 0.35 + pointerVelocity * 0.45 : 0);

      const colHexA = idxA < 5 ? PROJECTS[idxA].tokens.accent : '#38BDF8';
      const colHexB = idxB < 5 ? PROJECTS[idxB].tokens.accent : '#FF573B';
      accentA.set(colHexA);
      accentB.set(colHexB);
      particleMat.uniforms.uAccentTint.value.copy(accentA).lerp(accentB, easedMorph);

      sculpturePoints.rotation.y = elapsed * (idxA === 5 ? 0.55 : 0.28) + smoothPointer.x * 0.45;
      pedestal.cageMesh.rotation.y = -elapsed * 0.08;

      // Map 2D cursor to pedestal 3D plane for particle repulsion
      particleMat.uniforms.uCursorWorld.value.set(smoothPointer.x * 2.4, smoothPointer.y * 1.8, 0.6);
      particleMat.uniforms.uCursorActive.value = p >= 0.28 && p <= 0.91 ? 1.0 : 0.0;

      // Report active HUD stage cleanly to React overlay only when stage changes
      let stageInfo = { mode: 'hero', projectIdx: -1 };
      if (loadP < 0.99) {
        stageInfo = { mode: 'loading', projectIdx: -1 };
      } else if (p < 0.14 || p >= 0.93) {
        stageInfo = { mode: 'hero', projectIdx: -1 };
      } else if (p < 0.28) {
        stageInfo = { mode: 'plunge', projectIdx: 0 };
      } else if (p < 0.80) {
        const activeIdx = Math.min(4, Math.max(0, Math.floor(morphFloat + 0.2)));
        stageInfo = { mode: 'chamber', projectIdx: activeIdx };
      } else {
        stageInfo = { mode: 'vortex', projectIdx: -1 };
      }

      const stageKey = `${stageInfo.mode}:${stageInfo.projectIdx}`;
      if (stageKey !== lastStageKey) {
        lastStageKey = stageKey;
        callbacksRef.current.onActiveStageChange?.(stageInfo);
      }

      // ============================================================
      // POST-PROCESSING UNIFORMS (Chromatic Plunge + Seam Mist Wash)
      // ============================================================
      const plungeChroma =
        (p > 0.06 && p < 0.22 ? Math.sin(smoothStep(0.06, 0.22, p) * Math.PI) : 0) +
        (p > 0.88 ? Math.sin(smoothStep(0.88, 1.0, p) * Math.PI) * 0.85 : 0);
      postMat.uniforms.uChroma.value = Math.min(1.35, plungeChroma * 0.95 + scrollSpeed * 0.65);

      const mistPlunge = p > 0.13 && p < 0.21 ? Math.sin(((p - 0.13) / 0.08) * Math.PI) : 0;
      const mistLoopSeam =
        p > 0.885 && p < 0.945 ? Math.sin(((p - 0.885) / 0.06) * Math.PI) : 0;
      postMat.uniforms.uMistFlash.value = Math.max(mistPlunge * 0.72, mistLoopSeam * 0.95);
      postMat.uniforms.uTime.value = elapsed;

      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCam);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('click', onCanvasClick);
      renderTarget.dispose();
      bumpTex.dispose();
      albedoTex.dispose();
      stoneMat.dispose();
      wireBlockMat.dispose();
      wireTerrainMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      postMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      className="observatory-canvas"
      data-testid="observatory-webgl"
      aria-label="Interactive 3D Sub-Surface Quartz Observatory showcasing 5 Awwwards portfolio worlds"
    />
  );
}

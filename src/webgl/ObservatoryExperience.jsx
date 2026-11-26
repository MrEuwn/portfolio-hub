import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  buildArcticAtmosphere,
  buildIsometricCadLattice,
  buildMountainTerrain,
  buildObservatoryDome,
  buildSteppedHaloPedestal,
  buildStoneStargateRing,
  createCloudPuffTexture,
  createStoneTextures,
} from './proceduralStone';
import { buildAllMorphTargets, PARTICLE_COUNT } from './pointCloudShapes';
import { PROJECTS } from '../data/hubData';

// 42,000-Voxel Matte Frost-Alabaster Sculpture Shader with Staggered Helical Curl-Noise Disintegration (exact f09 & f10!)
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
  varying float vRim;
  varying float vSwirlMask;
  varying float vHeight;

  void main() {
    vSeed = aSeed;

    // Staggered peel-off wave so outer/upper voxels disintegrate first and condense smoothly (exact f09!)
    float delay = aSeed * 0.34;
    float localM = clamp((uMorph - delay) / (1.0 - 0.34), 0.0, 1.0);
    float smoothM = localM * localM * (3.0 - 2.0 * localM);

    vec3 baseMix = mix(position, aTargetPos, smoothM);

    // Helical vortex arc + 3D curl-like wind stream peaking mid-transition (sin(localM * PI))
    float midBell = sin(localM * 3.14159265);
    vSwirlMask = midBell;

    float swirlAngle = midBell * (1.85 + fract(aSeed * 7.3) * 1.45);
    float cs = cos(swirlAngle);
    float sn = sin(swirlAngle);
    vec3 swirled = vec3(
      baseMix.x * cs - baseMix.z * sn,
      baseMix.y + midBell * (fract(aSeed * 13.7) - 0.42) * 0.95,
      baseMix.x * sn + baseMix.z * cs
    );

    // Subtle organic breathing on outer dust halo + dramatic curl scatter during morph
    float outerDust = smoothstep(0.84, 1.0, fract(aSeed * 29.1));
    float wx = sin(swirled.y * 3.8 + uTime * 1.6 + aSeed * 19.0);
    float wy = cos(swirled.x * 3.4 - uTime * 1.3 + aSeed * 11.0);
    float wz = sin(swirled.z * 3.9 + uTime * 1.5 + aSeed * 23.0);
    float amp = 0.018 + outerDust * 0.095 + midBell * 0.44 + uTurbulence * 0.24;
    vec3 p = swirled + vec3(wx, wy, wz) * amp;

    // Interactive cursor repulsion & ripple wake
    vec3 toPoint = p - uCursorWorld;
    float d = length(toPoint);
    if (d < 1.45 && uCursorActive > 0.01) {
      float push = (1.0 - d / 1.45);
      p += normalize(toPoint + vec3(0.001)) * push * push * 0.62 * uCursorActive;
      vRim = push;
    } else {
      vRim = 0.0;
    }

    vHeight = p.y;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float dist = max(0.85, -mvPosition.z);
    float sizeJitter = 0.68 + fract(aSeed * 17.3) * 0.68 + midBell * 0.22;
    gl_PointSize = clamp((uPointScale * sizeJitter) / dist, 1.4, 13.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAG = `
  uniform vec3 uAccentTint;
  uniform float uOpacity;

  varying float vSeed;
  varying float vRim;
  varying float vSwirlMask;
  varying float vHeight;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;

    float z = sqrt(1.0 - r2);
    vec3 normal = normalize(vec3(uv.x, -uv.y, z));

    // Exact f09 & f10 Overhead Split-Ring Studio Halo Light + Pedestal Under-Cove Bounce!
    vec3 lightTop = normalize(vec3(0.14, 0.95, 0.32));
    vec3 lightBounce = normalize(vec3(-0.35, -0.82, 0.45));
    vec3 lightSide = normalize(vec3(-0.78, 0.18, 0.58));

    float topDiff = max(dot(normal, lightTop), 0.0);
    float bounceDiff = max(dot(normal, lightBounce), 0.0) * 0.34;
    float sideRim = pow(max(dot(normal, lightSide), 0.0), 2.2) * 0.28;

    // Matte frost-alabaster palette (#495262 deep shadow -> #9BA5B6 slate mid -> #F6FAFF halo highlight)
    float grain = (fract(vSeed * 43.7) - 0.5) * 0.11;
    vec3 shadowCol = vec3(0.285, 0.320, 0.382) + grain * 0.5;
    vec3 midCol = vec3(0.615, 0.655, 0.720) + grain;
    vec3 highCol = vec3(0.965, 0.982, 1.000);

    float lit = clamp(topDiff * 0.86 + bounceDiff + sideRim + clamp(vHeight * 0.12, -0.12, 0.18), 0.0, 1.0);
    vec3 col = mix(shadowCol, midCol, smoothstep(0.0, 0.56, lit));
    col = mix(col, highCol, smoothstep(0.52, 0.98, lit));

    // Subtle refined mineral accent glint (only on excited/swirling/specular voxels so alabaster purity stays intact!)
    float accentAmt = clamp(vSwirlMask * 0.34 + vRim * 0.72 + smoothstep(0.91, 0.995, fract(vSeed * 61.3)) * 0.22, 0.0, 0.78);
    col = mix(col, mix(col, uAccentTint, 0.65) + vec3(0.12), accentAmt);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

// 8-Tap Radial Zoom Blur + Prismatic Chromatic Dispersion + Optical Highlight Halation (exact f05, f08, f11!)
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
  uniform float uZoomBlur;
  uniform float uMistFlash;
  uniform float uTime;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 dir = vUv - center;
    float dist = length(dir);
    float edgeFactor = pow(dist * 1.42, 1.65);

    // 7-Tap Radial Zoom Motion Blur + Spectral RGB Dispersion (exact f05 & f11 shockwave!)
    float aber = (0.0011 + uChroma * 0.024) * edgeFactor;
    float zoomAmt = uZoomBlur * 0.085 * edgeFactor;

    vec3 acc = vec3(0.0);
    float totalW = 0.0;
    for (int i = 0; i < 7; i++) {
      float fi = float(i) / 6.0 - 0.5;
      float w = 1.0 - abs(fi) * 0.55;
      vec2 baseUv = vUv - dir * (fi * zoomAmt);

      float r = texture2D(tDiffuse, clamp(baseUv + dir * aber * (1.25 + fi * 0.4), 0.001, 0.999)).r;
      float g = texture2D(tDiffuse, clamp(baseUv + dir * aber * 0.12, 0.001, 0.999)).g;
      float b = texture2D(tDiffuse, clamp(baseUv - dir * aber * (1.15 - fi * 0.4), 0.001, 0.999)).b;
      acc += vec3(r, g, b) * w;
      totalW += w;
    }
    vec3 col = acc / totalW;

    // Dual-Radius Optical Bloom Halation for Dome Core, Stargate Ring, and Top Studio Halo!
    vec3 h1 = texture2D(tDiffuse, clamp(vUv + vec2(0.005, 0.005), 0.001, 0.999)).rgb;
    vec3 h2 = texture2D(tDiffuse, clamp(vUv + vec2(-0.005, 0.005), 0.001, 0.999)).rgb;
    vec3 h3 = texture2D(tDiffuse, clamp(vUv + vec2(0.005, -0.005), 0.001, 0.999)).rgb;
    vec3 h4 = texture2D(tDiffuse, clamp(vUv + vec2(-0.005, -0.005), 0.001, 0.999)).rgb;
    vec3 h5 = texture2D(tDiffuse, clamp(vUv + vec2(0.013, 0.0), 0.001, 0.999)).rgb;
    vec3 h6 = texture2D(tDiffuse, clamp(vUv + vec2(-0.013, 0.0), 0.001, 0.999)).rgb;
    vec3 h7 = texture2D(tDiffuse, clamp(vUv + vec2(0.0, 0.013), 0.001, 0.999)).rgb;
    vec3 h8 = texture2D(tDiffuse, clamp(vUv + vec2(0.0, -0.013), 0.001, 0.999)).rgb;
    vec3 bloomAvg = (h1 + h2 + h3 + h4) * 0.16 + (h5 + h6 + h7 + h8) * 0.09;
    float lum = dot(bloomAvg, vec3(0.299, 0.587, 0.114));
    col += bloomAvg * smoothstep(0.74, 0.99, lum) * 0.36;

    // Volumetric Cloud Bank Veil during deep cloud plunge (f06) & sub-crust storm crossing
    col = mix(col, vec3(0.73, 0.76, 0.81), uMistFlash * 0.68);

    // Subtle atmospheric vignette & tactile 35mm grain
    col *= 1.0 - smoothstep(0.48, 1.12, dist) * 0.17;
    float grain = (hash12(vUv * 980.0 + fract(uTime * 8.1)) - 0.5) * 0.02;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function smoothStep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const LOOP_DEPTH_Y = -60;
const STARGATE_Y = -15;
const CHAMBER_Y = -32;

export default function ObservatoryExperience({
  scrollProgressRef,
  loadProgress,
  onHoverTriangleChange,
  onProjectedCadChange,
  onActiveStageChange,
  onChamberMotionChange,
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
    onChamberMotionChange,
    onSelectProject,
  });

  loadRef.current = loadProgress;
  modalRef.current = modalOpen;
  callbacksRef.current = {
    onHoverTriangleChange,
    onProjectedCadChange,
    onActiveStageChange,
    onChamberMotionChange,
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
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const mistColor = new THREE.Color('#aeb5c1');
    scene.background = mistColor;
    scene.fog = new THREE.FogExp2('#aeb5c1', 0.031);

    const camera = new THREE.PerspectiveCamera(41, window.innerWidth / window.innerHeight, 0.1, 110);

    // Rich Arctic Overcast Lighting + Inner Core Spill + Pedestal Studio Key
    const hemi = new THREE.HemisphereLight(0xf7fbff, 0x7b8596, 2.15);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.05);
    sunLight.position.set(11, 16, -9);
    scene.add(sunLight);

    const frontFill = new THREE.DirectionalLight(0xdce8f8, 0.85);
    frontFill.position.set(-7, 5, 10);
    scene.add(frontFill);

    // Procedural High-Res Stone/Snow Textures + Volumetric Cloud Puff Texture
    const { bumpTex, albedoTex, roughTex } = createStoneTextures();
    const cloudTex = createCloudPuffTexture();

    const stoneMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      bumpMap: bumpTex,
      bumpScale: 0.11,
      roughnessMap: roughTex,
      roughness: 0.78,
      metalness: 0.05,
      vertexColors: true,
      emissive: new THREE.Color('#1c222c'),
      emissiveIntensity: 0.36,
      transparent: true,
      opacity: 1,
    });

    // Blazing white energy keystone material (for the glowing floating blocks in f11!)
    const radiantBlockMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      roughness: 0.25,
      metalness: 0.0,
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#eef9ff'),
      emissiveIntensity: 1.65,
      transparent: true,
      opacity: 1,
    });

    const wireBlockMat = new THREE.LineBasicMaterial({
      color: 0xf4f9ff,
      transparent: true,
      opacity: 0.85,
    });

    const wireTerrainMat = new THREE.MeshBasicMaterial({
      color: 0xf0f6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.26,
    });

    // 0. ARCTIC SKY DOME & VOLUMETRIC DRIFTING CLOUD BANKS
    const { skyDome, skyMat, cloudGroup, cloudSprites } = buildArcticAtmosphere(cloudTex);
    scene.add(skyDome);
    scene.add(cloudGroup);

    // 1. SURFACE WORLD (dynamically anchored at y = 0 for p < 0.72, and y = -60 for p >= 0.72 so Infinite Loop has ZERO teleport!)
    const surfaceWorld = new THREE.Group();
    scene.add(surfaceWorld);

    const corePointLight = new THREE.PointLight(0xeef9ff, 6.8, 16, 1.4);
    corePointLight.position.set(0.35, 0.85, 0.35);
    surfaceWorld.add(corePointLight);

    const { group: domeGroup, blocks: domeBlocks, coreMesh, crownGlow } = buildObservatoryDome(
      stoneMat,
      radiantBlockMat,
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

    // 2. STARGATE PORTAL RING (y = -15)
    const stargate = buildStoneStargateRing(stoneMat);
    stargate.group.position.set(0, STARGATE_Y, 0);
    stargate.group.rotation.x = Math.PI * 0.5;
    scene.add(stargate.group);

    // 3. SUB-SURFACE HALO PEDESTAL CHAMBER (y = -32) + 42,000-Voxel Sculptures
    const chamberWorld = new THREE.Group();
    chamberWorld.position.set(0, CHAMBER_Y, 0);
    scene.add(chamberWorld);

    const chamberHaloLight = new THREE.PointLight(0xf4fbff, 4.2, 18, 1.3);
    chamberHaloLight.position.set(0, 2.6, 1.2);
    chamberWorld.add(chamberHaloLight);

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
        uPointScale: { value: 23.5 * dpr },
        uCursorWorld: { value: new THREE.Vector3(0, 0, 0) },
        uCursorActive: { value: 0 },
        uAccentTint: { value: new THREE.Color(PROJECTS[0].tokens.accent) },
        uOpacity: { value: 1 },
      },
    });

    const sculpturePoints = new THREE.Points(particleGeo, particleMat);
    sculpturePoints.scale.setScalar(0.66);
    sculpturePoints.position.y = 0.08;
    chamberWorld.add(sculpturePoints);

    // 4. WIND-BLOWN ARCTIC SPINDRIFT SNOW & CHASM MOTES (1,800 animated particles across y = +12..-64)
    const snowCount = 1800;
    const snowPos = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 26;
      snowPos[i * 3 + 1] = 10 - Math.random() * 74;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    const snowGeo = new THREE.BufferGeometry();
    const snowAttr = new THREE.BufferAttribute(snowPos, 3);
    snowGeo.setAttribute('position', snowAttr);
    const snowMat = new THREE.PointsMaterial({
      color: 0xf6faff,
      size: 0.055,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    });
    const snowField = new THREE.Points(snowGeo, snowMat);
    scene.add(snowField);

    // Single-Pass FBO Post-Processing Setup
    const renderTarget = new THREE.WebGLRenderTarget(
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
        uZoomBlur: { value: 0 },
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

    const pointerNDC = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    let pointerVelocity = 0;
    const raycaster = new THREE.Raycaster();

    const onPointerMove = (e) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
      pointerVelocity = Math.min(
        1.6,
        pointerVelocity + Math.hypot(nx - pointerNDC.x, ny - pointerNDC.y) * 3.8
      );
      pointerNDC.set(nx, ny);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onCanvasClick = (e) => {
      if (modalRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const cy = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      const p = scrollProgressRef.current;
      if (p >= 0.28 && p < 0.80 && Math.hypot(cx, cy) < 0.44) {
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

    // Exact Hero Resting Anchor (medium-wide f04 Arctic ridge framing with 45% open sky + distant right peak!)
    const HERO_X = 2.25;
    const HERO_Y = 2.12;
    const HERO_Z = 8.15;
    const HERO_LOOK_X = 0.32;
    const HERO_LOOK_Y = 1.18;
    const HERO_LOOK_Z = 0.18;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      frameCounter += 1;

      smoothPointer.lerp(pointerNDC, Math.min(1, dt * 5.2));
      pointerVelocity = Math.max(0, pointerVelocity - dt * 2.2);

      const loadP = loadRef.current;
      const p = scrollProgressRef.current;

      let dP = p - prevProgress;
      if (dP > 0.5) dP -= 1;
      if (dP < -0.5) dP += 1;
      prevProgress = p;
      const scrollSpeed = Math.min(1.8, Math.abs(dP) * 52);

      // ============================================================
      // ZERO-TELEPORT CYCLIC SURFACE ANCHOR:
      // p < 0.72  -> surfaceWorld sits at y = 0
      // p >= 0.72 -> surfaceWorld sits at y = -60 directly below the Vortex!
      // At p = 1.000 -> 0.000, relative camera & block state match to 0.0000m!
      // ============================================================
      const surfaceAnchorY = p >= 0.72 ? LOOP_DEPTH_Y : 0;
      surfaceWorld.position.y = surfaceAnchorY;
      skyDome.position.y = surfaceAnchorY;
      skyMat.uniforms.uTime.value = elapsed;

      // Animate drifting volumetric clouds & wind-blown snow spindrift
      cloudSprites.forEach((sp) => {
        const u = sp.userData;
        sp.position.x = u.baseX + Math.sin(elapsed * u.speed + u.phase) * 1.65;
      });

      const sArr = snowAttr.array;
      for (let i = 0; i < snowCount; i++) {
        const i3 = i * 3;
        sArr[i3] += dt * 1.45;
        sArr[i3 + 1] -= dt * 0.65;
        if (sArr[i3] > 13) sArr[i3] = -13;
        if (sArr[i3 + 1] < -64) sArr[i3 + 1] = 10;
      }
      snowAttr.needsUpdate = true;

      // ============================================================
      // BEAT 0: ISOMETRIC WIREFRAME CAD -> SOLID FROST MATERIALIZATION (f01 -> f03 -> f04)
      // ============================================================
      const solidReveal = smoothStep(0.48, 0.95, loadP);
      const cadFade = 1 - smoothStep(0.68, 0.99, loadP);
      cadGroup.visible = cadFade > 0.01 && p < 0.16;
      cadLineMat.opacity = cadFade * 0.55;
      terrainMesh.visible = solidReveal > 0.02;
      stoneMat.opacity = Math.max(0.08, solidReveal);
      radiantBlockMat.opacity = Math.max(0.15, solidReveal);
      terrainWire.visible = loadP > 0.26 && cadFade > 0.02 && p < 0.16;
      terrainWire.material.opacity = Math.sin(smoothStep(0.26, 1.0, loadP) * Math.PI) * 0.44;
      // Subtle hairline block edges disappear once materialized so tight glowing mortar seams shine cleanly like f04!
      wireBlockMat.opacity = THREE.MathUtils.lerp(0.88, 0.04, solidReveal);
      coreMesh.material.opacity = THREE.MathUtils.lerp(0.55, 1.0, solidReveal);
      crownGlow.visible = loadP < 0.92;
      crownGlow.material.opacity = (1 - smoothStep(0.65, 0.92, loadP)) * 0.95;

      // ============================================================
      // CONTINUOUS ZERO-TELEPORT CAMERA & FOV CHOREOGRAPHY
      // ============================================================
      const camPos = new THREE.Vector3();
      const camLook = new THREE.Vector3();
      let targetFov = 41;
      let targetRoll = 0;

      if (loadP < 0.99) {
        // High isometric CAD survey angle (f01 & f03) sweeping into Hero ridge framing (f04)
        const sweep = smoothStep(0.54, 1.0, loadP);
        camPos.set(
          THREE.MathUtils.lerp(5.8, HERO_X, sweep),
          THREE.MathUtils.lerp(5.9, HERO_Y, sweep),
          THREE.MathUtils.lerp(6.4, HERO_Z, sweep)
        );
        camLook.set(
          THREE.MathUtils.lerp(0.15, HERO_LOOK_X, sweep),
          THREE.MathUtils.lerp(0.55, HERO_LOOK_Y, sweep),
          THREE.MathUtils.lerp(0.15, HERO_LOOK_Z, sweep)
        );
        targetFov = THREE.MathUtils.lerp(36, 41, sweep);
      } else if (p < 0.115) {
        // Beat 1b: Explosive Dome Shatter Dead-Center with Radial Rainbow Zoom Dispersion & Billowing Clouds (exact f05!)
        const t = smoothStep(0.025, 0.115, p);
        const pointerWeight = 1 - t;
        camPos.set(
          THREE.MathUtils.lerp(HERO_X, 0.75, t) + smoothPointer.x * 0.55 * pointerWeight,
          THREE.MathUtils.lerp(HERO_Y, 1.85, t) + smoothPointer.y * 0.26 * pointerWeight,
          THREE.MathUtils.lerp(HERO_Z, 5.65, t)
        );
        camLook.set(
          THREE.MathUtils.lerp(HERO_LOOK_X, 0.15, t),
          THREE.MathUtils.lerp(HERO_LOOK_Y, 1.05, t),
          THREE.MathUtils.lerp(HERO_LOOK_Z, 0.1, t)
        );
        targetFov = 41 + t * 13;
        targetRoll = t * 0.05;
      } else if (p < 0.165) {
        // Cloud Plunge from Shattered Core straight into Stargate Axis (f06!)
        const t = smoothStep(0.115, 0.165, p);
        camPos.set(
          THREE.MathUtils.lerp(0.75, 0.0, t),
          THREE.MathUtils.lerp(1.85, -6.2, Math.pow(t, 1.2)),
          THREE.MathUtils.lerp(5.65, 0.26, t)
        );
        camLook.set(
          THREE.MathUtils.lerp(0.15, 0.0, t),
          THREE.MathUtils.lerp(1.05, STARGATE_Y - 0.5, t),
          0
        );
        targetFov = THREE.MathUtils.lerp(54, 52, t);
        targetRoll = (1 - t) * 0.05;
      } else if (p < 0.28) {
        // Beat 2: Plunge straight through the blazing 8-Segment Stone Stargate Ring (y = -15, f08) into Wide Halo Chamber!
        const t = smoothStep(0.165, 0.28, p);
        const settle = smoothStep(0.42, 1.0, t);
        camPos.set(
          THREE.MathUtils.lerp(0.0, -2.25, settle) + smoothPointer.x * 0.28,
          THREE.MathUtils.lerp(-6.2, CHAMBER_Y + 1.46, Math.pow(t, 0.92)),
          THREE.MathUtils.lerp(0.26, 6.95, settle)
        );
        camLook.set(
          0,
          THREE.MathUtils.lerp(STARGATE_Y - 0.5, CHAMBER_Y - 0.26, t),
          0
        );
        targetFov = THREE.MathUtils.lerp(52, 42, settle);
        targetRoll = (1 - settle) * -0.05;
      } else if (p < 0.78) {
        // Beat 3: 5 Dynamic Sculptural Chambers (exact f10 framing showing Top Split-Ring Halo + Sculpture + All 4 Pedestal Steps!)
        const chamberFloat = ((p - 0.28) / 0.50) * 5.0;
        const localU = chamberFloat - Math.floor(chamberFloat);
        const morphBell = Math.exp(-Math.pow((localU - 0.80) / 0.16, 2));

        const sweepAngle = (localU - 0.36) * 0.68 + smoothPointer.x * 0.32;
        const radius = 7.18 + morphBell * 0.72;
        const camHeight = CHAMBER_Y + 1.46 + morphBell * 0.32 + smoothPointer.y * 0.28;

        camPos.set(
          Math.sin(sweepAngle) * radius,
          camHeight,
          Math.cos(sweepAngle) * radius
        );
        camLook.set(0, CHAMBER_Y - 0.26 + morphBell * 0.1, 0);
        targetFov = 42 + morphBell * 5.5;
        targetRoll = Math.sin(sweepAngle) * 0.025 + dP * 1.8;
      } else if (p < 0.895) {
        // Beat 4: Towering Cyclone Vortex -> Headfirst Dive Into the Eye of the Vortex & Sub-Crust Storm Chasm!
        const t = smoothStep(0.78, 0.895, p);
        const dive = smoothStep(0.48, 1.0, t);
        camPos.set(
          THREE.MathUtils.lerp(1.4, 0.45, t) + smoothPointer.x * 0.55 * (1 - dive),
          THREE.MathUtils.lerp(CHAMBER_Y + 2.15, -49.5, Math.pow(dive, 1.25)),
          THREE.MathUtils.lerp(6.85, 3.8, t)
        );
        camLook.set(
          0,
          THREE.MathUtils.lerp(CHAMBER_Y - 0.55, LOOP_DEPTH_Y + 1.8, dive),
          0
        );
        targetFov = THREE.MathUtils.lerp(43, 55, dive);
        targetRoll = dive * 0.1;
      } else {
        // Beat 5: DRAMATIC f11 EMERGENCE ON ARCTIC SUMMIT (y = -60) WITH OPEN SKY + DISTANT PEAKS + FLOATING REASSEMBLING BLOCKS!
        const t = smoothStep(0.895, 1.0, p);
        const pointerWeight = smoothStep(0.45, 1.0, t);
        camPos.set(
          THREE.MathUtils.lerp(0.95, HERO_X, t) + smoothPointer.x * 0.55 * pointerWeight,
          LOOP_DEPTH_Y + THREE.MathUtils.lerp(3.25, HERO_Y, Math.pow(t, 0.88)) + smoothPointer.y * 0.26 * pointerWeight,
          THREE.MathUtils.lerp(10.2, HERO_Z, t)
        );
        camLook.set(
          THREE.MathUtils.lerp(0.22, HERO_LOOK_X, t),
          LOOP_DEPTH_Y + THREE.MathUtils.lerp(1.45, HERO_LOOK_Y, t),
          THREE.MathUtils.lerp(0.15, HERO_LOOK_Z, t)
        );
        targetFov = THREE.MathUtils.lerp(48, 41, t);
        targetRoll = (1 - t) * 0.06;
      }

      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, dt * 9));
      camera.updateProjectionMatrix();
      camera.position.copy(camPos);
      camera.up.set(Math.sin(targetRoll), Math.cos(targetRoll), 0);
      camera.lookAt(camLook);

      // ============================================================
      // COURSE-BY-COURSE STAGGERED MASONRY EXPLOSION (f05) & RE-ASSEMBLY (f11 -> f04)
      // Bottom foundation seats first on snow while crown blocks float high in zero-G!
      // ============================================================
      const plungeRaw = p >= 0.032 && p <= 0.22 ? smoothStep(0.032, 0.145, p) : 0;
      const reassembleRaw = p >= 0.86 ? 1 - smoothStep(0.90, 0.996, p) : 0;

      let hoveredBlock = null;
      if (loadP >= 0.98 && (p < 0.09 || p > 0.965) && !modalRef.current) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(domeBlocks, false);
        if (hits.length > 0) hoveredBlock = hits[0].object;
      }

      domeBlocks.forEach((b) => {
        const u = b.userData;
        // Upper courses (courseNorm -> 1) lift earlier on plunge and land last on reassembly (exact f11!)
        const courseDelay = (1 - u.courseNorm) * 0.36;
        const blockExplode =
          plungeRaw > 0
            ? Math.max(0, Math.min(1, (plungeRaw - courseDelay * 0.55) / (1 - courseDelay * 0.55)))
            : 0;
        const blockReassemble =
          reassembleRaw > 0
            ? Math.max(0, Math.min(1, (reassembleRaw - courseDelay) / Math.max(0.25, 1 - courseDelay)))
            : 0;
        const burst = Math.max(blockExplode, blockReassemble);

        const isNearHover =
          hoveredBlock && u.basePos.distanceTo(hoveredBlock.userData.basePos) < 1.1;
        const targetLift = isNearHover ? (b === hoveredBlock ? 0.34 : 0.14) : 0;
        u.hoverLift = THREE.MathUtils.lerp(u.hoverLift, targetLift, Math.min(1, dt * 8.5));

        const easedBurst = burst * burst * (3 - 2 * burst);
        const totalOffset = easedBurst * u.scatterDist + u.hoverLift;
        b.position.copy(u.basePos).addScaledVector(u.scatterDir, totalOffset);
        b.quaternion.copy(u.baseQuat);
        if (easedBurst > 0.001) {
          b.rotateOnAxis(u.rotAxis, easedBurst * 1.28);
        }
      });

      // Project 3 nearby block centers to 2D screen coordinates for the f04 1px tracking triangle!
      if (frameCounter % 2 === 0) {
        if (hoveredBlock && plungeRaw < 0.18 && reassembleRaw < 0.18) {
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
              m.getWorldPosition(tmpVec).project(camera);
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

        if (cadFade > 0.08 && p < 0.16) {
          const pts = cadAnchors.map((a) => {
            tmpVec.copy(a.pos).add(surfaceWorld.position).project(camera);
            return {
              x: (tmpVec.x * 0.5 + 0.5) * window.innerWidth,
              y: (-tmpVec.y * 0.5 + 0.5) * window.innerHeight,
              val: Math.min(99, Math.round(a.num * loadP + 4)),
            };
          });
          callbacksRef.current.onProjectedCadChange?.(pts);
        } else {
          callbacksRef.current.onProjectedCadChange?.([]);
        }
      }

      // ============================================================
      // STARGATE PORTAL & 42,000-VOXEL CURL-NOISE MORPHING (01..05 + VORTEX)
      // ============================================================
      stargate.glowRing.rotation.z = -elapsed * 0.42;
      stargate.plasmaDisc.rotation.z = elapsed * 0.24;
      stargate.innerSegs.forEach((seg) => {
        seg.rotation.z = -elapsed * 0.18;
      });

      let morphFloat = 0;
      let chamberPresence = 1;
      let easedMorph = 0;
      let idxA = 0;
      let idxB = 1;

      if (p >= 0.28 && p < 0.78) {
        morphFloat = ((p - 0.28) / 0.50) * 4.999;
        idxA = Math.min(4, Math.max(0, Math.floor(morphFloat)));
        idxB = Math.min(5, idxA + 1);
        const localFrac = morphFloat - idxA;
        easedMorph = smoothStep(0.56, 0.98, localFrac);
        chamberPresence = 1 - Math.sin(easedMorph * Math.PI) * 0.88;
      } else if (p >= 0.78) {
        idxA = 4;
        idxB = 5;
        easedMorph = smoothStep(0.765, 0.81, p);
        chamberPresence = 1;
      }

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
      particleMat.uniforms.uTurbulence.value =
        Math.sin(easedMorph * Math.PI) * 0.55 +
        scrollSpeed * 0.28 +
        (idxA === 5 ? 0.38 + pointerVelocity * 0.45 : 0);

      const colHexA = idxA < 5 ? PROJECTS[idxA].tokens.accent : '#7DD3FC';
      const colHexB = idxB < 5 ? PROJECTS[idxB].tokens.accent : '#93C5FD';
      accentA.set(colHexA);
      accentB.set(colHexB);
      particleMat.uniforms.uAccentTint.value.copy(accentA).lerp(accentB, easedMorph);

      // Scroll-coupled 3D sculptural rotation + subtle ambient turntable!
      if (p >= 0.28 && p < 0.80) {
        const scrollTurn = ((p - 0.28) / 0.52) * Math.PI * 3.2;
        sculpturePoints.rotation.y = scrollTurn + elapsed * 0.18 + smoothPointer.x * 0.48;
      } else {
        sculpturePoints.rotation.y = elapsed * 0.85 + smoothPointer.x * 0.55;
      }

      pedestal.cageMesh.rotation.y = -elapsed * 0.07;
      pedestal.haloMesh.rotation.y = elapsed * 0.16;
      pedestal.lightCurtain.rotation.y = elapsed * 0.09;

      particleMat.uniforms.uCursorWorld.value.set(smoothPointer.x * 2.4, smoothPointer.y * 1.8, 0.6);
      particleMat.uniforms.uCursorActive.value = p >= 0.28 && p <= 0.89 ? 1.0 : 0.0;

      // Stream continuous chamber motion envelope so HUD titles & plaques glide/dissolve instead of snapping!
      if (frameCounter % 2 === 0) {
        callbacksRef.current.onChamberMotionChange?.({
          presence: chamberPresence,
          morph: easedMorph,
          velocity: scrollSpeed,
        });
      }

      let stageInfo = { mode: 'hero', projectIdx: -1 };
      if (loadP < 0.99) {
        stageInfo = { mode: 'loading', projectIdx: -1 };
      } else if (p < 0.13 || p >= 0.90) {
        stageInfo = { mode: 'hero', projectIdx: -1 };
      } else if (p < 0.28) {
        stageInfo = { mode: 'plunge', projectIdx: 0 };
      } else if (p < 0.78) {
        const activeIdx = Math.min(4, Math.max(0, Math.floor(morphFloat + 0.22)));
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
      // POST-PROCESSING UNIFORMS (f05 Shatter Shockwave + f06 Cloud Veil + f11 Loop Surge!)
      // ============================================================
      const plungeShock = p > 0.04 && p < 0.22 ? Math.sin(smoothStep(0.04, 0.22, p) * Math.PI) : 0;
      const vortexDiveShock =
        p > 0.84 && p < 0.985 ? Math.sin(smoothStep(0.84, 0.985, p) * Math.PI) : 0;

      postMat.uniforms.uChroma.value = Math.min(
        1.45,
        plungeShock * 1.05 + vortexDiveShock * 0.95 + scrollSpeed * 0.55
      );
      postMat.uniforms.uZoomBlur.value = Math.min(
        1.35,
        plungeShock * 0.95 + vortexDiveShock * 1.05 + scrollSpeed * 0.45
      );

      const mistPlunge = p > 0.12 && p < 0.19 ? Math.sin(((p - 0.12) / 0.07) * Math.PI) : 0;
      const mistStormChasm =
        p > 0.865 && p < 0.925 ? Math.sin(((p - 0.865) / 0.06) * Math.PI) : 0;
      postMat.uniforms.uMistFlash.value = Math.max(mistPlunge * 0.72, mistStormChasm * 0.86);
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
      roughTex.dispose();
      cloudTex.dispose();
      stoneMat.dispose();
      radiantBlockMat.dispose();
      wireBlockMat.dispose();
      wireTerrainMat.dispose();
      skyMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      snowGeo.dispose();
      snowMat.dispose();
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

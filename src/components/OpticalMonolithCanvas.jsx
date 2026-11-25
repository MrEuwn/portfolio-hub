import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;

  void main() {
    vLocalPos = position;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPos;
  }
`;

// Clear optical Fresnel glass shader: ~0.07 interior alpha so underlying HTML hairline grid
// and Instrument Serif typography remain crisp with zero milky cloudiness.
const FRAGMENT_SHADER = `
  uniform vec3 uAccent;
  uniform vec3 uSecondary;
  uniform vec2 uPointer;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    float ndotv = abs(dot(N, V));
    float fresnel = pow(1.0 - ndotv, 2.55);

    vec3 lightDirA = normalize(vec3(0.55 + uPointer.x * 0.4, 0.78 - uPointer.y * 0.3, 0.85));
    vec3 lightDirB = normalize(vec3(-0.65, -0.35, 0.65));

    vec3 halfA = normalize(lightDirA + V);
    vec3 halfB = normalize(lightDirB + V);
    float specA = pow(max(dot(N, halfA), 0.0), 68.0);
    float specB = pow(max(dot(N, halfB), 0.0), 34.0);

    // Subtle chromatic dispersion along beveled edges
    float edgeBand = smoothstep(0.32, 0.94, fresnel);
    vec3 baseTint = mix(vec3(0.08, 0.08, 0.09), uAccent, 0.42);
    vec3 rimCol = mix(uAccent, uSecondary, 0.5 + 0.5 * sin(vLocalPos.y * 2.2 + uTime * 0.7));

    vec3 color = mix(baseTint, rimCol, edgeBand * 0.86);
    color += vec3(1.0, 0.99, 0.96) * (specA * 0.95 + specB * 0.35);

    // Low interior alpha (~0.065) rising to crisp specular rim (~0.72)
    float alpha = clamp(0.065 + fresnel * 0.66 + specA * 0.55, 0.06, 0.86);
    gl_FragColor = vec4(color, alpha);
  }
`;

function createFiveFacetPrism() {
  const shape = new THREE.Shape();
  const radius = 2.05;
  const sides = 5;
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.14,
    bevelSegments: 4,
    curveSegments: 12,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export default function OpticalMonolithCanvas({ activeWorld, suspended = false }) {
  const canvasRef = useRef(null);
  const accentRef = useRef(activeWorld?.tokens?.accent || '#D9381E');
  const suspendedRef = useRef(suspended);

  useEffect(() => {
    accentRef.current = activeWorld?.tokens?.accent || '#D9381E';
  }, [activeWorld]);

  useEffect(() => {
    suspendedRef.current = suspended;
  }, [suspended]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0, 10.5);

    const mainGeo = createFiveFacetPrism();
    const ringGeo = new THREE.TorusGeometry(2.75, 0.032, 16, 80);

    const targetColor = new THREE.Color(accentRef.current);
    const currentColor = targetColor.clone();

    const glassMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uAccent: { value: currentColor },
        uSecondary: { value: new THREE.Color('#38BDF8') },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
      },
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0d0d0d,
      transparent: true,
      opacity: 0.14,
      wireframe: true,
    });

    const ringMat = new THREE.MeshBasicMaterial({
      color: targetColor.clone(),
      transparent: true,
      opacity: 0.28,
    });

    const group = new THREE.Group();
    const prismMesh = new THREE.Mesh(mainGeo, glassMat);
    const wireMesh = new THREE.Mesh(mainGeo, wireMat);
    wireMesh.scale.setScalar(1.015);
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI * 0.36;
    orbitalRing.rotation.y = Math.PI * 0.14;

    group.add(prismMesh);
    group.add(wireMesh);
    group.add(orbitalRing);
    scene.add(group);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = Math.max(1, parent.clientWidth);
      const h = Math.max(1, parent.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Offset slightly right-of-center on wide desktop so left serif H1 remains crystal legible
      const isNarrow = w < 900;
      group.position.set(isNarrow ? 0 : 1.95, isNarrow ? 0.35 : 0.18, 0);
      group.scale.setScalar(isNarrow ? 0.68 : 1.0);
    };

    resize();
    window.addEventListener('resize', resize);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    const onPointerMove = (e) => {
      pointerTarget.set(
        (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1
      );
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (suspendedRef.current) return;

      // Skip GPU work when scrolled well past hero viewport
      const vh = window.innerHeight || 900;
      if (window.scrollY > vh * 1.35) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      targetColor.set(accentRef.current);
      currentColor.lerp(targetColor, Math.min(1, dt * 5.2));
      ringMat.color.copy(currentColor);

      if (!reduced) {
        pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 4.0));
        glassMat.uniforms.uTime.value = elapsed;
        glassMat.uniforms.uPointer.value.copy(pointerCurrent);

        const scrollFactor = Math.min(1, window.scrollY / Math.max(1, vh));
        prismMesh.rotation.x = 0.24 + elapsed * 0.16 + pointerCurrent.y * 0.25 + scrollFactor * 0.9;
        prismMesh.rotation.y = elapsed * 0.26 + pointerCurrent.x * 0.35 + scrollFactor * 1.4;
        wireMesh.rotation.copy(prismMesh.rotation);

        orbitalRing.rotation.z = -elapsed * 0.22;
        orbitalRing.rotation.x = Math.PI * 0.36 + pointerCurrent.y * 0.16;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      mainGeo.dispose();
      ringGeo.dispose();
      glassMat.dispose();
      wireMat.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="optical-monolith-canvas" aria-hidden="true" />;
}

import * as THREE from 'three';

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm2(x, y, octaves = 5) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * valueNoise(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return val;
}

export function createStoneTextures() {
  const size = 256;
  const bumpData = new Uint8Array(size * size * 4);
  const colorData = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 8;
      const ny = (y / size) * 8;
      const n = fbm2(nx, ny, 5);
      const ridge = Math.abs(fbm2(nx * 2.4 + 3.1, ny * 2.4 - 1.7, 3) - 0.5) * 2;
      const h = Math.max(0, Math.min(255, Math.round((n * 0.72 + (1 - ridge) * 0.28) * 255)));

      const idx = (y * size + x) * 4;
      bumpData[idx] = h;
      bumpData[idx + 1] = h;
      bumpData[idx + 2] = h;
      bumpData[idx + 3] = 255;

      const base = 206 + Math.round((n - 0.5) * 54);
      colorData[idx] = Math.max(0, Math.min(255, base - 3));
      colorData[idx + 1] = Math.max(0, Math.min(255, base + 1));
      colorData[idx + 2] = Math.max(0, Math.min(255, base + 10));
      colorData[idx + 3] = 255;
    }
  }

  const bumpTex = new THREE.DataTexture(bumpData, size, size, THREE.RGBAFormat);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(3, 3);
  bumpTex.needsUpdate = true;

  const albedoTex = new THREE.DataTexture(colorData, size, size, THREE.RGBAFormat);
  albedoTex.wrapS = THREE.RepeatWrapping;
  albedoTex.wrapT = THREE.RepeatWrapping;
  albedoTex.repeat.set(3, 3);
  albedoTex.colorSpace = THREE.SRGBColorSpace;
  albedoTex.needsUpdate = true;

  return { bumpTex, albedoTex };
}

function createBeveledBlockGeometry(w, h, d, seed = 1) {
  const geo = new THREE.BoxGeometry(w, h, d, 4, 3, 3);
  const pos = geo.attributes.position;
  const hw = w * 0.5;
  const hh = h * 0.5;
  const hd = d * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Chamfer corners slightly so blocks catch crisp icy rim highlights like f04 & f11
    const ex = Math.abs(x) / hw;
    const ey = Math.abs(y) / hh;
    const ez = Math.abs(z) / hd;
    const corner = Math.max(0, ex + ey + ez - 1.85) * 0.14;
    x *= 1 - corner;
    y *= 1 - corner;
    z *= 1 - corner;

    const chisel = (fbm2(x * 2.5 + seed * 7.1, y * 2.5 + z * 2.1, 3) - 0.5) * 0.055;
    pos.setXYZ(i, x + chisel, y + chisel * 0.8, z + chisel);
  }

  geo.computeVertexNormals();
  return geo;
}

export function buildObservatoryDome(stoneMat, wireMat) {
  const group = new THREE.Group();
  const blocks = [];
  const R = 2.35;

  // 5 concentric masonry courses + crown cap + arched entrance tunnel (distinct octagonal-beveled observatory masonry)
  const courses = [
    { phi: 1.38, count: 14, h: 0.52, skipEntrance: true },
    { phi: 1.13, count: 13, h: 0.52, skipEntrance: true },
    { phi: 0.88, count: 11, h: 0.50, skipEntrance: false },
    { phi: 0.63, count: 9, h: 0.48, skipEntrance: false },
    { phi: 0.37, count: 6, h: 0.44, skipEntrance: false },
  ];

  let blockIndex = 1;
  courses.forEach((course, rIdx) => {
    const ringRadius = Math.sin(course.phi) * R;
    const y = Math.cos(course.phi) * R * 0.92;
    const arcWidth = ((Math.PI * 2 * ringRadius) / course.count) * 0.91;

    for (let i = 0; i < course.count; i++) {
      const theta = (i / course.count) * Math.PI * 2 + (rIdx % 2) * (Math.PI / course.count);
      // Leave portal opening around front-right angle (theta ~ 0.65 rad)
      const angleDiff = Math.atan2(Math.sin(theta - 0.62), Math.cos(theta - 0.62));
      if (course.skipEntrance && Math.abs(angleDiff) < 0.34) continue;

      const bGeo = createBeveledBlockGeometry(
        Math.max(0.42, arcWidth),
        course.h * 0.88,
        0.46,
        blockIndex
      );
      const mesh = new THREE.Mesh(bGeo, stoneMat);

      const nx = Math.sin(course.phi) * Math.sin(theta);
      const ny = Math.cos(course.phi);
      const nz = Math.sin(course.phi) * Math.cos(theta);
      const basePos = new THREE.Vector3(nx * R, y, nz * R);
      const normal = new THREE.Vector3(nx, ny * 0.85, nz).normalize();

      mesh.position.copy(basePos);
      mesh.lookAt(basePos.clone().add(normal));

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(bGeo, 24), wireMat);
      mesh.add(edges);

      // Deterministic scatter vector for the dramatic f05 / f11 block explosion & reassembly
      const scatterDir = normal
        .clone()
        .add(
          new THREE.Vector3(
            (hash2(blockIndex, 1.7) - 0.5) * 0.7,
            0.35 + hash2(blockIndex, 3.1) * 0.65,
            (hash2(blockIndex, 5.3) - 0.5) * 0.7
          )
        )
        .normalize();

      const rotAxis = new THREE.Vector3(
        hash2(blockIndex, 9.2) - 0.5,
        hash2(blockIndex, 4.8) - 0.5,
        hash2(blockIndex, 2.6) - 0.5
      ).normalize();

      mesh.userData = {
        id: blockIndex,
        code: String(blockIndex).padStart(2, '0'),
        basePos,
        baseQuat: mesh.quaternion.clone(),
        normal,
        scatterDir,
        scatterDist: 1.5 + hash2(blockIndex, 8.4) * 2.8,
        rotAxis,
        hoverLift: 0,
        edges,
      };

      group.add(mesh);
      blocks.push(mesh);
      blockIndex += 1;
    }
  });

  // Entrance Vestibule Arch (matching the iconic stepped portal arch in f03 / f04)
  const archDir = new THREE.Vector3(Math.sin(0.62), 0, Math.cos(0.62)).normalize();
  const archRight = new THREE.Vector3(archDir.z, 0, -archDir.x);
  for (let step = 0; step < 2; step++) {
    for (let a = 0; a < 5; a++) {
      const ang = -Math.PI * 0.42 + (a / 4) * Math.PI * 0.84;
      const archR = 0.88;
      const localX = Math.sin(ang) * archR;
      const localY = Math.cos(ang) * archR + 0.34;
      const forward = 2.28 + step * 0.54;

      const bGeo = createBeveledBlockGeometry(0.46, 0.36, 0.48, blockIndex);
      const mesh = new THREE.Mesh(bGeo, stoneMat);
      const basePos = new THREE.Vector3()
        .addScaledVector(archDir, forward)
        .addScaledVector(archRight, localX)
        .add(new THREE.Vector3(0, localY, 0));

      const normal = new THREE.Vector3()
        .addScaledVector(archRight, Math.sin(ang))
        .add(new THREE.Vector3(0, Math.cos(ang), 0))
        .addScaledVector(archDir, 0.25)
        .normalize();

      mesh.position.copy(basePos);
      mesh.lookAt(basePos.clone().add(archDir));
      mesh.rotateZ(-ang);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(bGeo, 24), wireMat);
      mesh.add(edges);

      mesh.userData = {
        id: blockIndex,
        code: String(blockIndex).padStart(2, '0'),
        basePos,
        baseQuat: mesh.quaternion.clone(),
        normal,
        scatterDir: normal.clone(),
        scatterDist: 1.4 + hash2(blockIndex, 6.1) * 1.9,
        rotAxis: new THREE.Vector3(0.4, 0.7, 0.2).normalize(),
        hoverLift: 0,
        edges,
      };

      group.add(mesh);
      blocks.push(mesh);
      blockIndex += 1;
    }
  }

  // Blinding White-Cyan Inner Energy Core inside the Observatory Masonry (exact f04 & f11 core glow!)
  const coreGeo = new THREE.SphereGeometry(2.02, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.56);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xf4fbff,
    side: THREE.DoubleSide,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.y = 0.02;
  group.add(coreMesh);

  return { group, blocks, coreMesh };
}

export function buildIsometricCadLattice() {
  const group = new THREE.Group();
  const points = [];
  const anchors = [];

  // Isometric 3D architectural bounding boxes & spatial survey lines (exact f01 & f02 CAD preloader!)
  const gridCoords = [-4.2, -2.1, 0, 2.1, 4.2];
  gridCoords.forEach((gx, xi) => {
    gridCoords.forEach((gz, zi) => {
      if (Math.abs(gx) + Math.abs(gz) > 6.5) return;
      const h = 0.4 + hash2(xi * 3.1, zi * 5.7) * 2.4;
      const y0 = -0.35;
      points.push(new THREE.Vector3(gx, y0, gz), new THREE.Vector3(gx, y0 + h, gz));
      points.push(new THREE.Vector3(gx - 0.9, y0 + h * 0.5, gz), new THREE.Vector3(gx + 0.9, y0 + h * 0.5, gz));
      points.push(new THREE.Vector3(gx, y0 + h * 0.5, gz - 0.9), new THREE.Vector3(gx, y0 + h * 0.5, gz + 0.9));

      if ((xi + zi) % 2 === 0) {
        anchors.push({
          pos: new THREE.Vector3(gx, y0 + h, gz),
          num: Math.round(8 + hash2(xi + 2, zi + 9) * 86),
        });
      }
    });
  });

  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.48,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  return { group, lineMat, anchors };
}

export function buildMountainTerrain(stoneMat, wireTerrainMat) {
  const group = new THREE.Group();
  const geo = new THREE.PlaneGeometry(38, 38, 84, 84);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.hypot(x, z);

    // Flat summit plateau around the observatory (dist < 3.1), dropping to rocky slopes and rising to distant peaks
    const plateau = Math.exp(-Math.pow(dist / 3.8, 2.4)) * 0.45;
    const slope = -Math.pow(Math.max(0, dist - 2.6) * 0.22, 1.25);
    const distantRidge =
      z < -4
        ? Math.pow(Math.max(0, -z - 4) * 0.28, 1.38) * (0.55 + fbm2(x * 0.18 + 4, z * 0.18, 4))
        : 0;
    const crag = (fbm2(x * 0.42 + 11.3, z * 0.42 + 5.7, 5) - 0.48) * 1.45 * Math.min(1, dist / 3.2);

    pos.setY(i, plateau + slope + distantRidge + crag - 0.35);
  }
  geo.computeVertexNormals();

  const terrainMesh = new THREE.Mesh(geo, stoneMat);
  const terrainWire = new THREE.Mesh(geo, wireTerrainMat);
  terrainWire.position.y = 0.015;

  group.add(terrainMesh);
  group.add(terrainWire);

  return { group, terrainMesh, terrainWire };
}

export function buildStoneStargateRing(stoneMat) {
  // Exact f07 & f08 8-segment carved stone portal ring + floating inner fractured arcs + glowing energy torus!
  const group = new THREE.Group();
  const outerSegs = [];
  const innerSegs = [];

  const segCount = 8;
  for (let i = 0; i < segCount; i++) {
    const arc = (Math.PI * 2) / segCount;
    const torusGeo = new THREE.TorusGeometry(2.75, 0.48, 14, 18, arc * 0.92);
    const pos = torusGeo.attributes.position;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k);
      const y = pos.getY(k);
      const z = pos.getZ(k);
      const n = (fbm2(x * 1.4 + i, y * 1.4, 3) - 0.5) * 0.06;
      pos.setXYZ(k, x + n, y + n, z + n);
    }
    torusGeo.computeVertexNormals();

    const m = new THREE.Mesh(torusGeo, stoneMat);
    m.rotation.z = i * arc + 0.04;
    group.add(m);
    outerSegs.push(m);
  }

  for (let i = 0; i < 6; i++) {
    const arc = 0.42 + (i % 3) * 0.32;
    const innerGeo = new THREE.TorusGeometry(1.38 + (i % 2) * 0.24, 0.2, 12, 14, arc);
    const m = new THREE.Mesh(innerGeo, stoneMat);
    m.rotation.set(i * 0.5, i * 0.8, i * 1.05);
    m.userData = { baseRot: m.rotation.clone(), speed: (i % 2 === 0 ? 1 : -1) * (0.28 + i * 0.07) };
    group.add(m);
    innerSegs.push(m);
  }

  const glowRingGeo = new THREE.TorusGeometry(2.26, 0.09, 16, 72);
  const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0xeaf8ff,
    transparent: true,
    opacity: 0.92,
  });
  const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
  group.add(glowRing);

  return { group, outerSegs, innerSegs, glowRing, glowRingMat };
}

export function buildSteppedHaloPedestal(stoneMat) {
  // Exact f09 & f10 4 concentric stepped circular stone platforms with recessed cyan-white light + overhead halo!
  const group = new THREE.Group();

  const steps = [
    { r: 4.8, h: 0.24, y: -2.42 },
    { r: 3.55, h: 0.24, y: -2.22 },
    { r: 2.38, h: 0.24, y: -2.02 },
    { r: 1.32, h: 0.22, y: -1.84 },
  ];

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xdcf4ff,
    transparent: true,
    opacity: 0.88,
  });

  steps.forEach((s) => {
    const cyl = new THREE.CylinderGeometry(s.r, s.r * 1.02, s.h, 56);
    const mesh = new THREE.Mesh(cyl, stoneMat);
    mesh.position.y = s.y;
    group.add(mesh);

    const lipGlow = new THREE.TorusGeometry(s.r * 0.99, 0.032, 10, 64);
    const gm = new THREE.Mesh(lipGlow, glowMat);
    gm.rotation.x = Math.PI / 2;
    gm.position.y = s.y + s.h * 0.45;
    group.add(gm);
  });

  // Overhead Glowing Studio Halo Ring (exact top center halo in f10!)
  const haloGeo = new THREE.TorusGeometry(1.45, 0.095, 16, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xf7fdff,
    transparent: true,
    opacity: 0.95,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.y = 2.48;
  group.add(haloMesh);

  // Subtle Geodesic Wireframe Containment Cage around the Pedestal (visible in f09 & f10!)
  const cageGeo = new THREE.IcosahedronGeometry(2.55, 2);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0xe6f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.09,
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  cageMesh.position.y = 0.15;
  group.add(cageMesh);

  return { group, haloMesh, cageMesh };
}

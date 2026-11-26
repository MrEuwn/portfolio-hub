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
    freq *= 2.04;
    amp *= 0.5;
  }
  return val;
}

export function ridgedFbm(x, y, octaves = 5) {
  let val = 0;
  let amp = 0.52;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(valueNoise(x * freq, y * freq) * 2 - 1);
    val += n * n * amp;
    freq *= 2.12;
    amp *= 0.48;
  }
  return val;
}

export function createStoneTextures() {
  const size = 512;
  const bumpData = new Uint8Array(size * size * 4);
  const colorData = new Uint8Array(size * size * 4);
  const roughData = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 10;
      const ny = (y / size) * 10;
      const macro = fbm2(nx, ny, 5);
      const crag = ridgedFbm(nx * 2.3 + 4.7, ny * 2.3 - 2.1, 4);
      const grain = fbm2(nx * 7.5 + 1.9, ny * 7.5 + 8.3, 3);
      const heightVal = macro * 0.52 + crag * 0.34 + grain * 0.14;
      const h = Math.max(0, Math.min(255, Math.round(heightVal * 255)));

      const idx = (y * size + x) * 4;
      bumpData[idx] = h;
      bumpData[idx + 1] = h;
      bumpData[idx + 2] = h;
      bumpData[idx + 3] = 255;

      // Bright Arctic frost-stone & wind-packed snow variation (matching f03, f04, f11!)
      const frostMask = Math.max(0, Math.min(1, (heightVal - 0.32) * 2.1));
      const darkStone = 176 + macro * 34;
      const brightFrost = 232 + grain * 22;
      const lum = darkStone * (1 - frostMask * 0.76) + brightFrost * (frostMask * 0.76);

      colorData[idx] = Math.max(0, Math.min(255, Math.round(lum - 4)));
      colorData[idx + 1] = Math.max(0, Math.min(255, Math.round(lum + 1)));
      colorData[idx + 2] = Math.max(0, Math.min(255, Math.round(lum + 9)));
      colorData[idx + 3] = 255;

      const rVal = Math.max(95, Math.min(245, Math.round(215 - frostMask * 65 + (grain - 0.5) * 40)));
      roughData[idx] = rVal;
      roughData[idx + 1] = rVal;
      roughData[idx + 2] = rVal;
      roughData[idx + 3] = 255;
    }
  }

  const bumpTex = new THREE.DataTexture(bumpData, size, size, THREE.RGBAFormat);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(2.5, 2.5);
  bumpTex.needsUpdate = true;

  const albedoTex = new THREE.DataTexture(colorData, size, size, THREE.RGBAFormat);
  albedoTex.wrapS = THREE.RepeatWrapping;
  albedoTex.wrapT = THREE.RepeatWrapping;
  albedoTex.repeat.set(2.5, 2.5);
  albedoTex.colorSpace = THREE.SRGBColorSpace;
  albedoTex.needsUpdate = true;

  const roughTex = new THREE.DataTexture(roughData, size, size, THREE.RGBAFormat);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.repeat.set(2.5, 2.5);
  roughTex.needsUpdate = true;

  return { bumpTex, albedoTex, roughTex };
}

export function createCloudPuffTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 2 - 1;
      const v = (y / size) * 2 - 1;
      const r = Math.hypot(u, v);
      const radial = Math.max(0, 1 - Math.pow(Math.min(1, r), 1.65));
      const billow = fbm2((x / size) * 4.8 + 2.3, (y / size) * 4.8 + 7.1, 5);
      const wisp = fbm2((x / size) * 9.6 - 4.1, (y / size) * 9.6 + 1.5, 3);
      const alpha = Math.max(0, Math.min(1, radial * (0.48 + billow * 0.58 + wisp * 0.18) - 0.08));
      const shade = Math.round(232 + billow * 22);

      const idx = (y * size + x) * 4;
      data[idx] = shade - 3;
      data[idx + 1] = shade;
      data[idx + 2] = Math.min(255, shade + 6);
      data[idx + 3] = Math.round(alpha * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// True Spherical Curved Voussoir Masonry Block (tightly fitted with glowing thin seams like f03 & f04!)
function createSphericalVoussoirGeometry(
  rInner,
  rOuter,
  phi0,
  phi1,
  thetaSpan,
  seed = 1
) {
  const segU = 8;
  const segV = 6;
  const segW = 4;
  const geo = new THREE.BoxGeometry(1, 1, 1, segU, segV, segW);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  const phiMid = (phi0 + phi1) * 0.5;
  const rMid = (rInner + rOuter) * 0.5;
  const center = new THREE.Vector3(
    0,
    Math.cos(phiMid) * rMid * 0.94,
    Math.sin(phiMid) * rMid
  );

  for (let i = 0; i < pos.count; i++) {
    // u in [-0.5, 0.5] -> azimuth around theta = 0
    // v in [-0.5, 0.5] -> polar angle phi1 (bottom) to phi0 (top)
    // w in [-0.5, 0.5] -> radial rInner to rOuter
    const u = pos.getX(i);
    const v = pos.getY(i);
    const w = pos.getZ(i);

    // Rounded stone bevel on edges so mortar seams catch crisp icy backlight!
    const edgeU = Math.abs(u) * 2;
    const edgeV = Math.abs(v) * 2;
    const edgeW = Math.abs(w) * 2;
    const bevel =
      Math.pow(Math.max(0, edgeU - 0.72) / 0.28, 2) * 0.032 +
      Math.pow(Math.max(0, edgeV - 0.72) / 0.28, 2) * 0.032;

    const theta = u * thetaSpan * (1 - Math.pow(Math.max(0, edgeW - 0.8), 2) * 0.03);
    const phi = THREE.MathUtils.lerp(phi1, phi0, v + 0.5);
    const rad = THREE.MathUtils.lerp(rInner, rOuter, w + 0.5) - bevel;

    const chisel =
      (fbm2(u * 3.8 + seed * 5.7, v * 3.8 + w * 2.4 + seed * 1.9, 4) - 0.5) * 0.036;
    const finalR = rad + chisel;

    const px = Math.sin(phi) * Math.sin(theta) * finalR;
    const py = Math.cos(phi) * finalR * 0.94;
    const pz = Math.sin(phi) * Math.cos(theta) * finalR;

    pos.setXYZ(i, px - center.x, py - center.y, pz - center.z);

    // Subsurface inner-core rim brightness on inner face & mortar edges (f04 & f11 icy backlit blocks!)
    const innerGlow = Math.max(0, 0.5 - w) * 0.75 + Math.max(edgeU, edgeV) * 0.28;
    const topSnow = Math.max(0, v + 0.2) * 0.18;
    const shade = 0.68 + innerGlow * 0.42 + topSnow;
    colors[i * 3] = Math.min(1.35, shade * 0.96);
    colors[i * 3 + 1] = Math.min(1.38, shade * 0.99);
    colors[i * 3 + 2] = Math.min(1.45, shade * 1.05);
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return { geo, localCenterOffset: center };
}

function createArchTunnelBlockGeometry(rInner, rOuter, ang0, ang1, depthLen, seed = 1) {
  const geo = new THREE.BoxGeometry(1, 1, 1, 5, 6, 5);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  const angMid = (ang0 + ang1) * 0.5;
  const rMid = (rInner + rOuter) * 0.5;
  const cx = Math.sin(angMid) * rMid;
  const cy = Math.cos(angMid) * rMid;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i); // radial thickness
    const v = pos.getY(i); // arch angle
    const w = pos.getZ(i); // tunnel forward length

    const edgeV = Math.abs(v) * 2;
    const edgeW = Math.abs(w) * 2;
    const bevel =
      Math.pow(Math.max(0, edgeV - 0.74) / 0.26, 2) * 0.025 +
      Math.pow(Math.max(0, edgeW - 0.74) / 0.26, 2) * 0.025;

    const ang = THREE.MathUtils.lerp(ang0, ang1, v + 0.5);
    const rad = THREE.MathUtils.lerp(rInner, rOuter, u + 0.5) - bevel;
    const chisel = (fbm2(v * 3.5 + seed * 4.3, w * 3.5 + seed * 2.7, 3) - 0.5) * 0.028;

    const px = Math.sin(ang) * (rad + chisel) - cx;
    const py = Math.cos(ang) * (rad + chisel) - cy;
    const pz = w * depthLen;

    pos.setXYZ(i, px, py, pz);

    const seamBright = Math.max(edgeV, edgeW) * 0.34 + Math.max(0, -u) * 0.55;
    const shade = 0.7 + seamBright * 0.42;
    colors[i * 3] = Math.min(1.35, shade * 0.96);
    colors[i * 3 + 1] = Math.min(1.38, shade * 0.99);
    colors[i * 3 + 2] = Math.min(1.45, shade * 1.05);
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return { geo, cx, cy };
}

export function buildObservatoryDome(stoneMat, radiantBlockMat, wireMat) {
  const group = new THREE.Group();
  const blocks = [];
  const rInner = 1.98;
  const rOuter = 2.46;
  const entranceAzimuth = 0.58; // Front-right entrance tunnel angle matching f03 & f04!

  // 6 masonry courses with crisp glowing white-ice mortar seams from snow base up to star-crown cap (exact f03 & f04!)
  const courses = [
    { phi0: 1.31, phi1: 1.55, count: 15, cutTunnel: true },
    { phi0: 1.05, phi1: 1.26, count: 14, cutTunnel: true },
    { phi0: 0.80, phi1: 1.00, count: 12, cutTunnel: false },
    { phi0: 0.56, phi1: 0.75, count: 10, cutTunnel: false },
    { phi0: 0.33, phi1: 0.51, count: 8, cutTunnel: false },
    { phi0: 0.09, phi1: 0.28, count: 6, cutTunnel: false },
  ];

  let blockIndex = 1;
  courses.forEach((course, courseIdx) => {
    const stepTheta = (Math.PI * 2) / course.count;
    // 91.5% azimuth span leaves luminous white mortar seams shining from the inner core like f03 & f04!
    const thetaSpan = stepTheta * 0.915;

    for (let i = 0; i < course.count; i++) {
      const theta = i * stepTheta + (courseIdx % 2) * (stepTheta * 0.5);
      const diff = Math.atan2(
        Math.sin(theta - entranceAzimuth),
        Math.cos(theta - entranceAzimuth)
      );
      if (course.cutTunnel && Math.abs(diff) < 0.34) continue;

      const { geo, localCenterOffset } = createSphericalVoussoirGeometry(
        rInner,
        rOuter,
        course.phi0,
        course.phi1,
        thetaSpan,
        blockIndex
      );

      // 3 blocks in upper courses become pure blazing white energy blocks during burst (exact f11 glowing block!)
      const isRadiantKeystone =
        (courseIdx === 4 && i === 2) || (courseIdx === 3 && i === 7) || (courseIdx === 5 && i === 4);

      const mesh = new THREE.Mesh(geo, isRadiantKeystone ? radiantBlockMat : stoneMat);

      const rotY = new THREE.Matrix4().makeRotationY(theta);
      const basePos = localCenterOffset.clone().applyMatrix4(rotY);
      mesh.position.copy(basePos);
      mesh.rotation.y = theta;

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 32), wireMat);
      mesh.add(edges);

      const normal = basePos.clone().setY(basePos.y * 0.85).normalize();
      // Spiral-upward plume vector matching f11's dramatic floating stone arc!
      const tangent = new THREE.Vector3(-normal.z, 0, normal.x).normalize();
      const scatterDir = normal
        .clone()
        .multiplyScalar(0.75 + hash2(blockIndex, 2.3) * 0.55)
        .addScaledVector(tangent, (hash2(blockIndex, 7.1) - 0.35) * 0.65)
        .add(new THREE.Vector3(0, 0.55 + (courseIdx / 5) * 0.95 + hash2(blockIndex, 4.1) * 0.5, 0))
        .normalize();

      const rotAxis = new THREE.Vector3(
        hash2(blockIndex, 9.2) - 0.5,
        hash2(blockIndex, 4.8) - 0.5,
        hash2(blockIndex, 2.6) - 0.5
      ).normalize();

      mesh.userData = {
        id: blockIndex,
        code: String(blockIndex).padStart(2, '0'),
        courseIdx,
        courseNorm: courseIdx / 5, // 0 = bottom foundation, 1 = crown cap
        isRadiantKeystone,
        basePos,
        baseQuat: mesh.quaternion.clone(),
        normal,
        scatterDir,
        scatterDist: 1.6 + (courseIdx / 5) * 2.9 + hash2(blockIndex, 8.4) * 2.1,
        rotAxis,
        hoverLift: 0,
        edges,
      };

      group.add(mesh);
      blocks.push(mesh);
      blockIndex += 1;
    }
  });

  // True Barrel-Vaulted Entrance Tunnel seated upright on snow (exact f03 & f04 front-right arch!)
  const archDir = new THREE.Vector3(
    Math.sin(entranceAzimuth),
    0,
    Math.cos(entranceAzimuth)
  ).normalize();
  const tunnelQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    archDir
  );

  const tunnelRings = 2;
  const archSegments = 7;
  const totalSpan = Math.PI * 0.94;
  for (let ring = 0; ring < tunnelRings; ring++) {
    const forward = 2.22 + ring * 0.48;
    for (let s = 0; s < archSegments; s++) {
      const a0 = -totalSpan * 0.5 + (s / archSegments) * totalSpan + 0.025;
      const a1 = -totalSpan * 0.5 + ((s + 1) / archSegments) * totalSpan - 0.025;
      const { geo, cx, cy } = createArchTunnelBlockGeometry(
        0.64,
        0.98,
        a0,
        a1,
        0.43,
        blockIndex
      );

      const mesh = new THREE.Mesh(geo, stoneMat);
      const localOffset = new THREE.Vector3(cx, cy + 0.22, forward).applyQuaternion(tunnelQuat);
      mesh.position.copy(localOffset);
      mesh.quaternion.copy(tunnelQuat);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 32), wireMat);
      mesh.add(edges);

      const normal = new THREE.Vector3(cx, Math.max(0.2, cy), 0.35)
        .applyQuaternion(tunnelQuat)
        .normalize();

      mesh.userData = {
        id: blockIndex,
        code: String(blockIndex).padStart(2, '0'),
        courseIdx: Math.min(3, Math.floor(Math.abs(s - 3) === 0 ? 3 : 1 + ring * 0.5)),
        courseNorm: 0.25 + (1 - Math.abs(s - 3) / 3) * 0.4,
        isRadiantKeystone: false,
        basePos: localOffset,
        baseQuat: mesh.quaternion.clone(),
        normal,
        scatterDir: normal.clone().add(new THREE.Vector3(0, 0.45, 0)).normalize(),
        scatterDist: 1.5 + hash2(blockIndex, 6.1) * 2.2,
        rotAxis: new THREE.Vector3(0.45, 0.65, -0.3).normalize(),
        hoverLift: 0,
        edges,
      };

      group.add(mesh);
      blocks.push(mesh);
      blockIndex += 1;
    }
  }

  // Blinding Overexposed White-Ice Inner Core & Mortar Seam Radiance Shell (exact f04 & f11!)
  const coreGeo = new THREE.SphereGeometry(1.995, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.56);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.y = 0.02;
  group.add(coreMesh);

  // Crown Star Aperture Disc (visible blazing at top of dome in f01 & f03!)
  const crownGlowGeo = new THREE.CircleGeometry(0.68, 32);
  crownGlowGeo.rotateX(-Math.PI / 2);
  const crownGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const crownGlow = new THREE.Mesh(crownGlowGeo, crownGlowMat);
  crownGlow.position.y = 2.24;
  group.add(crownGlow);

  // Soft Ground Bounce Spill Light Disc outside the arched entrance + dark contact AO ring under blocks
  const aoCanvas = new Uint8Array(128 * 128 * 4);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const dx = (x / 128) * 2 - 1;
      const dy = (y / 128) * 2 - 1;
      const r = Math.hypot(dx, dy);
      // Dark AO ring around r ~ 0.64, bright interior & tunnel spill!
      const ringShadow = Math.exp(-Math.pow((r - 0.66) * 5.2, 2)) * 0.58;
      const innerLight = Math.max(0, 1 - r * 1.48);
      const lum = Math.round(innerLight * 255);
      const alpha = Math.round(Math.min(1, ringShadow + innerLight * 0.85) * 255);
      const idx = (y * 128 + x) * 4;
      aoCanvas[idx] = lum;
      aoCanvas[idx + 1] = Math.min(255, Math.round(lum * 1.02));
      aoCanvas[idx + 2] = Math.min(255, Math.round(lum * 1.06));
      aoCanvas[idx + 3] = alpha;
    }
  }
  const aoTex = new THREE.DataTexture(aoCanvas, 128, 128, THREE.RGBAFormat);
  aoTex.needsUpdate = true;
  const groundContact = new THREE.Mesh(
    new THREE.PlaneGeometry(7.6, 7.6),
    new THREE.MeshBasicMaterial({
      map: aoTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    })
  );
  groundContact.rotation.x = -Math.PI / 2;
  groundContact.position.y = 0.04;
  group.add(groundContact);

  // Warm-icy doorway snow glow right outside tunnel mouth (f04!)
  const spillTexData = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const r = Math.hypot((x / 64) * 2 - 1, (y / 64) * 2 - 1);
      const a = Math.max(0, 1 - r) ** 2.1;
      const idx = (y * 64 + x) * 4;
      spillTexData[idx] = 244;
      spillTexData[idx + 1] = 250;
      spillTexData[idx + 2] = 255;
      spillTexData[idx + 3] = Math.round(a * 225);
    }
  }
  const spillTex = new THREE.DataTexture(spillTexData, 64, 64, THREE.RGBAFormat);
  spillTex.needsUpdate = true;
  const portalSpill = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 3.4),
    new THREE.MeshBasicMaterial({
      map: spillTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.82,
    })
  );
  portalSpill.rotation.x = -Math.PI / 2;
  portalSpill.position
    .copy(archDir)
    .multiplyScalar(3.35)
    .setY(0.06);
  group.add(portalSpill);

  return { group, blocks, coreMesh, crownGlow, portalSpill };
}

export function buildIsometricCadLattice() {
  const group = new THREE.Group();
  const points = [];
  const anchors = [];

  // Architectural isometric 3D spatial cubes & diagonal survey braces (exact f01 & f03!)
  const coords = [-4.6, -2.3, 0, 2.3, 4.6];
  coords.forEach((gx, xi) => {
    coords.forEach((gz, zi) => {
      if (Math.abs(gx) + Math.abs(gz) > 7.2) return;
      const boxW = 1.95;
      const boxH = 0.75 + hash2(xi * 3.1, zi * 5.7) * 1.95;
      const y0 = -0.25;
      const x0 = gx - boxW * 0.5;
      const x1 = gx + boxW * 0.5;
      const z0 = gz - boxW * 0.5;
      const z1 = gz + boxW * 0.5;
      const y1 = y0 + boxH;

      // Top wireframe rectangle + vertical pillars + diagonal survey line (matching f01!)
      points.push(
        new THREE.Vector3(x0, y1, z0),
        new THREE.Vector3(x1, y1, z0),
        new THREE.Vector3(x1, y1, z0),
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x0, y1, z1),
        new THREE.Vector3(x0, y1, z1),
        new THREE.Vector3(x0, y1, z0),
        new THREE.Vector3(x0, y0, z0),
        new THREE.Vector3(x0, y1, z0),
        new THREE.Vector3(x1, y0, z1),
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x0, y1, z0),
        new THREE.Vector3(x1, y1, z1)
      );

      anchors.push({
        pos: new THREE.Vector3(x0, y1, z0),
        num: Math.round(8 + hash2(xi + 2, zi + 9) * 34),
      });
    });
  });

  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  return { group, lineMat, anchors };
}

export function buildMountainTerrain(stoneMat, wireTerrainMat) {
  const group = new THREE.Group();

  // High-detail 156x156 sculpted Arctic summit knoll + distant jagged mountain range (exact f03, f04, f11!)
  const geo = new THREE.PlaneGeometry(68, 68, 156, 156);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.hypot(x, z);

    // Sculpted snowy hilltop knoll under the observatory, dropping into a misty valley so the top 45% of viewport is OPEN ARCTIC SKY (exact f04 & f11!)
    const knoll = Math.exp(-Math.pow(dist / 5.4, 2.0)) * 0.56;
    const valleyDrop = -Math.min(4.2, Math.pow(Math.max(0, dist - 4.4) * 0.22, 1.25));

    // Distant horizon mountain silhouettes far back at z = -24..-32 so they frame the sky without walling in the dome!
    const angle = Math.atan2(z, x);
    const rightPeak =
      z < -8
        ? Math.exp(-Math.pow((x - 15.5) / 11.5, 2) - Math.pow((z + 27.5) / 8.5, 2)) * 9.8
        : 0;
    const leftRidge =
      z < -8
        ? Math.exp(-Math.pow((x + 16.5) / 12.5, 2) - Math.pow((z + 25.0) / 9.0, 2)) * 6.2
        : 0;
    const centerSaddle =
      z < -14
        ? Math.exp(-Math.pow((x + 1.5) / 12.0, 2) - Math.pow((z + 29.0) / 8.0, 2)) * 4.8
        : 0;

    const ridgeCrag =
      ridgedFbm(x * 0.22 + 3.4, z * 0.22 - 5.2, 5) *
      (0.38 + Math.min(1.6, Math.max(0, dist - 3.2) * 0.12));
    const microSnow =
      (fbm2(x * 0.95 + 9.1, z * 0.95 + 2.7, 4) - 0.48) *
      0.34 *
      Math.min(1, Math.max(0.12, (dist - 1.8) / 2.4));

    const seatFlatten = Math.exp(-Math.pow(dist / 2.75, 4.0));
    const rawY =
      knoll +
      valleyDrop +
      rightPeak +
      leftRidge +
      centerSaddle +
      ridgeCrag * 0.55 +
      microSnow -
      0.52;
    const finalY = THREE.MathUtils.lerp(rawY, 0.01, seatFlatten * 0.9);

    pos.setY(i, finalY);

    // Bright frosty snow cover with crisp slate crevices (matching f04 & f11!)
    const cragFactor = ridgedFbm(x * 0.6 + 1.2, z * 0.6 - 3.4, 3);
    const snowCover = THREE.MathUtils.clamp(0.76 + cragFactor * 0.38 + seatFlatten * 0.14, 0.64, 1.15);
    colors[i * 3] = snowCover * 0.96;
    colors[i * 3 + 1] = snowCover * 0.99;
    colors[i * 3 + 2] = snowCover * 1.04 + angle * 0.004;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const terrainMesh = new THREE.Mesh(geo, stoneMat);
  const terrainWire = new THREE.Mesh(geo, wireTerrainMat);
  terrainWire.position.y = 0.025;

  group.add(terrainMesh);
  group.add(terrainWire);

  // Scattered 3D Fractured Basalt Boulders on the snowy foreground & right ridge (visible in f03 & f04!)
  const boulderSpecs = [
    { x: 4.15, z: 1.55, s: 0.44, ry: 0.8 },
    { x: 3.45, z: 2.95, s: 0.24, ry: 2.1 },
    { x: -3.55, z: 2.35, s: 0.34, ry: 1.4 },
    { x: -4.45, z: -0.85, s: 0.52, ry: 0.3 },
    { x: 5.35, z: -2.1, s: 0.62, ry: 2.7 },
    { x: -2.35, z: 3.85, s: 0.22, ry: 1.9 },
  ];

  boulderSpecs.forEach((b, idx) => {
    const bGeo = new THREE.DodecahedronGeometry(b.s, 1);
    const bPos = bGeo.attributes.position;
    const bCol = new Float32Array(bPos.count * 3);
    for (let k = 0; k < bPos.count; k++) {
      const vx = bPos.getX(k);
      const vy = bPos.getY(k);
      const vz = bPos.getZ(k);
      const n = 0.78 + fbm2(vx * 3 + idx * 4, vz * 3 + vy * 2, 3) * 0.44;
      bPos.setXYZ(k, vx * n * 1.25, vy * n * 0.72, vz * n);
      const topFrost = vy > 0 ? 0.95 : 0.56;
      bCol[k * 3] = topFrost * 0.94;
      bCol[k * 3 + 1] = topFrost * 0.97;
      bCol[k * 3 + 2] = topFrost * 1.03;
    }
    bGeo.setAttribute('color', new THREE.BufferAttribute(bCol, 3));
    bGeo.computeVertexNormals();

    const rock = new THREE.Mesh(bGeo, stoneMat);
    const dist = Math.hypot(b.x, b.z);
    const approxY =
      Math.exp(-Math.pow(dist / 5.6, 2.1)) * 0.62 -
      Math.pow(Math.max(0, dist - 4.2) * 0.19, 1.22) -
      0.52;
    rock.position.set(b.x, approxY, b.z);
    rock.rotation.set(idx * 0.2, b.ry, idx * 0.15);
    group.add(rock);
  });

  return { group, terrainMesh, terrainWire };
}

// Atmospheric Sky Dome + Drifting Volumetric Cloud Billboards (exact overcast cloud-break & mist in f04, f05, f06, f08, f11!)
export function buildArcticAtmosphere(cloudTex) {
  const skyGeo = new THREE.SphereGeometry(54, 32, 24);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vWorldDir;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.03;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        float h = clamp(vWorldDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 horizon = vec3(0.74, 0.77, 0.82);
        vec3 zenith = vec3(0.58, 0.62, 0.69);
        vec3 col = mix(horizon, zenith, smoothstep(0.46, 0.92, h));

        // Subtle overcast cloud streaks & bright glacial sunbreak on upper-right (matching f04!)
        vec2 skyUv = vWorldDir.xz / max(0.22, abs(vWorldDir.y) + 0.25);
        float cloud = fbm(skyUv * 1.45 + vec2(uTime * 0.025, -uTime * 0.015));
        col += vec3(0.11, 0.12, 0.14) * smoothstep(0.38, 0.82, cloud) * smoothstep(0.42, 0.72, h);

        vec3 sunDir = normalize(vec3(0.62, 0.22, -0.75));
        float sunGlow = pow(max(dot(vWorldDir, sunDir), 0.0), 7.0);
        col += vec3(0.18, 0.19, 0.21) * sunGlow;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);

  // Drifting Volumetric Mist / Cloud Puffs around the summit, plunge chasm, and Stargate!
  const cloudGroup = new THREE.Group();
  const cloudSprites = [];

  const layers = [
    // Surface ridge foreground & mid-ground mist banks (f04, f05, f11)
    { x: -4.2, y: 0.55, z: 3.8, sx: 8.5, sy: 3.4, op: 0.34, speed: 0.22 },
    { x: 3.8, y: 0.45, z: 4.2, sx: 9.2, sy: 3.6, op: 0.36, speed: 0.18 },
    { x: 0.5, y: -0.6, z: 5.4, sx: 12.0, sy: 4.4, op: 0.42, speed: -0.16 },
    { x: -6.5, y: 1.8, z: -6.5, sx: 14.0, sy: 5.5, op: 0.28, speed: 0.14 },
    { x: 7.2, y: 2.1, z: -7.8, sx: 15.0, sy: 5.8, op: 0.3, speed: -0.12 },
    // Cloud plunge layer above Stargate (y = -5..-11, f05 -> f06)
    { x: -1.8, y: -5.8, z: 1.2, sx: 13.0, sy: 8.5, op: 0.58, speed: 0.25 },
    { x: 2.1, y: -8.2, z: -1.1, sx: 14.0, sy: 9.0, op: 0.56, speed: -0.22 },
    // Wispy plasma clouds framing Stargate (y = -15, f08)
    { x: -3.2, y: -14.5, z: 0.8, sx: 8.5, sy: 6.5, op: 0.35, speed: 0.3 },
    { x: 3.1, y: -15.6, z: -0.8, sx: 8.5, sy: 6.5, op: 0.35, speed: -0.28 },
    // Deep chasm storm clouds below Vortex leading into Cycle-2 Summit (y = -44..-54)
    { x: -2.0, y: -45.5, z: 1.5, sx: 16.0, sy: 10.0, op: 0.68, speed: 0.32 },
    { x: 2.2, y: -49.5, z: -1.2, sx: 17.0, sy: 11.0, op: 0.72, speed: -0.28 },
    { x: 0.0, y: -53.0, z: 2.4, sx: 18.0, sy: 9.5, op: 0.62, speed: 0.24 },
  ];

  layers.forEach((spec, idx) => {
    const sMat = new THREE.SpriteMaterial({
      map: cloudTex,
      color: 0xeef4fc,
      transparent: true,
      opacity: spec.op,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(sMat);
    sprite.position.set(spec.x, spec.y, spec.z);
    sprite.scale.set(spec.sx, spec.sy, 1);
    sprite.userData = { baseX: spec.x, baseOp: spec.op, speed: spec.speed, phase: idx * 1.37 };
    cloudGroup.add(sprite);
    cloudSprites.push(sprite);
  });

  return { skyDome, skyMat, cloudGroup, cloudSprites };
}

export function buildStoneStargateRing(stoneMat) {
  // Exact f08 tightly-fitted 8-segment carved stone portal ring + blazing inner plasma halo + geodesic web!
  const group = new THREE.Group();
  const outerSegs = [];
  const innerSegs = [];

  const segCount = 8;
  for (let i = 0; i < segCount; i++) {
    const arc = (Math.PI * 2) / segCount;
    // 98.2% arc so stone segments kiss with crisp carved bevel seams just like f08!
    const torusGeo = new THREE.TorusGeometry(2.85, 0.56, 18, 24, arc * 0.982);
    const pos = torusGeo.attributes.position;
    const cols = new Float32Array(pos.count * 3);

    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k);
      const y = pos.getY(k);
      const z = pos.getZ(k);
      const rXY = Math.hypot(x, y);
      const n = (fbm2(x * 1.6 + i * 2.1, y * 1.6 - i, 4) - 0.5) * 0.055;
      pos.setXYZ(k, x + n, y + n, z + n);

      // Strong inner-rim white radiance from the blazing energy ring!
      const innerRim = Math.max(0, (2.75 - rXY) * 1.35);
      const shade = 0.72 + innerRim * 0.65;
      cols[k * 3] = Math.min(1.5, shade * 0.97);
      cols[k * 3 + 1] = Math.min(1.5, shade);
      cols[k * 3 + 2] = Math.min(1.55, shade * 1.04);
    }
    torusGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    torusGeo.computeVertexNormals();

    const m = new THREE.Mesh(torusGeo, stoneMat);
    m.rotation.z = i * arc + 0.009;
    group.add(m);
    outerSegs.push(m);
  }

  // Blazing Overexposed Inner Energy Torus + Soft Wide Plasma Halo Sheet (exact f08!)
  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.26, 0.13, 20, 96),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
    })
  );
  group.add(glowRing);

  const haloData = new Uint8Array(256 * 256 * 4);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const u = (x / 256) * 2 - 1;
      const v = (y / 256) * 2 - 1;
      const r = Math.hypot(u, v);
      const ang = Math.atan2(v, u);
      const ringBand = Math.exp(-Math.pow((r - 0.66) * 6.5, 2));
      const filament = fbm2(Math.cos(ang) * 3.2 + r * 4, Math.sin(ang) * 3.2 - r * 4, 4);
      const innerVeil = r < 0.68 ? (0.18 + filament * 0.34) * (1 - r * 0.45) : 0;
      const a = Math.min(1, ringBand * (0.72 + filament * 0.45) + innerVeil);
      const idx = (y * 256 + x) * 4;
      haloData[idx] = 242;
      haloData[idx + 1] = 250;
      haloData[idx + 2] = 255;
      haloData[idx + 3] = Math.round(a * 255);
    }
  }
  const haloTex = new THREE.DataTexture(haloData, 256, 256, THREE.RGBAFormat);
  haloTex.needsUpdate = true;
  const plasmaDisc = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 6.8),
    new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      opacity: 0.92,
    })
  );
  group.add(plasmaDisc);

  // Delicate Geodesic Energy Web inside the Stargate Aperture (visible in f08!)
  const webMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.95, 2.24, 36, 4),
    new THREE.MeshBasicMaterial({
      color: 0xeef8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
    })
  );
  group.add(webMesh);
  innerSegs.push(webMesh);

  return { group, outerSegs, innerSegs, glowRing, plasmaDisc };
}

export function buildSteppedHaloPedestal(stoneMat) {
  // Exact f09 & f10 4 concentric stepped circular stone platforms with RECESSED UNDER-LIP WHITE LIGHT COVES,
  // split-ring overhead studio halo, geodesic cage, AND vertical holographic dotted light column!
  const group = new THREE.Group();

  const steps = [
    { r: 5.8, h: 0.26, y: -2.42 },
    { r: 4.25, h: 0.26, y: -2.18 },
    { r: 2.85, h: 0.26, y: -1.94 },
    { r: 1.56, h: 0.22, y: -1.72 },
  ];

  const coveGlowMat = new THREE.MeshBasicMaterial({
    color: 0xf4fbff,
    transparent: true,
    opacity: 0.95,
  });

  steps.forEach((s, idx) => {
    const cyl = new THREE.CylinderGeometry(s.r, s.r * 1.01, s.h, 72);
    const pos = cyl.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k);
      const z = pos.getZ(k);
      const r = Math.hypot(x, z);
      // Soft radial bounce glow from the recessed light cove of the next inner step!
      const nextInnerR = idx < steps.length - 1 ? steps[idx + 1].r : 0.78;
      const coveBounce = Math.exp(-Math.pow((r - nextInnerR) * 2.4, 2)) * 0.42;
      const baseShade = 0.72 + coveBounce;
      cols[k * 3] = Math.min(1.25, baseShade * 0.96);
      cols[k * 3 + 1] = Math.min(1.28, baseShade * 0.99);
      cols[k * 3 + 2] = Math.min(1.32, baseShade * 1.03);
    }
    cyl.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const mesh = new THREE.Mesh(cyl, stoneMat);
    mesh.position.y = s.y;
    group.add(mesh);

    // Bright glowing white lip ring + under-cove bounce on every concentric stone step (exact f09 & f10!)
    const coveGeo = new THREE.TorusGeometry(s.r * 0.992, 0.042, 12, 72);
    const gm = new THREE.Mesh(coveGeo, coveGlowMat);
    gm.rotation.x = Math.PI / 2;
    gm.position.y = s.y + s.h * 0.46;
    group.add(gm);
  });

  // Innermost engraved circular ring groove on top center dais (visible in f09 & f10!)
  const innerGroove = new THREE.Mesh(
    new THREE.RingGeometry(0.86, 0.89, 64),
    new THREE.MeshBasicMaterial({
      color: 0x5c6678,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  innerGroove.rotation.x = -Math.PI / 2;
  innerGroove.position.y = -1.605;
  group.add(innerGroove);

  // Overhead Split-Segment Blazing White Studio Halo Ring (exact two-arc glowing ring at top of f10!)
  const haloGroup = new THREE.Group();
  haloGroup.position.y = 2.18;
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1.0,
  });
  for (let a = 0; a < 2; a++) {
    const seg = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.115, 16, 48, Math.PI * 0.92),
      haloMat
    );
    seg.rotation.x = Math.PI / 2;
    seg.rotation.z = a * Math.PI + 0.12;
    haloGroup.add(seg);
  }
  group.add(haloGroup);

  // Vertical Dotted Holographic Light Curtain descending from Top Halo to Inner Dais (visible in f10!)
  const curtainCols = 72;
  const curtainRows = 28;
  const curtainPos = new Float32Array(curtainCols * curtainRows * 3);
  let ptr = 0;
  for (let c = 0; c < curtainCols; c++) {
    const ang = (c / curtainCols) * Math.PI * 2;
    for (let r = 0; r < curtainRows; r++) {
      const ty = r / (curtainRows - 1);
      curtainPos[ptr++] = Math.cos(ang) * 1.42;
      curtainPos[ptr++] = THREE.MathUtils.lerp(-1.58, 2.48, ty);
      curtainPos[ptr++] = Math.sin(ang) * 1.42;
    }
  }
  const curtainGeo = new THREE.BufferGeometry();
  curtainGeo.setAttribute('position', new THREE.BufferAttribute(curtainPos, 3));
  const curtainMat = new THREE.PointsMaterial({
    color: 0xf4fbff,
    size: 0.022,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });
  const lightCurtain = new THREE.Points(curtainGeo, curtainMat);
  group.add(lightCurtain);

  // Subtle Geodesic Wireframe Containment Cage around the Pedestal (visible in f09!)
  const cageGeo = new THREE.IcosahedronGeometry(2.38, 3);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0xeef5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.075,
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  cageMesh.position.y = 0.08;
  group.add(cageMesh);

  return { group, haloMesh: haloGroup, cageMesh, lightCurtain };
}

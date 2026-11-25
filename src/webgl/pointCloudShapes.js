// Procedural 15,000-Particle 3D Volumetric Point-Cloud Sculptures for the 5 Portfolio Worlds + Vortex Finale
// Matches the exact tactile micro-sphere volumetric point-cloud sculpture aesthetic of igloo.inc (f09 & f10)!

export const PARTICLE_COUNT = 15000;

function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// 01 · RUMAH WIRALOKA: 3D Batik Canting Tulis (bowl + angled bamboo handle + curved spout + falling wax droplet)
function sampleWiralokaCanting(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 1);
    const r2 = seeded(i, 2);
    const r3 = seeded(i, 3);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.44) {
      // Rounded copper nyamplung reservoir bowl
      const u = r2 * Math.PI * 2;
      const v = r3 * Math.PI * 0.78 + 0.22;
      const rad = 0.78 * (0.86 + 0.14 * seeded(i, 4));
      x = Math.sin(v) * Math.cos(u) * rad - 0.15;
      y = -Math.cos(v) * rad * 0.85 - 0.18;
      z = Math.sin(v) * Math.sin(u) * rad;
    } else if (r1 < 0.74) {
      // Angled segmented bamboo handle extending upper-right
      const t = r2;
      const ang = r3 * Math.PI * 2;
      const node = 1 + 0.22 * Math.exp(-Math.pow(((t * 3) % 1) - 0.5, 2) * 38);
      const tubeR = 0.13 * node * (0.65 + 0.35 * seeded(i, 5));
      const spineX = 0.35 + t * 1.85;
      const spineY = 0.05 + t * 1.48;
      x = spineX + Math.cos(ang) * tubeR * 0.5;
      y = spineY + Math.cos(ang) * tubeR * 0.85;
      z = Math.sin(ang) * tubeR;
    } else if (r1 < 0.90) {
      // Curved pouring cucuk spout extending lower-left
      const t = r2;
      const ang = r3 * Math.PI * 2;
      const tubeR = (0.11 - t * 0.055) * (0.7 + 0.3 * seeded(i, 6));
      x = -0.82 - t * 0.95;
      y = -0.05 - Math.pow(t, 1.85) * 0.78 + Math.cos(ang) * tubeR;
      z = Math.sin(ang) * tubeR;
    } else {
      // Suspended hot malam wax droplet below spout tip
      const u = r2 * Math.PI * 2;
      const v = r3 * Math.PI;
      const dropR = 0.23 * (1 - 0.32 * Math.cos(v)) * Math.cbrt(seeded(i, 7));
      x = -1.86 + Math.sin(v) * Math.cos(u) * dropR * 0.82;
      y = -1.25 + Math.cos(v) * dropR * 1.35;
      z = Math.sin(v) * Math.sin(u) * dropR * 0.82;
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y + 0.15;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

// 02 · KOMA O-III: Clustered Triple Cinema Lens Assembly (PRISM O III machined barrels + focus gear rings)
function sampleKomaOptics(count) {
  const arr = new Float32Array(count * 3);
  const centers = [
    [-0.78, -0.15],
    [0.0, 0.28],
    [0.78, -0.15],
  ];
  for (let i = 0; i < count; i++) {
    const barrelIdx = i % 3;
    const [cx, cz] = centers[barrelIdx];
    const r1 = seeded(i, 11);
    const r2 = seeded(i, 12);
    const r3 = seeded(i, 13);

    const ang = r2 * Math.PI * 2;
    const h = (r3 - 0.5) * 2.45;
    const gear = Math.abs(h + 0.15) < 0.24 ? 1.07 : 1.0;
    const outerR = 0.48 * gear;

    let rad;
    let y = h;
    if (r1 < 0.76) {
      // Cylindrical titanium barrel wall
      rad = outerR * (0.9 + 0.1 * seeded(i, 14));
    } else {
      // Concave front & rear optical glass elements
      rad = outerR * 0.86 * Math.sqrt(r2);
      y = (r1 < 0.88 ? 1.22 : -1.22) - (1 - rad / outerR) * 0.16 * (r1 < 0.88 ? 1 : -1);
    }

    arr[i * 3] = cx + Math.cos(ang) * rad;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = cz + Math.sin(ang) * rad;
  }
  return arr;
}

// 03 · SILIKA: Spatial AI Compute Cartridge (machined rectangular frame + dual concentric silicon wafer platters)
function sampleSilikaCartridge(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 21);
    const r2 = seeded(i, 22);
    const r3 = seeded(i, 23);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.52) {
      // Outer machined rectangular compute chassis frame
      const W = 1.62;
      const H = 1.08;
      const D = 0.28;
      const face = i % 4;
      if (face === 0 || face === 1) {
        x = (r2 - 0.5) * 2 * W;
        y = (face === 0 ? 1 : -1) * H * (0.86 + 0.14 * seeded(i, 24));
      } else {
        x = (face === 2 ? 1 : -1) * W * (0.86 + 0.14 * seeded(i, 24));
        y = (r2 - 0.5) * 2 * H;
      }
      z = (r3 - 0.5) * 2 * D;
    } else {
      // Dual internal rotating concentric wafer platters
      const platterCenter = i % 2 === 0 ? -0.68 : 0.68;
      const ang = r2 * Math.PI * 2;
      const ring = 0.18 + Math.sqrt(r3) * 0.62;
      x = platterCenter + Math.cos(ang) * ring;
      y = Math.sin(ang) * ring;
      z = (seeded(i, 25) - 0.5) * 0.22;
    }

    // Tilt cartridge heroically in 3D space
    const tilt = 0.28;
    const rx = x * Math.cos(tilt) - y * Math.sin(tilt);
    const ry = x * Math.sin(tilt) + y * Math.cos(tilt);
    arr[i * 3] = rx;
    arr[i * 3 + 1] = ry;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

// 04 · REDAM: Architectural Acoustic Tuning Fork & Harmonic Wave Rings
function sampleRedamAcoustic(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 31);
    const r2 = seeded(i, 32);
    const r3 = seeded(i, 33);
    const ang = r2 * Math.PI * 2;
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.48) {
      // Twin vertical acoustic tuning prongs
      const side = i % 2 === 0 ? -1 : 1;
      const t = r3;
      const tubeR = 0.16 * (0.7 + 0.3 * seeded(i, 34));
      x = side * 0.52 + Math.cos(ang) * tubeR;
      y = -0.15 + t * 1.55;
      z = Math.sin(ang) * tubeR;
    } else if (r1 < 0.72) {
      // U-bend base & stem
      if (r3 < 0.65) {
        const uAng = Math.PI + (r3 / 0.65) * Math.PI;
        const tubeR = 0.16;
        x = Math.cos(uAng) * 0.52 + Math.cos(ang) * tubeR * 0.5;
        y = -0.15 + Math.sin(uAng) * 0.52;
        z = Math.sin(ang) * tubeR;
      } else {
        const stemT = (r3 - 0.65) / 0.35;
        const tubeR = 0.17;
        x = Math.cos(ang) * tubeR;
        y = -0.67 - stemT * 0.72;
        z = Math.sin(ang) * tubeR;
      }
    } else {
      // 3 concentric horizontal acoustic wave rings
      const ringIdx = i % 3;
      const waveR = 0.98 + ringIdx * 0.36;
      x = Math.cos(ang) * waveR;
      z = Math.sin(ang) * waveR;
      y = 0.35 + (ringIdx - 1) * 0.38 + Math.sin(ang * 6) * 0.04;
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

// 05 · SOROT: Sculpted 3D XR Stage Visor & Twin Optical Lens Barrels
function sampleSorotVisor(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 41);
    const r2 = seeded(i, 42);
    const r3 = seeded(i, 43);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.56) {
      // Curved wrap-around XR visor shell with nose bridge cutout
      const u = (r2 - 0.5) * 2.15;
      const noseNotch = Math.exp(-u * u * 6.5) * 0.32;
      const h = (r3 - 0.5) * 1.15 + noseNotch * (r3 < 0.3 ? 1 : 0);
      const curveZ = Math.cos(u * 0.72) * 0.68 - 0.22;
      x = Math.sin(u * 0.85) * 1.65;
      y = h;
      z = curveZ + (seeded(i, 44) - 0.5) * 0.24;
    } else if (r1 < 0.84) {
      // Dual recessed optical lens barrels
      const side = i % 2 === 0 ? -0.56 : 0.56;
      const ang = r2 * Math.PI * 2;
      const rad = 0.38 * (0.72 + 0.28 * r3);
      x = side + Math.cos(ang) * rad;
      y = Math.sin(ang) * rad * 1.05;
      z = 0.25 + (seeded(i, 45) - 0.5) * 0.28;
    } else {
      // Brushed headstrap arc wrapping behind
      const u = (r2 - 0.5) * Math.PI * 1.15;
      x = Math.sin(u) * 1.48;
      z = -Math.cos(u) * 1.18 - 0.05;
      y = (r3 - 0.5) * 0.28;
    }

    arr[i * 3] = x;
    arr[i * 3 + 1] = y + 0.05;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

// 06 · INTERACTIVE VOLUMETRIC PARTICLE VORTEX (Footer / Loop Ascent Portal!)
function sampleParticleVortex(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const arm = (i % 5) * ((Math.PI * 2) / 5);
    const r = 0.28 + Math.pow(seeded(i, 51), 0.68) * 2.65;
    const theta = arm + r * 2.35 + seeded(i, 52) * 0.65;
    const funnelY = -Math.exp(-r * 0.85) * 0.95 + (seeded(i, 53) - 0.5) * 0.42 * (0.4 + r * 0.35);

    arr[i * 3] = Math.cos(theta) * r;
    arr[i * 3 + 1] = funnelY + (t - 0.5) * 0.2;
    arr[i * 3 + 2] = Math.sin(theta) * r;
  }
  return arr;
}

export function buildAllMorphTargets() {
  return [
    sampleWiralokaCanting(PARTICLE_COUNT),
    sampleKomaOptics(PARTICLE_COUNT),
    sampleSilikaCartridge(PARTICLE_COUNT),
    sampleRedamAcoustic(PARTICLE_COUNT),
    sampleSorotVisor(PARTICLE_COUNT),
    sampleParticleVortex(PARTICLE_COUNT),
  ];
}

// Procedural 42,000-Particle Ultra-Dense Matte Frost-Alabaster 3D Volumetric Sculptures
// Spatially sorted by height + azimuth so curl-noise transitions peel & condense organically like igloo.inc (f09 & f10)!

export const PARTICLE_COUNT = 42000;

function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

// Sort XYZ triples by (y + x*0.25) so morphing between relics flows in cohesive sculptural streams!
function sortSculptureParticles(raw) {
  const n = raw.length / 3;
  const indices = new Uint32Array(n);
  const keys = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    indices[i] = i;
    keys[i] = raw[i * 3 + 1] + raw[i * 3] * 0.22 + raw[i * 3 + 2] * 0.08;
  }
  const sortedIdx = Array.from(indices).sort((a, b) => keys[a] - keys[b]);
  const out = new Float32Array(raw.length);
  for (let i = 0; i < n; i++) {
    const src = sortedIdx[i] * 3;
    out[i * 3] = raw[src];
    out[i * 3 + 1] = raw[src + 1];
    out[i * 3 + 2] = raw[src + 2];
  }
  return out;
}

// 01 · RUMAH WIRALOKA: Monumental 3D Batik Canting Tulis + Wax Stream + Rippling Wax Pool
function sampleWiralokaCanting(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 1);
    const r2 = seeded(i, 2);
    const r3 = seeded(i, 3);
    const shell = 0.72 + 0.28 * Math.pow(seeded(i, 4), 0.35);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.46) {
      // Sculpted Nyamplung Copper Reservoir Bowl with subtle vertical fluting & rolled lip
      const u = r2 * Math.PI * 2;
      const v = r3 * Math.PI * 0.76 + 0.24;
      const flute = 1 + 0.045 * Math.cos(u * 12);
      const lip = v < 0.36 ? 1.08 : 1.0;
      const rad = 0.84 * flute * lip * shell;
      x = Math.sin(v) * Math.cos(u) * rad * 1.08 - 0.12;
      y = -Math.cos(v) * rad * 0.86 - 0.08;
      z = Math.sin(v) * Math.sin(u) * rad * 0.92;
    } else if (r1 < 0.74) {
      // Carved Bamboo Handle (Gagang) with 3 tactile ring nodes extending upper-right
      const t = r2;
      const ang = r3 * Math.PI * 2;
      const ringNode =
        1 +
        0.26 * Math.exp(-Math.pow(t - 0.22, 2) * 180) +
        0.24 * Math.exp(-Math.pow(t - 0.58, 2) * 180) +
        0.28 * Math.exp(-Math.pow(t - 0.92, 2) * 180);
      const tubeR = 0.145 * ringNode * (0.55 + 0.45 * Math.sqrt(seeded(i, 5)));
      const spineX = 0.46 + t * 1.62;
      const spineY = 0.12 + t * 1.32;
      x = spineX - Math.sin(0.68) * Math.cos(ang) * tubeR;
      y = spineY + Math.cos(0.68) * Math.cos(ang) * tubeR;
      z = Math.sin(ang) * tubeR;
    } else if (r1 < 0.90) {
      // Graceful Curved Cucuk Spout extending lower-left
      const t = r2;
      const ang = r3 * Math.PI * 2;
      const tubeR = (0.135 - t * 0.068) * (0.6 + 0.4 * Math.sqrt(seeded(i, 6)));
      x = -0.84 - t * 0.88;
      y = 0.02 - Math.pow(t, 1.75) * 0.72 + Math.cos(ang) * tubeR;
      z = Math.sin(ang) * tubeR;
    } else {
      // Suspended Teardrop Malam Droplet + Concentric Wax Ripple Ring below spout
      if (r3 < 0.62) {
        const u = r2 * Math.PI * 2;
        const v = (r3 / 0.62) * Math.PI;
        const dropR = 0.24 * (1 - 0.34 * Math.cos(v)) * Math.pow(seeded(i, 7), 0.32);
        x = -1.76 + Math.sin(v) * Math.cos(u) * dropR * 0.84;
        y = -1.06 + Math.cos(v) * dropR * 1.38;
        z = Math.sin(v) * Math.sin(u) * dropR * 0.84;
      } else {
        const ang = r2 * Math.PI * 2;
        const ringR = 0.42 + ((r3 - 0.62) / 0.38) * 0.36;
        x = -1.76 + Math.cos(ang) * ringR;
        y = -1.42 + Math.sin(ringR * 18) * 0.03;
        z = Math.sin(ang) * ringR;
      }
    }

    arr[i * 3] = x * 0.94;
    arr[i * 3 + 1] = y * 0.94 + 0.22;
    arr[i * 3 + 2] = z * 0.94;
  }
  return sortSculptureParticles(arr);
}

// 02 · KOMA O-III: Heroic 3/4-Angled Anamorphic Cinema Prime Lens (stepped barrel + knurled focus gears + front optical glass)
function sampleKomaOptics(count) {
  const arr = new Float32Array(count * 3);
  const tiltX = -0.42;
  const tiltY = 0.56;
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  const cosY = Math.cos(tiltY);
  const sinY = Math.sin(tiltY);

  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 11);
    const r2 = seeded(i, 12);
    const r3 = seeded(i, 13);
    const ang = r2 * Math.PI * 2;

    let lx = 0;
    let ly = 0;
    let lz = 0;

    if (r1 < 0.62) {
      // Stepped Machined Cinema Barrel along local Z (-1.28 to +1.28) with knurled focus & iris gear rings!
      const z = (r3 - 0.5) * 2.56;
      const frontHood = z > 0.82 ? 1.12 : z > 0.25 ? 1.04 : z > -0.55 ? 0.96 : 0.84;
      const focusGear =
        Math.abs(z - 0.08) < 0.22 || Math.abs(z + 0.48) < 0.14
          ? 1.08 + 0.032 * Math.cos(ang * 36)
          : 1.0;
      const wallThickness = 0.86 + 0.14 * Math.sqrt(seeded(i, 14));
      const rad = 1.02 * frontHood * focusGear * wallThickness;
      lx = Math.cos(ang) * rad;
      ly = Math.sin(ang) * rad;
      lz = z;
    } else if (r1 < 0.86) {
      // Curved Convex Front Anamorphic Glass Element + Matte Box Rim
      const rad = 1.04 * Math.sqrt(r3);
      const domeBulge = Math.sqrt(Math.max(0, 1.18 - rad * rad)) * 0.34;
      lx = Math.cos(ang) * rad;
      ly = Math.sin(ang) * rad * 0.96;
      lz = 1.02 + domeBulge + (seeded(i, 15) - 0.5) * 0.04;
    } else {
      // Internal 9-Blade Octagonal Aperture Iris & Rear Element
      const bladeAng = Math.floor(r2 * 9) * ((Math.PI * 2) / 9) + 0.35;
      const t = r3;
      const rad = 0.36 + t * 0.56;
      lx = Math.cos(bladeAng + t * 0.48) * rad;
      ly = Math.sin(bladeAng + t * 0.48) * rad;
      lz = 0.32 + (seeded(i, 16) - 0.5) * 0.18;
    }

    // Rotate lens into dramatic 3/4 studio hero orientation!
    const y1 = ly * cosX - lz * sinX;
    const z1 = ly * sinX + lz * cosX;
    const x2 = lx * cosY + z1 * sinY;
    const z2 = -lx * sinY + z1 * cosY;

    arr[i * 3] = x2 * 0.95;
    arr[i * 3 + 1] = y1 * 0.95 + 0.12;
    arr[i * 3 + 2] = z2 * 0.95;
  }
  return sortSculptureParticles(arr);
}

// 03 · SILIKA: Sculpted Beveled AI Compute Cartridge & Dual Wafer Reels (direct homage to igloo.inc f09 monolith!)
function sampleSilikaCartridge(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 21);
    const r2 = seeded(i, 22);
    const r3 = seeded(i, 23);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.58) {
      // Solid Beveled Vertical Monolith Cassette Chassis (rounded superellipse profile like f09!)
      const u = r2 * Math.PI * 2;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      // Superellipse exponent n = 4 gives crisp rounded architectural corners
      const sx = Math.sign(cosU) * Math.pow(Math.abs(cosU), 0.52) * 1.18;
      const sy = Math.sign(sinU) * Math.pow(Math.abs(sinU), 0.52) * 1.62;
      const fill = 0.72 + 0.28 * Math.pow(seeded(i, 24), 0.45);
      x = sx * fill;
      y = sy * fill;
      z = (r3 - 0.5) * 0.68 * (1 - 0.18 * (sx * sx * 0.3 + sy * sy * 0.2));
    } else if (r1 < 0.90) {
      // Dual Sculpted Recessed Silicon Wafer Platters stacked vertically on front & back faces
      const cy = i % 2 === 0 ? 0.64 : -0.64;
      const ang = r2 * Math.PI * 2;
      const ring = 0.16 + Math.sqrt(r3) * 0.62;
      const groove = Math.sin(ring * 24) * 0.025;
      x = Math.cos(ang) * ring;
      y = cy + Math.sin(ang) * ring;
      z = (i % 4 < 2 ? 1 : -1) * (0.35 + groove);
    } else {
      // Top Machined Carrying Handle Loop (just like the top loop on the f09 relic!)
      const t = (r2 - 0.5) * Math.PI;
      const tubeAng = r3 * Math.PI * 2;
      const tubeR = 0.085;
      x = Math.sin(t) * 0.42 + Math.cos(tubeAng) * tubeR * 0.5;
      y = 1.62 + Math.cos(t) * 0.32 + Math.cos(tubeAng) * tubeR;
      z = Math.sin(tubeAng) * tubeR;
    }

    const yaw = -0.38;
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    arr[i * 3] = rx * 0.92;
    arr[i * 3 + 1] = y * 0.92 + 0.14;
    arr[i * 3 + 2] = rz * 0.92;
  }
  return sortSculptureParticles(arr);
}

// 04 · REDAM: Sculpted Architectural Acoustic Tuning Fork + Heavy Resonator Base + 3 Tilted Standing-Wave Rings
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

    if (r1 < 0.46) {
      // Twin Precision Rectangular-Beveled Acoustic Prongs clearly separated at x = -0.58 and +0.58
      const side = i % 2 === 0 ? -1 : 1;
      const t = r3;
      const rad = 0.185 * Math.pow(seeded(i, 34), 0.35);
      x = side * 0.58 + Math.cos(ang) * rad * 0.85;
      y = -0.08 + t * 1.78;
      z = Math.sin(ang) * rad * 1.15;
    } else if (r1 < 0.72) {
      // Sculpted U-Saddle & Weighted Cylindrical Acoustic Chamber Base
      if (r3 < 0.56) {
        const uAng = Math.PI + (r3 / 0.56) * Math.PI;
        const tubeR = 0.19 * Math.pow(seeded(i, 35), 0.35);
        x = Math.cos(uAng) * 0.58 + Math.cos(ang) * tubeR * 0.6;
        y = -0.08 + Math.sin(uAng) * 0.58;
        z = Math.sin(ang) * tubeR;
      } else {
        const stemT = (r3 - 0.56) / 0.44;
        const baseFlare = stemT > 0.55 ? 0.52 : 0.21;
        const rad = baseFlare * Math.pow(seeded(i, 36), 0.4);
        x = Math.cos(ang) * rad;
        y = -0.66 - stemT * 0.86;
        z = Math.sin(ang) * rad;
      }
    } else {
      // 3 Thick Volumetric Harmonic Wave Torus Rings tilted gracefully in 3D
      const ringIdx = i % 3;
      const majorR = 1.06 + ringIdx * 0.34;
      const minorR = 0.055 * Math.sqrt(r3);
      const subAng = seeded(i, 37) * Math.PI * 2;
      const tilt = (ringIdx - 1) * 0.18;
      const lx = Math.cos(ang) * (majorR + Math.cos(subAng) * minorR);
      const ly = Math.sin(subAng) * minorR + Math.sin(ang * 5 + ringIdx) * 0.05;
      const lz = Math.sin(ang) * (majorR + Math.cos(subAng) * minorR);
      x = lx;
      y = 0.48 + (ringIdx - 1) * 0.38 + ly * Math.cos(tilt) - lz * Math.sin(tilt);
      z = ly * Math.sin(tilt) + lz * Math.cos(tilt);
    }

    const yaw = 0.34;
    arr[i * 3] = x * Math.cos(yaw) + z * Math.sin(yaw);
    arr[i * 3 + 1] = y + 0.08;
    arr[i * 3 + 2] = -x * Math.sin(yaw) + z * Math.cos(yaw);
  }
  return sortSculptureParticles(arr);
}

// 05 · SOROT: Sculpted Spatial XR Stage Visor + Deep Dual Optical Barrels + Crown Halo Band
function sampleSorotVisor(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = seeded(i, 41);
    const r2 = seeded(i, 42);
    const r3 = seeded(i, 43);
    let x = 0;
    let y = 0;
    let z = 0;

    if (r1 < 0.54) {
      // Thick Curved Wrap-Around Spatial Visor Shield with sculpted nose arch & brow ridge
      const u = (r2 - 0.5) * 2.24;
      const noseArch = Math.exp(-u * u * 7.2) * 0.38;
      const v = r3;
      const heightSpan = 1.12 - Math.abs(u) * 0.16;
      y = (v - 0.5) * heightSpan + (v < 0.38 ? noseArch * (1 - v / 0.38) : 0);
      const shellDepth = (seeded(i, 44) - 0.5) * 0.24;
      x = Math.sin(u * 0.86) * 1.66;
      z = Math.cos(u * 0.82) * 0.82 - 0.12 + shellDepth;
    } else if (r1 < 0.84) {
      // Deep Twin Optical Projection Lens Tubes inside & protruding subtly forward
      const side = i % 2 === 0 ? -0.58 : 0.58;
      const ang = r2 * Math.PI * 2;
      const tubeZ = (r3 - 0.5) * 0.62;
      const rad = (0.44 - Math.abs(tubeZ) * 0.12) * (0.78 + 0.22 * Math.sqrt(seeded(i, 45)));
      x = side + Math.cos(ang) * rad;
      y = Math.sin(ang) * rad + 0.04;
      z = 0.42 + tubeZ;
    } else {
      // Rear Ergonomic Counterweight & Halo Headband
      const u = (r2 - 0.5) * Math.PI * 1.28;
      const bandThick = (r3 - 0.5) * 0.28;
      x = Math.sin(u) * 1.54;
      y = bandThick + Math.cos(u) * 0.14;
      z = -Math.cos(u) * 1.18 - 0.08 + (seeded(i, 46) - 0.5) * 0.14;
    }

    const pitch = -0.14;
    const ry = y * Math.cos(pitch) - z * Math.sin(pitch);
    const rz = y * Math.sin(pitch) + z * Math.cos(pitch);
    arr[i * 3] = x * 0.95;
    arr[i * 3 + 1] = ry * 0.95 + 0.12;
    arr[i * 3 + 2] = rz * 0.95;
  }
  return sortSculptureParticles(arr);
}

// 06 · TOWERING CYCLONE PARTICLE VORTEX (Sweeping spiral funnel plunging into the Sub-Crust Infinite Loop!)
function sampleParticleVortex(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s1 = seeded(i, 51);
    const s2 = seeded(i, 52);
    const s3 = seeded(i, 53);
    const arm = (i % 6) * ((Math.PI * 2) / 6);
    // Funnel stretches from wide top crown (r = 3.2, y = +1.8) down into deep gravity throat (r = 0.35, y = -3.6)
    const heightT = Math.pow(s1, 0.85);
    const y = 1.75 - heightT * 5.2;
    const funnelR = 0.32 + Math.pow(1 - heightT * 0.82, 1.55) * 2.95 + (s3 - 0.5) * 0.28;
    const theta = arm + (1 - heightT) * 6.4 + s2 * 0.75;

    arr[i * 3] = Math.cos(theta) * funnelR;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.sin(theta) * funnelR;
  }
  return sortSculptureParticles(arr);
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

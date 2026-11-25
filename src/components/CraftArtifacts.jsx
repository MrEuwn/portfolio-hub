import { useState } from 'react';

const DYE_BATHS = [
  { id: 'soga', label: 'Soga Tembaga', filter: 'sepia(0.25) saturate(1.18) contrast(1.06)', code: '#9A481E' },
  { id: 'wedel', label: 'Wedel Nila', filter: 'hue-rotate(192deg) saturate(1.25) contrast(1.08)', code: '#1E3A5F' },
  { id: 'keling', label: 'Keling Arang', filter: 'grayscale(0.75) contrast(1.28) brightness(0.84)', code: '#2A1E17' },
  { id: 'mori', label: 'Mori Mentah', filter: 'brightness(1.12) saturate(0.52) contrast(0.95)', code: '#EFE7D9' },
];

function WiralokaDyeLoupe() {
  const [bath, setBath] = useState(DYE_BATHS[0]);
  const [zoom, setZoom] = useState(false);
  const [gridOn, setGridOn] = useState(true);

  return (
    <div className="artifact-box" data-testid="artifact-wiraloka">
      <div className="artifact-box__head">
        <span className="mono-meta">LIVE ARTIFACT 01 · NATURAL DYE BATH & WEAVE LOUPE</span>
        <span className="mono-meta" style={{ color: '#e4d7c3' }}>
          BATH: {bath.code}
        </span>
      </div>

      <div className="artifact-controls">
        {DYE_BATHS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`artifact-btn ${bath.id === item.id ? 'is-active' : ''}`}
            onClick={() => setBath(item)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className={`artifact-btn ${zoom ? 'is-active' : ''}`}
          onClick={() => setZoom((z) => !z)}
        >
          {zoom ? 'Macro 1.65x ON' : 'Macro Loupe'}
        </button>
        <button
          type="button"
          className={`artifact-btn ${gridOn ? 'is-active' : ''}`}
          onClick={() => setGridOn((g) => !g)}
        >
          12.5vw Grid
        </button>
      </div>

      <div className="wiraloka-loupe-stage">
        <img
          src="/previews/wiraloka-batik/motif-parang.jpg"
          alt="Archival Parang batik weave scan responding to live natural dye filters"
          className="wiraloka-loupe-img"
          style={{
            filter: bath.filter,
            transform: zoom ? 'scale(1.65)' : 'scale(1)',
          }}
        />
        {gridOn && <div className="wiraloka-weave-overlay" aria-hidden="true" />}
      </div>
    </div>
  );
}

const KOMA_FILTERS = [
  {
    id: 'amber',
    label: '01 Amber Dichroic',
    color: '#D96B27',
    tStop: 'T1.8',
    transmission: '91.4%',
    kelvin: '+640K Warm',
    streakScale: 0.72,
  },
  {
    id: 'streak',
    label: '02 Anamorphic Streak',
    color: '#38BDF8',
    tStop: 'T2.0',
    transmission: '88.0%',
    kelvin: '-420K Cool',
    streakScale: 1.0,
  },
  {
    id: 'mist',
    label: '03 Frosted Mist',
    color: '#E5E7EB',
    tStop: 'T1.9',
    transmission: '86.2%',
    kelvin: '0K Neutral',
    streakScale: 0.45,
  },
];

function KomaFilterBench() {
  const [selected, setSelected] = useState(KOMA_FILTERS[0]);

  return (
    <div className="artifact-box" data-testid="artifact-koma">
      <div className="artifact-box__head">
        <span className="mono-meta">LIVE ARTIFACT 02 · DROP-IN OPTICAL FILTER BENCH</span>
        <span className="mono-meta" style={{ color: selected.color }}>
          PRISM O (III) · ACTIVE
        </span>
      </div>

      <div className="artifact-controls">
        {KOMA_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`artifact-btn ${selected.id === f.id ? 'is-active' : ''}`}
            onClick={() => setSelected(f)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="koma-beam-stage" style={{ '--beam-color': selected.color }}>
        <div className="mono-meta">SPECTRAL RESPONSE · [SYNTHETIC BENCH MODEL]</div>
        <div
          className="koma-streak-bar"
          style={{
            transform: `scaleX(${selected.streakScale})`,
            opacity: selected.id === 'mist' ? 0.65 : 1,
          }}
        />
        <div className="koma-metrics-grid">
          <div className="koma-metric-cell">
            <span className="mono-meta" style={{ opacity: 0.7 }}>
              T-STOP
            </span>
            <strong>{selected.tStop}</strong>
          </div>
          <div className="koma-metric-cell">
            <span className="mono-meta" style={{ opacity: 0.7 }}>
              TRANSMISSION
            </span>
            <strong>{selected.transmission}</strong>
          </div>
          <div className="koma-metric-cell">
            <span className="mono-meta" style={{ opacity: 0.7 }}>
              SPECTRUM
            </span>
            <strong>{selected.kelvin}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const SILIKA_MODS = [
  { id: 'slk-01', name: 'SLK-01 KESTREL', tops: 3200, watts: 700, hbm: '6.4 TB/s', temp: 67, curve: 'M0,74 Q90,62 180,44 T360,24' },
  { id: 'slk-04', name: 'SLK-04 RAPTOR', tops: 4800, watts: 950, hbm: '11.5 TB/s', temp: 76, curve: 'M0,78 Q90,56 180,32 T360,14' },
  { id: 'slk-12', name: 'SLK-12 PHOTON', tops: 2150, watts: 320, hbm: '4.2 TB/s', temp: 52, curve: 'M0,76 Q90,68 180,58 T360,44' },
  { id: 'slk-18', name: 'SLK-18 CRYO-T', tops: 5400, watts: 840, hbm: '14.0 TB/s', temp: 41, curve: 'M0,80 Q90,74 180,66 T360,56' },
];

function SilikaSpecComparator() {
  const [primaryId, setPrimaryId] = useState('slk-01');
  const [peerId, setPeerId] = useState('slk-12');

  const primary = SILIKA_MODS.find((m) => m.id === primaryId) || SILIKA_MODS[0];
  const peer = SILIKA_MODS.find((m) => m.id === peerId) || SILIKA_MODS[2];

  const effPrimary = (primary.tops / primary.watts).toFixed(2);
  const effPeer = (peer.tops / peer.watts).toFixed(2);

  return (
    <div className="artifact-box" data-testid="artifact-silika">
      <div className="artifact-box__head">
        <span className="mono-meta">LIVE ARTIFACT 03 · SILICON BENCHMARK [SYNTHETIC DEMO DATA]</span>
        <span className="mono-meta" style={{ color: '#38BDF8' }}>
          {primary.name} vs {peer.name}
        </span>
      </div>

      <div className="artifact-controls">
        {SILIKA_MODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`artifact-btn ${primary.id === m.id ? 'is-active' : ''}`}
            onClick={() => {
              if (m.id === peerId) setPeerId(primaryId);
              setPrimaryId(m.id);
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="silika-comp-grid">
        <div className="silika-stat-row">
          <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mono-meta">
            <span>{primary.name}</span>
            <span>{effPrimary} TOPS/W</span>
          </div>
          <div className="silika-bar-track">
            <div
              className="silika-bar-fill"
              style={{ transform: `scaleX(${Math.min(1, Number(effPrimary) / 8)})` }}
            />
          </div>
          <span className="mono-meta" style={{ opacity: 0.72 }}>
            {primary.tops} TOPS · {primary.watts}W · HBM {primary.hbm} · {primary.temp}C
          </span>
        </div>

        <div className="silika-stat-row" style={{ borderColor: 'rgba(244, 243, 238, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mono-meta">
            <span>PEER: {peer.name}</span>
            <span>{effPeer} TOPS/W</span>
          </div>
          <div className="silika-bar-track">
            <div
              className="silika-bar-fill"
              style={{
                background: '#93a4bd',
                transform: `scaleX(${Math.min(1, Number(effPeer) / 8)})`,
              }}
            />
          </div>
          <span className="mono-meta" style={{ opacity: 0.72 }}>
            {peer.tops} TOPS · {peer.watts}W · HBM {peer.hbm} · {peer.temp}C
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 360 90"
        className="silika-curve-svg"
        role="img"
        aria-label={`Thermal load comparison chart between ${primary.name} and ${peer.name}`}
      >
        <line x1="0" y1="30" x2="360" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
        <line x1="0" y1="60" x2="360" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
        <path d={peer.curve} fill="none" stroke="#93a4bd" strokeWidth="2" strokeDasharray="5 4" />
        <path d={primary.curve} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function RedamAcousticLab() {
  const [volume, setVolume] = useState(180);
  const [absorptionPct, setAbsorptionPct] = useState(38);

  // Sabine RT60 = 0.161 * V / A (simplified room envelope model labeled as pre-audit hypothesis)
  const approxSurfaceArea = 6 * Math.pow(volume, 2 / 3);
  const avgAlpha = 0.06 + (absorptionPct / 100) * 0.56;
  const rt60 = (0.161 * volume) / Math.max(1, approxSurfaceArea * avgAlpha);
  const dbDrop = Math.min(14, Math.round((absorptionPct / 100) * 14));
  const verdict = rt60 <= 0.65 ? 'TEREDAM · CONVERSATION CLEAR' : rt60 <= 1.05 ? 'MODERATE ECHO' : 'HARSH REVERB';

  return (
    <div className="artifact-box" data-testid="artifact-redam">
      <div className="artifact-box__head">
        <span className="mono-meta">LIVE ARTIFACT 04 · SABINE RT60 ESTIMATOR [PRE-AUDIT]</span>
        <span className="mono-meta" style={{ color: '#FFA125' }}>
          EST. -{dbDrop} dB
        </span>
      </div>

      <div className="redam-sliders">
        <label className="redam-slider-field">
          <span className="mono-meta">Room Volume: {volume} m3</span>
          <input
            type="range"
            min="45"
            max="480"
            step="5"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>

        <label className="redam-slider-field">
          <span className="mono-meta">Acoustic Panel Coverage: {absorptionPct}%</span>
          <input
            type="range"
            min="5"
            max="85"
            step="1"
            value={absorptionPct}
            onChange={(e) => setAbsorptionPct(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="redam-readout-banner">
        <div>
          <span className="mono-meta" style={{ opacity: 0.78 }}>
            ESTIMATED SABINE RT60
          </span>
          <strong>{rt60.toFixed(2)}s</strong>
        </div>
        <span className="mono-meta" style={{ color: '#FFA125' }}>
          {verdict}
        </span>
      </div>
    </div>
  );
}

const SOROT_CUES = [
  {
    id: 'vermilion',
    label: 'Cue 01 · Vermilion',
    bg: '#D9381E',
    ink: '#FFFFFF',
    punch: '#111214',
    bpm: '128 BPM · 0.00ms LOCK',
    headline: 'SIGNAL VERMILION STAGE',
  },
  {
    id: 'chiaroscuro',
    label: 'Cue 02 · Chiaroscuro',
    bg: '#111214',
    ink: '#FFFFFF',
    punch: '#29DAFF',
    bpm: '112 BPM · 0.00ms LOCK',
    headline: 'CARBON OBSIDIAN VOID',
  },
  {
    id: 'paper',
    label: 'Cue 03 · Studio Paper',
    bg: '#F7F6F2',
    ink: '#111214',
    punch: '#D9381E',
    bpm: '096 BPM · 0.00ms LOCK',
    headline: 'ARCHITECTURAL DAYLIGHT',
  },
];

function SorotCueConsole() {
  const [cue, setCue] = useState(SOROT_CUES[0]);

  return (
    <div className="artifact-box" data-testid="artifact-sorot">
      <div className="artifact-box__head">
        <span className="mono-meta">LIVE ARTIFACT 05 · STAGE LIGHTING CUE POLARITY CONSOLE</span>
        <span className="mono-meta" style={{ color: '#29DAFF' }}>
          {cue.bpm}
        </span>
      </div>

      <div className="artifact-controls">
        {SOROT_CUES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`artifact-btn ${cue.id === c.id ? 'is-active' : ''}`}
            onClick={() => setCue(c)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        className="sorot-cue-preview"
        style={{ backgroundColor: cue.bg, color: cue.ink }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mono-meta">
          <span>SMPTE ST 2110 · MA3 FIBER</span>
          <span style={{ color: cue.punch }}>ACTIVE CUE</span>
        </div>
        <h4 className="sorot-cue-preview__title">
          {cue.headline.split(' ').slice(0, 2).join(' ')}{' '}
          <span style={{ color: cue.punch }}>{cue.headline.split(' ').slice(2).join(' ')}</span>
        </h4>
      </div>
    </div>
  );
}

export default function CraftArtifactEmbed({ slug }) {
  switch (slug) {
    case 'wiraloka-batik':
      return <WiralokaDyeLoupe />;
    case 'koma-optics':
      return <KomaFilterBench />;
    case 'silika-vault':
      return <SilikaSpecComparator />;
    case 'redam-acoustics':
      return <RedamAcousticLab />;
    case 'sorot-scenics':
      return <SorotCueConsole />;
    default:
      return <WiralokaDyeLoupe />;
  }
}

import { useEffect, useState } from 'react';
import { ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { PROJECTS, STUDIO_PROFILE } from '../data/hubData';

const SCRAMBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ//:#[]+';

function useScrambleText(targetText, durationMs = 420) {
  const [display, setDisplay] = useState(targetText);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(targetText);
      return undefined;
    }

    let frame = 0;
    const totalFrames = Math.max(8, Math.round(durationMs / 28));
    const timer = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * targetText.length);
      let next = '';
      for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === ' ') {
          next += ' ';
        } else if (i < revealCount) {
          next += targetText[i];
        } else {
          next += SCRAMBLE_CHARS[(i * 7 + frame * 13) % SCRAMBLE_CHARS.length];
        }
      }
      setDisplay(next);
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(targetText);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [targetText, durationMs]);

  return display;
}

export default function IglooHudOverlay({
  lang,
  onToggleLang,
  loadProgress,
  loopPct,
  stage,
  hoverTriangle,
  cadPoints,
  soundOn,
  onToggleSound,
  indexOpen,
  onToggleIndex,
  onJumpToProgress,
  onStepChamber,
  onInspectProject,
  onOpenFullCase,
  onOpenBrief,
}) {
  const isLoaded = loadProgress >= 0.99;
  const activeProject =
    stage.projectIdx >= 0 ? PROJECTS[stage.projectIdx] || PROJECTS[0] : null;

  const topDarkLine =
    stage.mode === 'loading'
      ? `CAD SURVEY // ${String(Math.round(loadProgress * 100)).padStart(3, '0')}%`
      : stage.mode === 'hero'
        ? lang === 'id'
          ? 'OBSERVATORIUM KUARSA // 05 DUNIA AWWWARDS'
          : 'SUB-SURFACE OBSERVATORY // 05 AWWWARDS WORLDS'
        : stage.mode === 'plunge'
          ? 'DESCENDING // STARGATE APERTURE RING'
          : stage.mode === 'chamber' && activeProject
            ? `CHAMBER ${activeProject.index} // ${activeProject.categoryLabel.toUpperCase()}`
            : 'CORE VORTEX // CONTINUOUS INFINITE LOOP';

  const topLightLine =
    stage.mode === 'loading'
      ? 'INITIALIZING GEODESIC MASONRY + 15K POINT CLOUD'
      : stage.mode === 'hero'
        ? lang === 'id'
          ? 'GULIR TANPA BATAS · SENTUH BLOK BATU'
          : 'SCROLL INFINITE LOOP · HOVER MASONRY BLOCKS'
        : stage.mode === 'chamber' && activeProject
          ? `${activeProject.title.toUpperCase()} · ${activeProject.shortName}`
          : stage.mode === 'vortex'
            ? 'SWEEP CURSOR TO EXCITE VORTEX · SCROLL TO REASSEMBLE'
            : 'CALIBRATING VOLUMETRIC POINT CLOUD';

  const scrambledDark = useScrambleText(topDarkLine, 380);
  const scrambledLight = useScrambleText(topLightLine, 460);

  const bottomTag = isLoaded
    ? `${String(loopPct).padStart(3, '0')}% // LOOP ∞`
    : `LOAD ${String(Math.round(loadProgress * 100)).padStart(3, '0')}%`;

  return (
    <div className="igloo-hud-layer">
      {/* Subtle 1px Dot-Matrix Mist Grid (exact f06 & f10 atmospheric grid!) */}
      <div
        className="igloo-dot-matrix"
        style={{ opacity: stage.mode === 'plunge' || stage.mode === 'chamber' ? 0.52 : 0.18 }}
        aria-hidden="true"
      />

      {/* Beat 0: Isometric 3D CAD Preloader Vertex Crosses & Numbers (exact f01 & f02!) */}
      {!isLoaded && cadPoints.length > 0 && (
        <div className="igloo-cad-overlay" aria-hidden="true">
          {cadPoints.map((pt, idx) => (
            <span
              key={idx}
              className="igloo-cad-node"
              style={{
                transform: `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0)`,
              }}
            >
              <b>+</b>
              <small>{String(pt.val).padStart(2, '0')}</small>
            </span>
          ))}
        </div>
      )}

      {/* Beat 1: 1px White Hover Tracking Triangle Over Observatory Masonry Blocks (exact f04!) */}
      {isLoaded && hoverTriangle && hoverTriangle.length === 3 && (
        <svg className="igloo-hover-tri-svg" aria-hidden="true">
          <polygon
            points={hoverTriangle.map((t) => `${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(' ')}
            fill="rgba(255, 255, 255, 0.06)"
            stroke="rgba(255, 255, 255, 0.88)"
            strokeWidth="1"
          />
          {hoverTriangle.map((t) => (
            <g key={t.code} transform={`translate(${t.x.toFixed(1)}, ${t.y.toFixed(1)})`}>
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#ffffff" strokeWidth="1" />
              <text
                x="6"
                y="-6"
                fill="#ffffff"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
              >
                {t.code}
              </text>
            </g>
          ))}
        </svg>
      )}

      {/* Depth-of-Field Blurred Background Telemetry Watermarks (exact f06 & f10!) */}
      {isLoaded && (stage.mode === 'plunge' || stage.mode === 'chamber') && (
        <div className="igloo-dof-watermarks" aria-hidden="true">
          <div className="igloo-dof-watermark igloo-dof-watermark--left">
            <span>PRE-LOAD // {activeProject ? activeProject.index : '01'}</span>
            <span>00 001 26</span>
          </div>
          <div className="igloo-dof-watermark igloo-dof-watermark--right">
            <span>{activeProject ? activeProject.shortName : 'VAULT'} // SPECIMEN</span>
            <span>{activeProject ? activeProject.tokens.ratio : '15000 PTS'}</span>
          </div>
        </div>
      )}

      {/* TOP-LEFT: Double-Stroke Outlined Geometric Wordmark + Pixel-Block Scramble Strips (exact f05 & f11!) */}
      <header className="igloo-top-left">
        <button
          type="button"
          className="igloo-wordmark-btn"
          onClick={() => onJumpToProgress(0)}
          aria-label="Return camera to surface observatory"
        >
          <svg
            width="176"
            height="34"
            viewBox="0 0 220 42"
            className="igloo-wordmark-svg"
            aria-hidden="true"
          >
            <text
              x="2"
              y="32"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              fontFamily="Archivo, Impact, sans-serif"
              fontWeight="800"
              fontSize="33"
              letterSpacing="3"
            >
              PRAFASTA
            </text>
            <text
              x="2"
              y="32"
              fill="none"
              stroke="rgba(32, 38, 48, 0.55)"
              strokeWidth="0.9"
              fontFamily="Archivo, Impact, sans-serif"
              fontWeight="800"
              fontSize="33"
              letterSpacing="3"
            >
              PRAFASTA
            </text>
          </svg>
        </button>

        <div className="igloo-scramble-stack" aria-live="polite">
          <span className="igloo-bar igloo-bar--dark">{scrambledDark}</span>
          <span className="igloo-bar igloo-bar--light">{scrambledLight}</span>
        </div>
      </header>

      {/* TOP-RIGHT: Minimal Dark Glitch-Tag Controls (SOUND, INDEX [05], LANG, BRIEF) */}
      <nav className="igloo-top-right" aria-label="Observatory controls">
        <button
          type="button"
          className="igloo-hud-chip"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute atmospheric audio' : 'Enable atmospheric audio'}
          data-testid="hud-sound-btn"
        >
          {soundOn ? <Volume2 size={13} aria-hidden="true" /> : <VolumeX size={13} aria-hidden="true" />}
          <span className="igloo-sfx-label">{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
        </button>

        <button
          type="button"
          className="igloo-hud-chip"
          onClick={onToggleLang}
          data-testid="hud-lang-btn"
        >
          <span>{lang === 'en' ? 'ID' : 'EN'}</span>
        </button>

        <button
          type="button"
          className={`igloo-hud-chip ${indexOpen ? 'igloo-hud-chip--active' : ''}`}
          onClick={onToggleIndex}
          aria-expanded={indexOpen}
          data-testid="hud-index-btn"
        >
          <span>INDEX [05]</span>
        </button>

        <button
          type="button"
          className="igloo-hud-chip igloo-hud-chip--light"
          onClick={onOpenBrief}
          data-testid="hud-brief-btn"
        >
          <span>BRIEF</span>
        </button>
      </nav>

      {/* Quick-Jump Index Dropdown Sheet */}
      {indexOpen && (
        <aside className="igloo-index-drawer" aria-label="Jump to any portfolio chamber">
          <div className="igloo-index-drawer__head">
            <span>SELECT CHAMBER OR SCOPED WORLD</span>
            <span>05 LIVE</span>
          </div>
          {PROJECTS.map((proj, idx) => {
            const chamberProg = 0.32 + idx * 0.104;
            return (
              <div key={proj.slug} className="igloo-index-row">
                <button
                  type="button"
                  className="igloo-index-row__jump"
                  onClick={() => {
                    onToggleIndex();
                    onJumpToProgress(chamberProg);
                  }}
                >
                  <span
                    className="igloo-index-row__dot"
                    style={{ backgroundColor: proj.tokens.accent }}
                    aria-hidden="true"
                  />
                  <span>
                    {proj.index} · {proj.title}
                  </span>
                </button>

                <div className="igloo-index-row__links">
                  <button
                    type="button"
                    className="igloo-mini-btn"
                    onClick={() => {
                      onToggleIndex();
                      onOpenFullCase(proj.slug);
                    }}
                  >
                    CASE
                  </button>
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="igloo-mini-btn"
                    aria-label={`Open live site for ${proj.title}`}
                  >
                    ↗
                  </a>
                </div>
              </div>
            );
          })}
        </aside>
      )}

      {/* BEAT 3: PEDESTAL LEFT/RIGHT RETICLE ARROWS + GLOWING CORNER-BRACKETED PLAQUE (exact f09 & f10!) */}
      {isLoaded && stage.mode === 'chamber' && activeProject && (
        <>
          <div className="igloo-chamber-arrows">
            <button
              type="button"
              className="igloo-reticle-arrow"
              onClick={() => onStepChamber(-1)}
              aria-label="Previous relic chamber"
              data-testid="chamber-prev-btn"
            >
              <span aria-hidden="true">↼</span>
            </button>

            <div className="igloo-chamber-caption">
              <span className="igloo-chamber-caption__code">
                RELIC {activeProject.index} / 05 · {activeProject.status.toUpperCase()}
              </span>
              <h2 className="igloo-chamber-caption__title">{activeProject.title}</h2>
              <p className="igloo-chamber-caption__sub">
                {lang === 'id' ? activeProject.subtitleId : activeProject.subtitleEn}
              </p>
            </div>

            <button
              type="button"
              className="igloo-reticle-arrow"
              onClick={() => onStepChamber(1)}
              aria-label="Next relic chamber"
              data-testid="chamber-next-btn"
            >
              <span aria-hidden="true">⇀</span>
            </button>
          </div>

          <div className="igloo-pedestal-plaque-bar">
            <button
              type="button"
              className="igloo-mini-plaque"
              onClick={() => onOpenFullCase(activeProject.slug)}
              data-testid="chamber-case-btn"
            >
              FULL CASE
            </button>

            <button
              type="button"
              className="igloo-glow-plaque"
              onClick={() => onInspectProject(activeProject.slug)}
              data-testid="chamber-inspect-btn"
            >
              <span className="plaque-corner plaque-corner--tl" aria-hidden="true" />
              <span className="plaque-corner plaque-corner--tr" aria-hidden="true" />
              <span className="plaque-corner plaque-corner--bl" aria-hidden="true" />
              <span className="plaque-corner plaque-corner--br" aria-hidden="true" />
              <span>
                {lang === 'id' ? 'INSPEKSI' : 'INSPECT'} {activeProject.index} ·{' '}
                {activeProject.shortName}
              </span>
            </button>

            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="igloo-mini-plaque"
              aria-label={`Launch live site ${activeProject.title}`}
            >
              <span>LIVE</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </>
      )}

      {/* BEAT 4: INTERACTIVE VOLUMETRIC PARTICLE VORTEX FOOTER HUD */}
      {isLoaded && stage.mode === 'vortex' && (
        <div className="igloo-vortex-hud">
          <p className="igloo-vortex-hud__kicker">
            06 // VOLUMETRIC REACTOR VORTEX · KEEP SCROLLING TO LOOP INTO SURFACE DOME
          </p>
          <div className="igloo-vortex-links">
            {PROJECTS.map((proj) => (
              <a
                key={proj.slug}
                href={proj.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="igloo-vortex-pill"
              >
                <span>
                  {proj.index} {proj.title}
                </span>
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="igloo-vortex-meta">
            <span>{STUDIO_PROFILE.email}</span>
            <span>·</span>
            <a href={STUDIO_PROFILE.githubProfile} target="_blank" rel="noreferrer">
              github.com/{STUDIO_PROFILE.handle} ↗
            </a>
          </div>
        </div>
      )}

      {/* BOTTOM-LEFT: White Glitch Block Scroll/Loop Indicator (exact f05..f11 bottom-left bar!) */}
      <div className="igloo-bottom-left" aria-hidden="true">
        <span className="igloo-pixel-glyph">▒░</span>
        <span className="igloo-bottom-tag">{bottomTag}</span>
      </div>

      {/* BOTTOM-RIGHT: 5-Relic Progress Pip Strip */}
      <div className="igloo-bottom-right" role="group" aria-label="Scroll progress checkpoints">
        <button
          type="button"
          className={`igloo-checkpoint-pip ${stage.mode === 'hero' ? 'is-active' : ''}`}
          onClick={() => onJumpToProgress(0.0)}
          title="Surface Observatory"
          aria-label="Jump to Surface Observatory"
        >
          00
        </button>
        {PROJECTS.map((proj, idx) => (
          <button
            key={proj.slug}
            type="button"
            className={`igloo-checkpoint-pip ${
              stage.mode === 'chamber' && stage.projectIdx === idx ? 'is-active' : ''
            }`}
            onClick={() => onJumpToProgress(0.32 + idx * 0.104)}
            title={proj.title}
            aria-label={`Jump to ${proj.title}`}
          >
            {proj.index}
          </button>
        ))}
        <button
          type="button"
          className={`igloo-checkpoint-pip ${stage.mode === 'vortex' ? 'is-active' : ''}`}
          onClick={() => onJumpToProgress(0.85)}
          title="Particle Vortex"
          aria-label="Jump to Particle Vortex"
        >
          ∞
        </button>
      </div>
    </div>
  );
}

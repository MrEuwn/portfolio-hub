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
    const totalFrames = Math.max(8, Math.round(durationMs / 26));
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
    }, 26);

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
  chamberMotion = { presence: 1, morph: 0, velocity: 0 },
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
          ? 'OBSERVATORIUM ARKTIK // 05 DUNIA AWWWARDS'
          : 'ARCTIC OBSERVATORY // 05 AWWWARDS WORLDS'
        : stage.mode === 'plunge'
          ? 'DESCENDING // STARGATE PLASMA APERTURE'
          : stage.mode === 'chamber' && activeProject
            ? `CHAMBER ${activeProject.index} // ${activeProject.categoryLabel.toUpperCase()}`
            : 'CYCLONE VORTEX // CONTINUOUS INFINITE LOOP';

  const topLightLine =
    stage.mode === 'loading'
      ? 'CALIBRATING VOUSSOIR MASONRY + 42K VOXELS'
      : stage.mode === 'hero'
        ? lang === 'id'
          ? 'GULIR TANPA BATAS · SENTUH BLOK BATU'
          : 'SCROLL INFINITE LOOP · HOVER STONE BLOCKS'
        : stage.mode === 'chamber' && activeProject
          ? `${activeProject.title.toUpperCase()} · ${activeProject.shortName}`
          : stage.mode === 'vortex'
            ? 'KEEP SCROLLING TO DIVE THROUGH STORM INTO SUMMIT'
            : 'ENTERING SUB-SURFACE HALO PEDESTAL';

  const scrambledDark = useScrambleText(topDarkLine, 360);
  const scrambledLight = useScrambleText(topLightLine, 440);
  const scrambledChamberTitle = useScrambleText(
    activeProject ? activeProject.title : '',
    320
  );

  const bottomTag = isLoaded
    ? `${String(loopPct).padStart(3, '0')}% // LOOP ∞`
    : `LOAD ${String(Math.round(loadProgress * 100)).padStart(3, '0')}%`;

  const presence = Math.max(0.18, Math.min(1, chamberMotion.presence));
  const captionShiftY = ((1 - presence) * -18).toFixed(1);
  const captionBlur = ((1 - presence) * 6.5).toFixed(2);
  const plaqueShiftY = ((1 - presence) * 14).toFixed(1);

  return (
    <div className="igloo-hud-layer">
      {/* Subtle 1px Dot-Matrix Mist Grid (exact f06 & f10 atmospheric grid!) */}
      <div
        className="igloo-dot-matrix"
        style={{
          opacity:
            stage.mode === 'plunge'
              ? 0.56
              : stage.mode === 'chamber'
                ? 0.36
                : 0.1,
        }}
        aria-hidden="true"
      />

      {/* Beat 0: Isometric 3D CAD Preloader Vertex Crosses & Numbers (exact f01 & f03!) */}
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

      {/* Beat 1: 1px White Hover Tracking Triangle Over Observatory Voussoir Blocks (exact f04!) */}
      {isLoaded && hoverTriangle && hoverTriangle.length === 3 && (
        <svg className="igloo-hover-tri-svg" aria-hidden="true">
          <polygon
            points={hoverTriangle.map((t) => `${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(' ')}
            fill="rgba(255, 255, 255, 0.05)"
            stroke="rgba(255, 255, 255, 0.92)"
            strokeWidth="1"
          />
          {hoverTriangle.map((t) => (
            <g key={t.code} transform={`translate(${t.x.toFixed(1)}, ${t.y.toFixed(1)})`}>
              <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#ffffff" strokeWidth="1" />
              <text
                x="6"
                y="-6"
                fill="#ffffff"
                fontSize="10.5"
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
        <div
          className="igloo-dof-watermarks"
          style={{ opacity: stage.mode === 'plunge' ? 0.85 : 0.42 + presence * 0.45 }}
          aria-hidden="true"
        >
          <div className="igloo-dof-watermark igloo-dof-watermark--left">
            <span>PRE-LOAD OFF/{activeProject ? activeProject.index : '01'}</span>
            <span>00 001 26</span>
          </div>
          <div className="igloo-dof-watermark igloo-dof-watermark--right">
            <span>{activeProject ? activeProject.shortName : 'VAULT'} // SPECIMEN</span>
            <span>42,000 VOXELS · {activeProject ? activeProject.tokens.ratio : 'AAA'}</span>
          </div>
        </div>
      )}

      {/* TOP-LEFT: Double-Line Geometric Stencil Logotype + Glitch Telemetry Bars (exact f05, f08, f10, f11!) */}
      <header className="igloo-top-left">
        <button
          type="button"
          className="igloo-wordmark-btn"
          onClick={() => onJumpToProgress(0)}
          aria-label="Return camera to surface observatory"
        >
          <svg
            width="164"
            height="32"
            viewBox="0 0 236 44"
            className="igloo-wordmark-svg"
            aria-hidden="true"
          >
            {/* Outer sci-fi corner micro-ticks matching IGLOO stencil framing */}
            <path
              d="M2 10V3H10 M226 3H234V10 M2 34V41H10 M226 41H234V34"
              fill="none"
              stroke="rgba(255,255,255,0.88)"
              strokeWidth="1.6"
            />
            <text
              x="12"
              y="32"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinejoin="round"
              fontFamily="Archivo, Impact, sans-serif"
              fontWeight="800"
              fontSize="29"
              letterSpacing="4.5"
            >
              PRAFASTA
            </text>
            <text
              x="12"
              y="32"
              fill="none"
              stroke="rgba(45, 52, 64, 0.72)"
              strokeWidth="1.1"
              strokeLinejoin="round"
              fontFamily="Archivo, Impact, sans-serif"
              fontWeight="800"
              fontSize="29"
              letterSpacing="4.5"
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

      {/* TOP-RIGHT: Clean Minimal Atmospheric Glitch-Tags (matching f11 minimal upper-right tag!) */}
      <nav className="igloo-top-right" aria-label="Observatory controls">
        <button
          type="button"
          className="igloo-hud-chip"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute atmospheric audio' : 'Enable atmospheric audio'}
          data-testid="hud-sound-btn"
        >
          {soundOn ? <Volume2 size={12} aria-hidden="true" /> : <VolumeX size={12} aria-hidden="true" />}
          <span className="igloo-sfx-label">{soundOn ? 'SFX ON' : 'SFX'}</span>
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
            const chamberProg = 0.305 + idx * 0.1;
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

      {/* BEAT 3: EXACT f10 GEOMETRIC LINE-HOOK RETICLE ARROWS + FLUID MOTION CAPTION + DOUBLE-BRACKET PLAQUE */}
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
              <svg width="62" height="18" viewBox="0 0 62 18" aria-hidden="true">
                <path
                  d="M13 2 L2 13 L60 13"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.25"
                />
              </svg>
            </button>

            <div
              className="igloo-chamber-caption"
              style={{
                opacity: presence,
                transform: `translate3d(-50%, ${captionShiftY}px, 0)`,
                filter: `blur(${captionBlur}px)`,
              }}
            >
              <span className="igloo-chamber-caption__code">
                RELIC {activeProject.index} / 05 · {activeProject.status.toUpperCase()}
              </span>
              <h2 className="igloo-chamber-caption__title">{scrambledChamberTitle}</h2>
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
              <svg width="62" height="18" viewBox="0 0 62 18" aria-hidden="true">
                <path
                  d="M49 2 L60 13 L2 13"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.25"
                />
              </svg>
            </button>
          </div>

          <div
            className="igloo-pedestal-plaque-bar"
            style={{
              opacity: 0.35 + presence * 0.65,
              transform: `translate3d(-50%, ${plaqueShiftY}px, 0)`,
            }}
          >
            <button
              type="button"
              className="igloo-mini-plaque"
              onClick={() => onOpenFullCase(activeProject.slug)}
              data-testid="chamber-case-btn"
            >
              CASE
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
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          </div>
        </>
      )}

      {/* BEAT 4: TOWERING CYCLONE PARTICLE VORTEX FOOTER HUD */}
      {isLoaded && stage.mode === 'vortex' && (
        <div className="igloo-vortex-hud">
          <p className="igloo-vortex-hud__kicker">
            06 // CYCLONE REACTOR VORTEX · SCROLL DOWN TO ERUPT ABOVE ARCTIC SUMMIT
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
        <span className="igloo-pixel-glyph">▓▒</span>
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
            onClick={() => onJumpToProgress(0.305 + idx * 0.1)}
            title={proj.title}
            aria-label={`Jump to ${proj.title}`}
          >
            {proj.index}
          </button>
        ))}
        <button
          type="button"
          className={`igloo-checkpoint-pip ${stage.mode === 'vortex' ? 'is-active' : ''}`}
          onClick={() => onJumpToProgress(0.835)}
          title="Particle Vortex"
          aria-label="Jump to Particle Vortex"
        >
          ∞
        </button>
      </div>
    </div>
  );
}

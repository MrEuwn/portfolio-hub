import { useEffect, useState } from 'react';
import { ArrowDownRight, Layers } from 'lucide-react';
import { HUB_COPY, PROJECTS, STUDIO_PROFILE } from '../data/hubData';
import OpticalMonolithCanvas from './OpticalMonolithCanvas';

export default function GalleryHero({
  lang,
  ready,
  activeWorldSlug,
  onSelectWorld,
  onScrollToSection,
}) {
  const [coords, setCoords] = useState({ x: 720, y: 450 });
  const copy = HUB_COPY[lang] || HUB_COPY.en;
  const activeWorld = PROJECTS.find((p) => p.slug === activeWorldSlug) || PROJECTS[0];

  useEffect(() => {
    const onMove = (e) => {
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section
      id="hero"
      className={`gallery-hero ${ready ? 'is-ready' : ''}`}
      data-surface-polarity="light"
    >
      {/* Wiraloka DNA: 8-Column 12.5vw Architectural Hairline Weave Grid */}
      <div className="hero-weave-grid" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hero-weave-grid__col" />
        ))}
        <div className="hero-weave-grid__horiz" style={{ top: '28%' }} />
        <div className="hero-weave-grid__horiz" style={{ top: '64%' }} />
      </div>

      {/* Single-Context WebGL2 5-Faceted Optical Refraction Monolith */}
      <OpticalMonolithCanvas activeWorld={activeWorld} />

      <div className="container gallery-hero__inner">
        {/* SILIKA DNA: Precision Corner Coordinate Telemetry */}
        <div className="hero-telemetry-top mono-meta">
          <span>{copy.heroKicker}</span>
          <span className="hero-telemetry-coords">
            <span>{STUDIO_PROFILE.edition}</span>
            <span>
              X:{String(coords.x).padStart(4, '0')} Y:{String(coords.y).padStart(4, '0')}
            </span>
          </span>
        </div>

        {/* Monumental Mixed-Script Display Title + Grounded Thesis Box */}
        <div className="hero-headline-stage">
          <h1 className="hero-h1">
            <span className="line-mask line-mask--d1">
              <span className="hero-h1__italic">{copy.heroTitleLine1}</span>
            </span>
            <span className="line-mask line-mask--d2">
              <span className="hero-h1__sans">{copy.heroTitleLine2}</span>
            </span>
            <span className="line-mask line-mask--d3">
              <span>{copy.heroTitleLine3}</span>
            </span>
          </h1>

          <div className="hero-aside-thesis">
            <span className="mono-meta" style={{ color: activeWorld.tokens.accent }}>
              ACTIVE PRISM FACET · {activeWorld.index} {activeWorld.title.toUpperCase()}
            </span>
            <p className="hero-aside-thesis__copy">{copy.heroSub}</p>
            <div className="hero-aside-thesis__actions">
              <button
                type="button"
                className="duo-btn duo-btn--solid"
                onClick={() => onScrollToSection('index')}
              >
                <span className="duo-track">
                  <span>{copy.ctaExplore}</span>
                  <span aria-hidden="true">{copy.ctaExplore}</span>
                </span>
                <ArrowDownRight size={15} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="duo-btn"
                onClick={() => onScrollToSection('synthesis')}
              >
                <Layers size={14} aria-hidden="true" />
                <span className="duo-track">
                  <span>{copy.ctaLab}</span>
                  <span aria-hidden="true">{copy.ctaLab}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom World Facet Selector Rail */}
        <div className="hero-bottom-bar">
          <div className="hero-world-strip" role="group" aria-label="Switch active prism world">
            {PROJECTS.map((project) => (
              <button
                key={project.slug}
                type="button"
                className={`hero-world-chip ${
                  project.slug === activeWorld.slug ? 'is-active' : ''
                }`}
                onClick={() => onSelectWorld(project.slug)}
                onMouseEnter={() => onSelectWorld(project.slug)}
              >
                <span
                  className="hero-world-chip__swatch"
                  style={{ backgroundColor: project.tokens.accent }}
                  aria-hidden="true"
                />
                <span>
                  {project.index} {project.title}
                </span>
              </button>
            ))}
          </div>

          <span className="mono-meta" style={{ color: 'var(--ink-muted)' }}>
            {lang === 'id' ? STUDIO_PROFILE.roleId : STUDIO_PROFILE.roleEn}
          </span>
        </div>
      </div>
    </section>
  );
}

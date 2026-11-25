import { useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { CATEGORIES, HUB_COPY, PILLARS, PROJECTS } from '../data/hubData';

export default function CuratorialIndex({
  lang,
  activeWorldSlug,
  onSelectWorld,
  onOpenCase,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [viewMode, setViewMode] = useState('ledger');
  const [plateIdx, setPlateIdx] = useState(0);

  const copy = HUB_COPY[lang] || HUB_COPY.en;

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const catOk = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const pilOk = selectedPillar === 'all' || p.pillars.includes(selectedPillar);
      return catOk && pilOk;
    });
  }, [selectedCategory, selectedPillar]);

  const activeProject =
    filteredProjects.find((p) => p.slug === activeWorldSlug) ||
    filteredProjects[0] ||
    PROJECTS[0];

  const activePlate = activeProject.plates[plateIdx % activeProject.plates.length];

  const handleActivateRow = (slug) => {
    if (slug !== activeWorldSlug) {
      setPlateIdx(0);
      onSelectWorld(slug);
    }
  };

  return (
    <section id="index" className="curatorial-index" data-surface-polarity="light">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-head__eyebrow mono-meta">{copy.indexEyebrow}</span>
            <h2 className="section-head__title">{copy.indexHeading}</h2>
          </div>

          <div className="view-mode-switch" role="group" aria-label="Index display mode">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'ledger' ? 'is-active' : ''}`}
              onClick={() => setViewMode('ledger')}
            >
              {copy.indexLedger}
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              {copy.indexGrid}
            </button>
          </div>
        </div>

        {/* Dual Filter Toolbar: Category x Portfolio Pillar */}
        <div className="filter-toolbar">
          <div className="filter-group" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {lang === 'id' ? cat.idLabel : cat.en}
              </button>
            ))}
          </div>

          <div className="filter-group" role="group" aria-label="Filter by craft pillar">
            {PILLARS.map((pil) => (
              <button
                key={pil.id}
                type="button"
                className={`filter-pill filter-pill--subtle ${
                  selectedPillar === pil.id ? 'is-active' : ''
                }`}
                onClick={() => setSelectedPillar(pil.id)}
              >
                {lang === 'id' ? pil.idLabel : pil.en}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <p className="mono-meta" style={{ marginBottom: 16 }}>
              00 / 05 MATCHING COMBINATION
            </p>
            <button
              type="button"
              className="duo-btn duo-btn--solid"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPillar('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'ledger' ? (
          <div className="index-split">
            {/* Left Hairline Architectural Index */}
            <div className="index-ledger" role="list">
              {filteredProjects.map((project) => {
                const isActive = project.slug === activeProject.slug;
                return (
                  <article
                    key={project.slug}
                    role="listitem"
                    className={`index-row ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => handleActivateRow(project.slug)}
                  >
                    <span className="index-row__num tabular">{project.index}</span>

                    <div className="index-row__main">
                      <div className="index-row__top-line">
                        <h3 className="index-row__title">
                          <a
                            href={`#case/${project.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onOpenCase(project.slug);
                            }}
                            onFocus={() => handleActivateRow(project.slug)}
                          >
                            {project.title}
                          </a>
                        </h3>
                        <span className="status-badge">{project.status}</span>
                      </div>

                      <div className="index-row__meta">
                        <span>{project.categoryLabel}</span>
                        <span>·</span>
                        <span>{project.primaryStyle}</span>
                        <span className="swatch-trio" aria-hidden="true">
                          <span style={{ backgroundColor: project.tokens.ground }} />
                          <span style={{ backgroundColor: project.tokens.ink }} />
                          <span style={{ backgroundColor: project.tokens.accent }} />
                        </span>
                      </div>
                    </div>

                    <div className="index-row__actions">
                      <button
                        type="button"
                        className="duo-btn"
                        style={{ minHeight: 40, padding: '0 14px', fontSize: 12.5 }}
                        onClick={() => onOpenCase(project.slug)}
                        data-testid={`inspect-${project.slug}`}
                      >
                        <span className="duo-track">
                          <span>{copy.inspectCase}</span>
                          <span aria-hidden="true">{copy.inspectCase}</span>
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </button>

                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="row-icon-link"
                        aria-label={`Open live website for ${project.title}`}
                        title={`${copy.openLive}: ${project.liveUrl}`}
                      >
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right Pinned SILIKA CV-Reticle Specimen Viewport */}
            <aside className="specimen-stage" aria-live="polite">
              <div className="specimen-viewport">
                <img
                  key={activePlate.src}
                  src={activePlate.src}
                  alt={activePlate.alt}
                  className="specimen-viewport__img"
                  width="1440"
                  height="900"
                />

                {/* SILIKA DNA: Crisp 1px Optical CV-Tracker Bounding Overlay */}
                <div
                  className="cv-reticle"
                  style={{ '--reticle-accent': activeProject.tokens.accent }}
                  aria-hidden="true"
                >
                  <span className="cv-reticle__corner cv-reticle__corner--tl" />
                  <span className="cv-reticle__corner cv-reticle__corner--tr" />
                  <span className="cv-reticle__corner cv-reticle__corner--bl" />
                  <span className="cv-reticle__corner cv-reticle__corner--br" />

                  <div className="cv-reticle__hud-top">
                    <span>
                      LOCK · {activeProject.index}/{activeProject.shortName}
                    </span>
                    <span>{activeProject.tokens.ratio}</span>
                  </div>

                  <div className="cv-reticle__hud-bot">
                    <span>{activeProject.tokens.displayFont.toUpperCase()}</span>
                    <span>{activeProject.tokens.accent}</span>
                  </div>
                </div>
              </div>

              <div className="specimen-plate-tabs">
                <span className="mono-meta" style={{ color: activeProject.tokens.accent }}>
                  {activeProject.dnaCode}
                </span>
                <div className="specimen-plate-dots" role="group" aria-label="Switch preview plate">
                  {activeProject.plates.map((plate, idx) => (
                    <button
                      key={plate.src}
                      type="button"
                      className={`specimen-plate-dot ${
                        idx === plateIdx % activeProject.plates.length ? 'is-active' : ''
                      }`}
                      onClick={() => setPlateIdx(idx)}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <p className="specimen-summary">
                {lang === 'id' ? activePlate.captionId : activePlate.captionEn}
              </p>

              <div className="specimen-footer">
                <button
                  type="button"
                  className="duo-btn duo-btn--light"
                  onClick={() => onOpenCase(activeProject.slug)}
                >
                  <span className="duo-track">
                    <span>{copy.inspectCase}</span>
                    <span aria-hidden="true">{copy.inspectCase}</span>
                  </span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>

                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="duo-btn duo-btn--ghost-dark"
                >
                  <span>{copy.openLive}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </aside>
          </div>
        ) : (
          /* Asymmetric Editorial Grid Mode */
          <div className="asymmetric-grid">
            {filteredProjects.map((project, idx) => (
              <article
                key={project.slug}
                className={`asym-card ${
                  idx === 0 ? 'asym-card--lead' : idx === 1 ? 'asym-card--tall' : ''
                }`}
              >
                <div className="asym-card__media">
                  <img
                    src={project.plates[0].src}
                    alt={project.plates[0].alt}
                    loading="lazy"
                    width="1440"
                    height="900"
                  />
                </div>
                <div className="asym-card__body">
                  <div className="asym-card__head">
                    <h3 className="asym-card__title">
                      {project.index} · {project.title}
                    </h3>
                    <span className="status-badge">{project.status}</span>
                  </div>
                  <p className="asym-card__desc">
                    {lang === 'id' ? project.subtitleId : project.subtitleEn}
                  </p>
                  <div className="asym-card__foot">
                    <span className="mono-meta" style={{ color: 'var(--ink-muted)' }}>
                      {project.primaryStyle}
                    </span>
                    <div className="index-row__actions">
                      <button
                        type="button"
                        className="duo-btn"
                        style={{ minHeight: 38, padding: '0 14px', fontSize: 12 }}
                        onClick={() => onOpenCase(project.slug)}
                      >
                        <span>{copy.inspectCase}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </button>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="row-icon-link"
                        aria-label={`Open live app for ${project.title}`}
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

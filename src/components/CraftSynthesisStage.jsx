import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { HUB_COPY, PROJECTS } from '../data/hubData';
import CraftArtifactEmbed from './CraftArtifacts';

export default function CraftSynthesisStage({
  lang,
  activeDnaSlug,
  onSelectDna,
  onOpenCase,
}) {
  const copy = HUB_COPY[lang] || HUB_COPY.en;
  const activeProject = PROJECTS.find((p) => p.slug === activeDnaSlug) || PROJECTS[0];

  return (
    <section
      id="synthesis"
      className="darkroom-synthesis"
      data-surface-polarity="dark"
    >
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-head__eyebrow mono-meta">{copy.synthesisEyebrow}</span>
            <h2 className="section-head__title">{copy.synthesisHeading}</h2>
          </div>
          <p className="darkroom-synthesis__sub">{copy.synthesisSub}</p>
        </div>

        {/* 5-Axis Awwwards DNA Selector Rail */}
        <div className="dna-selector-rail" role="tablist" aria-label="Select Craft DNA World">
          {PROJECTS.map((project) => {
            const isSelected = project.slug === activeProject.slug;
            return (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`dna-tab-btn ${isSelected ? 'is-active' : ''}`}
                style={{ '--tab-accent': project.tokens.accent }}
                onClick={() => onSelectDna(project.slug)}
                data-testid={`dna-tab-${project.slug}`}
              >
                <span className="dna-tab-btn__top">
                  <span>{project.index}</span>
                  <span
                    className="hero-world-chip__swatch"
                    style={{ backgroundColor: project.tokens.accent }}
                    aria-hidden="true"
                  />
                </span>
                <span className="dna-tab-btn__title">{project.title}</span>
                <span className="dna-tab-btn__role">{project.primaryStyle}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Craft DNA Mixer Stage */}
        <div className="mixer-shell" role="tabpanel" aria-label={activeProject.title}>
          <div className="mixer-brief">
            <div>
              <span className="mono-meta" style={{ color: activeProject.tokens.accent }}>
                {activeProject.dnaCode}
              </span>
              <h3 className="mixer-brief__title">
                {lang === 'id' ? activeProject.dnaTitleId : activeProject.dnaTitleEn}
              </h3>
              <p className="mixer-brief__copy">
                {lang === 'id' ? activeProject.dnaSummaryId : activeProject.dnaSummaryEn}
              </p>

              <ul className="mixer-spec-list">
                <li>
                  TOKENS: {activeProject.tokens.ground} · {activeProject.tokens.ink} ·{' '}
                  {activeProject.tokens.accent}
                </li>
                <li>
                  TYPE: {activeProject.tokens.displayFont} + {activeProject.tokens.bodyFont}
                </li>
                <li>
                  WCAG: {activeProject.tokens.ratio} · STATUS: {activeProject.status.toUpperCase()}
                </li>
              </ul>
            </div>

            <div className="mixer-actions">
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
          </div>

          {/* Live Working Interactive Micro-Artifact for the Selected World */}
          <CraftArtifactEmbed slug={activeProject.slug} />
        </div>
      </div>
    </section>
  );
}

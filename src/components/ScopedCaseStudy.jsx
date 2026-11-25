import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Github } from 'lucide-react';
import { HUB_COPY, PROJECTS } from '../data/hubData';
import CraftArtifactEmbed from './CraftArtifacts';

export default function ScopedCaseStudy({
  project,
  lang,
  onBackHome,
  onOpenCase,
}) {
  const [copiedHex, setCopiedHex] = useState(null);
  const copy = HUB_COPY[lang] || HUB_COPY.en;

  const currentIdx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  const handleCopyHex = (hex) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1600);
  };

  const swatchTokens = [
    { role: 'Ground', hex: project.tokens.ground },
    { role: 'Surface', hex: project.tokens.surface },
    { role: 'Primary Ink', hex: project.tokens.ink },
    { role: 'Signal Accent', hex: project.tokens.accent },
  ];

  return (
    <article
      className="scoped-case-world"
      data-project-theme={project.slug}
      data-surface-polarity={project.tokens.polarity === 'light' ? 'light' : 'dark'}
    >
      <div className="container">
        {/* Persistent Minimal Host Shell Orientation Bar */}
        <div className="case-host-bar">
          <div className="case-host-bar__inner">
            <button
              type="button"
              className="case-host-btn"
              onClick={onBackHome}
              data-testid="case-back-btn"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>{copy.backToIndex}</span>
            </button>

            <span className="mono-meta" style={{ opacity: 0.78 }}>
              {project.index} / 05 · {project.shortName} WORLD
            </span>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="case-host-btn case-host-btn--accent"
              >
                <span>{copy.visitLive}</span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>

              <button
                type="button"
                className="case-host-btn"
                onClick={() => onOpenCase(nextProject.slug)}
                data-testid="case-next-btn"
              >
                <span>
                  {copy.nextCase}: {nextProject.index}
                </span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Layer 1: 30-Second Recruiter Executive Header */}
        <header className="case-hero-grid">
          <div>
            <span className="status-badge" style={{ borderColor: 'var(--case-hairline)' }}>
              {project.status} · {project.year}
            </span>
            <h1 id="case-heading" tabIndex={-1} className="case-title">
              {project.title}
            </h1>
            <p className="case-subtitle">
              {lang === 'id' ? project.subtitleId : project.subtitleEn}
            </p>
          </div>

          <div className="case-summary-card">
            <span className="mono-meta" style={{ color: 'var(--case-accent)' }}>
              {copy.recruiterLabel}
            </span>
            <p className="case-summary-card__text">
              {lang === 'id' ? project.recruiterSummaryId : project.recruiterSummaryEn}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="case-host-btn case-host-btn--accent"
              >
                <span>{copy.visitLive}</span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="case-host-btn"
              >
                <Github size={13} aria-hidden="true" />
                <span>{copy.viewCode}</span>
              </a>
            </div>
          </div>
        </header>

        <div className="case-meta-strip">
          <div className="case-meta-cell">
            <small>Category</small>
            <strong>{project.categoryLabel}</strong>
          </div>
          <div className="case-meta-cell">
            <small>Style Archetype</small>
            <strong>{project.primaryStyle}</strong>
          </div>
          <div className="case-meta-cell">
            <small>Role & Effort</small>
            <strong>
              {lang === 'id' ? project.roleId : project.roleEn} ({project.hours})
            </strong>
          </div>
          <div className="case-meta-cell">
            <small>Stack</small>
            <strong>{project.stack.join(' · ')}</strong>
          </div>
        </div>

        <nav className="case-jump-bar" aria-label="Case study sections">
          <a href="#case-plates" className="case-jump-link">
            01 Plates
          </a>
          <a href="#case-problem" className="case-jump-link">
            02 Problem & DNA Firewall
          </a>
          <a href="#case-tradeoffs" className="case-jump-link">
            03 Decisions & Trade-Offs
          </a>
          <a href="#case-artifact" className="case-jump-link">
            04 Live Artifact
          </a>
          <a href="#case-tokens" className="case-jump-link">
            05 Scoped Tokens & Validation
          </a>
        </nav>

        {/* Annotated Visual Plates (Real Production Captures) */}
        <section id="case-plates" className="case-section">
          <figure className="case-plate-figure">
            <img
              src={project.plates[0].src}
              alt={project.plates[0].alt}
              width="1440"
              height="900"
            />
            <figcaption>
              {lang === 'id' ? project.plates[0].captionId : project.plates[0].captionEn}
            </figcaption>
          </figure>

          <div className="case-plates-pair">
            {project.plates.slice(1).map((plate) => (
              <figure key={plate.src} className="case-plate-figure">
                <img
                  src={plate.src}
                  alt={plate.alt}
                  loading="lazy"
                  width="1440"
                  height="900"
                />
                <figcaption>{lang === 'id' ? plate.captionId : plate.captionEn}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Problem & Forensic Style DNA Firewall */}
        <section id="case-problem" className="case-section">
          <span className="case-section__label">
            {copy.problemLabel} · {project.evidenceTag}
          </span>
          <p className="case-problem-lead">
            {lang === 'id' ? project.problemId : project.problemEn}
          </p>

          <div style={{ marginTop: 32 }}>
            <span className="case-section__label">{copy.firewallLabel}</span>
            <div className="case-three-col">
              <div className="case-card">
                <h3>Principles Adapted</h3>
                <ul>
                  {project.dnaFirewall.principles.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="case-card">
                <h3>Forbidden to Copy</h3>
                <ul>
                  {project.dnaFirewall.forbidden.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="case-card">
                <h3>Mandatory Divergence</h3>
                <p>{project.dnaFirewall.divergence}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Decisions, Trade-offs & Rejected Options */}
        <section id="case-tradeoffs" className="case-section">
          <span className="case-section__label">{copy.tradeOffLabel}</span>
          <div className="case-two-col">
            {project.tradeOffs.map((t) => (
              <div key={t.decision} className="case-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span className="mono-meta" style={{ color: 'var(--case-accent)' }}>
                    {t.evidence}
                  </span>
                </div>
                <h3>{t.decision}</h3>
                <div className="tradeoff-kv">
                  <p>
                    <strong>Alternative rejected:</strong> {t.alternative}
                  </p>
                  <p>
                    <strong>Reason:</strong> {t.reason}
                  </p>
                  <p>
                    <strong>Trade-off accepted:</strong> {t.tradeOff}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <span className="case-section__label">{copy.rejectedLabel}</span>
            <div className="case-two-col">
              {project.rejectedOptions.map((opt) => (
                <div key={opt.title} className="case-card">
                  <h3>{opt.title}</h3>
                  <p>{opt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Interactive Artifact Embed */}
        <section id="case-artifact" className="case-section">
          <span className="case-section__label">{copy.artifactLabel}</span>
          <CraftArtifactEmbed slug={project.slug} />
        </section>

        {/* Scoped Token Specimen & Honest Validation */}
        <section id="case-tokens" className="case-section" style={{ borderBottom: 0 }}>
          <span className="case-section__label">{copy.tokenLabel}</span>
          <div className="token-swatches-grid" style={{ marginBottom: 32 }}>
            {swatchTokens.map((sw) => (
              <button
                key={sw.role}
                type="button"
                className="token-swatch-btn"
                onClick={() => handleCopyHex(sw.hex)}
              >
                <span
                  className="token-swatch-chip"
                  style={{ backgroundColor: sw.hex }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="mono-meta" style={{ opacity: 0.72 }}>
                      {sw.role}
                    </div>
                    <strong className="tabular">{sw.hex}</strong>
                  </div>
                  {copiedHex === sw.hex ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    <Copy size={14} aria-hidden="true" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <span className="case-section__label">{copy.validationLabel}</span>
          <div className="case-two-col">
            <div className="case-card">
              <h3>Validation Status & Protocol</h3>
              <p>{lang === 'id' ? project.validationPlanId : project.validationPlanEn}</p>
            </div>
            <div className="case-card">
              <h3>Process Reflection</h3>
              <p>{lang === 'id' ? project.reflectionId : project.reflectionEn}</p>
            </div>
          </div>

          {/* Next Scoped World Handoff */}
          <div className="case-next-footer">
            <div>
              <span className="mono-meta" style={{ color: 'var(--case-muted)' }}>
                {copy.nextCase} ({nextProject.index} / 05)
              </span>
              <h2 className="case-next-footer__title">{nextProject.title}</h2>
            </div>

            <button
              type="button"
              className="case-host-btn case-host-btn--accent"
              onClick={() => onOpenCase(nextProject.slug)}
            >
              <span>Enter {nextProject.shortName} World</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}

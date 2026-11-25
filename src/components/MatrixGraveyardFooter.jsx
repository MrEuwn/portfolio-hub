import { useState } from 'react';
import { ArrowUpRight, Check, Copy, ExternalLink, Github } from 'lucide-react';
import { GRAVEYARD_ITEMS, HUB_COPY, PROJECTS, STUDIO_PROFILE } from '../data/hubData';

export default function MatrixGraveyardFooter({
  lang,
  onOpenCase,
  onOpenBrief,
}) {
  const [copied, setCopied] = useState(false);
  const copy = HUB_COPY[lang] || HUB_COPY.en;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(STUDIO_PROFILE.email).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <section id="matrix" className="matrix-section" data-surface-polarity="light">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-head__eyebrow mono-meta">{copy.matrixEyebrow}</span>
              <h2 className="section-head__title">{copy.matrixHeading}</h2>
            </div>
            <span className="mono-meta" style={{ color: 'var(--ink-muted)' }}>
              AUDIT: 5 CATEGORIES · 5 STYLES · 4 PILLARS PASS
            </span>
          </div>

          <div className="matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>World</th>
                  <th>Category</th>
                  <th>Primary Style</th>
                  <th>Pillars</th>
                  <th>Typography</th>
                  <th>Status</th>
                  <th>Live</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.slug}>
                    <td className="mono-meta">{p.index}</td>
                    <td>
                      <button
                        type="button"
                        style={{
                          border: 0,
                          padding: 0,
                          background: 'transparent',
                          fontWeight: 600,
                          textDecoration: 'underline',
                        }}
                        onClick={() => onOpenCase(p.slug)}
                      >
                        {p.title}
                      </button>
                    </td>
                    <td>{p.categoryLabel}</td>
                    <td>{p.primaryStyle}</td>
                    <td className="mono-meta">{p.pillars.join(' + ')}</td>
                    <td>
                      {p.tokens.displayFont} + {p.tokens.bodyFont}
                    </td>
                    <td>
                      <span className="status-badge">{p.status}</span>
                    </td>
                    <td>
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${p.title} live site`}
                      >
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <span className="section-head__eyebrow mono-meta">{copy.graveyardTitle}</span>
            <div className="graveyard-grid">
              {GRAVEYARD_ITEMS.map((item) => (
                <article key={item.code} className="graveyard-card">
                  <span className="mono-meta" style={{ color: 'var(--accent-signal)' }}>
                    {item.code} · REJECTED
                  </span>
                  <h3 className="graveyard-card__title">{item.idea}</h3>
                  <p className="graveyard-card__reason">
                    {lang === 'id' ? item.reasonId : item.reasonEn}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="hub-footer" data-surface-polarity="dark">
        <div className="container">
          <div className="hub-footer__top">
            <h2 className="hub-footer__headline">{copy.footerHeadline}</h2>

            <div className="hub-footer__cta-col">
              <p className="hub-footer__sub">{copy.footerSub}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="button"
                  className="duo-btn duo-btn--light"
                  onClick={onOpenBrief}
                >
                  <span className="duo-track">
                    <span>{copy.footerCta}</span>
                    <span aria-hidden="true">{copy.footerCta}</span>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="duo-btn duo-btn--ghost-dark"
                  onClick={handleCopyEmail}
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copied ? copy.copiedEmail : copy.copyEmail}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="hub-footer__links-row">
            {PROJECTS.map((p) => (
              <a
                key={p.slug}
                href={p.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-world-link"
              >
                <span className="mono-meta" style={{ color: p.tokens.accent }}>
                  {p.index} · {p.shortName}
                </span>
                <strong>{p.title}</strong>
                <span className="mono-meta" style={{ opacity: 0.65 }}>
                  {p.liveUrl.replace('https://', '')} ↗
                </span>
              </a>
            ))}
          </div>

          <div className="hub-footer__bottom">
            <span>
              ©2026 {STUDIO_PROFILE.brand} · {STUDIO_PROFILE.subBrand} ({STUDIO_PROFILE.handle})
            </span>
            <span>{STUDIO_PROFILE.location}</span>
            <a
              href={STUDIO_PROFILE.githubProfile}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Github size={14} aria-hidden="true" />
              <span>github.com/{STUDIO_PROFILE.handle}</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

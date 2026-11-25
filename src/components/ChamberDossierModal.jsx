import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Github, X } from 'lucide-react';
import CraftArtifactEmbed from './CraftArtifacts';

export default function ChamberDossierModal({
  project,
  lang,
  onClose,
  onOpenFullCase,
}) {
  const dialogRef = useRef(null);
  const [plateIdx, setPlateIdx] = useState(0);

  useEffect(() => {
    setPlateIdx(0);
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;
    const prev = document.activeElement;
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  const activePlate = project.plates[plateIdx % project.plates.length];

  return (
    <div
      className="chamber-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="chamber-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chamber-modal-title"
        tabIndex={-1}
        data-testid="chamber-dossier-modal"
      >
        <header className="chamber-modal__head">
          <div>
            <span className="mono-meta" style={{ color: project.tokens.accent }}>
              CHAMBER {project.index} // {project.dnaCode} · {project.status.toUpperCase()}
            </span>
            <h2 id="chamber-modal-title" className="chamber-modal__title">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            className="igloo-hud-chip"
            onClick={onClose}
            aria-label="Close chamber inspection"
          >
            <X size={14} aria-hidden="true" />
            <span>ESC</span>
          </button>
        </header>

        <div className="chamber-modal__grid">
          <div className="chamber-modal__left">
            <div className="chamber-modal__plate">
              <img src={activePlate.src} alt={activePlate.alt} width="1440" height="900" />
            </div>

            <div className="chamber-modal__plate-bar">
              <div style={{ display: 'flex', gap: 6 }}>
                {project.plates.map((pl, idx) => (
                  <button
                    key={pl.src}
                    type="button"
                    className={`igloo-mini-btn ${idx === plateIdx ? 'is-active' : ''}`}
                    onClick={() => setPlateIdx(idx)}
                  >
                    PLATE 0{idx + 1}
                  </button>
                ))}
              </div>
              <span className="mono-meta" style={{ opacity: 0.75 }}>
                {project.tokens.displayFont}
              </span>
            </div>

            <p className="chamber-modal__caption">
              {lang === 'id' ? activePlate.captionId : activePlate.captionEn}
            </p>

            <p className="chamber-modal__summary">
              {lang === 'id' ? project.recruiterSummaryId : project.recruiterSummaryEn}
            </p>

            <div className="chamber-modal__actions">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="igloo-glow-plaque"
                style={{ textDecoration: 'none' }}
              >
                <span>LAUNCH LIVE WORLD</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>

              <button
                type="button"
                className="igloo-hud-chip igloo-hud-chip--light"
                onClick={() => {
                  onClose();
                  onOpenFullCase(project.slug);
                }}
              >
                <span>SCOPED CASE STUDY</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="igloo-hud-chip"
              >
                <Github size={14} aria-hidden="true" />
                <span>REPO</span>
              </a>
            </div>
          </div>

          <div className="chamber-modal__right">
            <CraftArtifactEmbed slug={project.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

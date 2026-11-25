import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PROJECTS } from '../data/hubData';

export default function LiveWorldDock({
  activeSlug,
  onSelectWorld,
  onOpenCase,
  hidden = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const active = PROJECTS.find((p) => p.slug === activeSlug) || PROJECTS[0];

  return (
    <aside
      className={`live-world-dock ${expanded ? 'live-world-dock--expanded' : ''} ${
        hidden ? 'live-world-dock--hidden' : ''
      }`}
      aria-label="Live Five-World Cue Switcher"
    >
      {expanded && (
        <>
          <button
            type="button"
            className="live-world-dock__thumb-btn"
            onClick={() => onOpenCase(active.slug)}
            aria-label={`Inspect ${active.title} case study`}
          >
            <img src={active.plates[0].src} alt={active.plates[0].alt} />
            <span className="live-world-dock__thumb-label">{active.title}</span>
          </button>

          <div className="live-world-dock__foot">
            <div className="live-world-dock__pips" role="group" aria-label="Select featured world">
              {PROJECTS.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  className={`live-world-dock__pip ${
                    project.slug === active.slug ? 'is-active' : ''
                  }`}
                  style={{ backgroundColor: project.tokens.accent }}
                  aria-label={`Highlight ${project.title}`}
                  aria-pressed={project.slug === active.slug}
                  onClick={() => onSelectWorld(project.slug)}
                />
              ))}
            </div>

            <a
              href={active.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="live-world-dock__link"
            >
              Live ↗
            </a>
          </div>
        </>
      )}

      <button
        type="button"
        className="live-world-dock__toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className="live-world-dock__status">
          <span
            className="live-world-dock__pulse"
            style={{ backgroundColor: active.tokens.accent }}
            aria-hidden="true"
          />
          <span>
            {active.index} · {active.shortName}
          </span>
        </span>
        {expanded ? (
          <ChevronDown size={14} aria-hidden="true" />
        ) : (
          <ChevronUp size={14} aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}

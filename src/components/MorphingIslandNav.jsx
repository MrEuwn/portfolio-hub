import { ArrowUpRight, Menu, X } from 'lucide-react';
import { HUB_COPY, PROJECTS, STUDIO_PROFILE } from '../data/hubData';

export default function MorphingIslandNav({
  lang,
  onToggleLang,
  isDarkSurface,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenCase,
  onGoHome,
  onOpenBrief,
}) {
  const copy = HUB_COPY[lang] || HUB_COPY.en;

  const jumpToSection = (sectionId) => {
    onCloseMenu();
    onGoHome(sectionId);
  };

  return (
    <header className="island-nav-wrap">
      <nav
        className={`island-nav ${isDarkSurface ? 'island-nav--dark' : ''}`}
        aria-label="Primary portfolio navigation"
      >
        <div className="island-nav__group">
          <button
            type="button"
            className="island-nav__pill-btn"
            aria-expanded={menuOpen}
            aria-controls="hub-bento-sheet"
            onClick={onToggleMenu}
            data-testid="island-menu-btn"
          >
            {menuOpen ? <X size={14} aria-hidden="true" /> : <Menu size={14} aria-hidden="true" />}
            <span>{menuOpen ? copy.navClose : copy.navMenu}</span>
          </button>

          <button
            type="button"
            className="island-nav__lang-btn"
            onClick={onToggleLang}
            aria-label={lang === 'en' ? 'Switch language to Indonesian' : 'Ganti bahasa ke Inggris'}
            data-testid="lang-toggle-btn"
          >
            {lang === 'en' ? 'ID' : 'EN'}
          </button>
        </div>

        <a
          href="#/"
          className="island-nav__brand"
          onClick={(e) => {
            e.preventDefault();
            onCloseMenu();
            onGoHome();
          }}
        >
          <span>{STUDIO_PROFILE.brand}</span>
          <span className="island-nav__brand-serif">{STUDIO_PROFILE.subBrand}</span>
        </a>

        <div className="island-nav__group">
          <button
            type="button"
            className="island-nav__pill-btn"
            onClick={() => {
              onCloseMenu();
              onOpenBrief();
            }}
            data-testid="open-brief-btn"
          >
            <span>{copy.navBrief}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="hub-bento-sheet"
          className="island-sheet"
          role="region"
          aria-label="Five Worlds Quick Directory"
        >
          <div>
            <p className="island-sheet__title mono-meta">05 SCOPED AWWWARDS WORLDS</p>
            <div className="island-sheet__worlds">
              {PROJECTS.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  className="island-sheet__world-btn"
                  onClick={() => {
                    onCloseMenu();
                    onOpenCase(project.slug);
                  }}
                >
                  <span className="island-sheet__world-left">
                    <span
                      className="island-sheet__dot"
                      style={{ backgroundColor: project.tokens.accent }}
                      aria-hidden="true"
                    />
                    <span className="mono-meta">{project.index}</span>
                    <span className="island-sheet__world-name">{project.title}</span>
                  </span>
                  <span className="mono-meta">{project.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="island-sheet__nav-links">
            <div>
              <p className="island-sheet__title mono-meta">HUB SECTIONS</p>
              <div className="island-sheet__anchors">
                <button
                  type="button"
                  className="island-sheet__anchor"
                  style={{ background: 'transparent', borderWidth: '0 0 1px 0', width: '100%' }}
                  onClick={() => jumpToSection('index')}
                >
                  <span>01 · Curatorial Index</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="island-sheet__anchor"
                  style={{ background: 'transparent', borderWidth: '0 0 1px 0', width: '100%' }}
                  onClick={() => jumpToSection('synthesis')}
                >
                  <span>02 · Craft DNA Mixer</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="island-sheet__anchor"
                  style={{ background: 'transparent', borderWidth: '0 0 1px 0', width: '100%' }}
                  onClick={() => jumpToSection('matrix')}
                >
                  <span>03 · Diversity & Graveyard</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mono-meta" style={{ opacity: 0.72, marginTop: 14 }}>
              {STUDIO_PROFILE.location}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

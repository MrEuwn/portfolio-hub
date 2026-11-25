import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { PROJECTS } from './data/hubData';
import MonogramLoader from './components/MonogramLoader';
import MorphingIslandNav from './components/MorphingIslandNav';
import LiveWorldDock from './components/LiveWorldDock';
import GalleryHero from './components/GalleryHero';
import CuratorialIndex from './components/CuratorialIndex';
import CraftSynthesisStage from './components/CraftSynthesisStage';
import MatrixGraveyardFooter from './components/MatrixGraveyardFooter';
import ScopedCaseStudy from './components/ScopedCaseStudy';
import BriefModal from './components/BriefModal';

function parseCaseFromHash() {
  const hash = window.location.hash || '';
  const match = hash.match(/^#case\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const slug = match[1].toLowerCase();
  return PROJECTS.some((p) => p.slug === slug) ? slug : null;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [loaderDone, setLoaderDone] = useState(false);
  const [activeWorldSlug, setActiveWorldSlug] = useState(PROJECTS[0].slug);
  const [activeDnaSlug, setActiveDnaSlug] = useState(PROJECTS[0].slug);
  const [activeCaseSlug, setActiveCaseSlug] = useState(() => parseCaseFromHash());
  const [isDarkNav, setIsDarkNav] = useState(false);
  const [dockHidden, setDockHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  // Smooth inertia scroll via Lenis (respects prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Sync browser back/forward navigation with #case/<slug>
  useEffect(() => {
    const onHashChange = () => {
      const nextCase = parseCaseFromHash();
      setActiveCaseSlug(nextCase);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Track nav polarity & hide LiveWorldDock cleanly near footer
  useEffect(() => {
    const updateSurface = () => {
      if (activeCaseSlug) {
        const proj = PROJECTS.find((p) => p.slug === activeCaseSlug);
        setIsDarkNav(proj ? proj.tokens.polarity !== 'light' : false);
        setDockHidden(true);
        return;
      }

      const probeY = 48;
      const surfaces = Array.from(document.querySelectorAll('[data-surface-polarity]'));
      for (let i = surfaces.length - 1; i >= 0; i--) {
        const rect = surfaces[i].getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          setIsDarkNav(surfaces[i].getAttribute('data-surface-polarity') === 'dark');
          break;
        }
      }

      const footerEl = document.getElementById('contact');
      const nearFooter = footerEl ? footerEl.getBoundingClientRect().top < window.innerHeight - 80 : false;
      setDockHidden(window.scrollY < 260 || nearFooter);
    };

    window.addEventListener('scroll', updateSurface, { passive: true });
    window.addEventListener('resize', updateSurface, { passive: true });
    updateSurface();

    return () => {
      window.removeEventListener('scroll', updateSurface);
      window.removeEventListener('resize', updateSurface);
    };
  }, [activeCaseSlug]);

  const runTransition = useCallback((updateFn, focusSelector) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const afterUpdate = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.requestAnimationFrame(() => {
        const target = document.querySelector(focusSelector);
        if (target instanceof HTMLElement) target.focus({ preventScroll: true });
      });
    };

    if (!reduced && typeof document.startViewTransition === 'function') {
      const vt = document.startViewTransition(() => {
        updateFn();
      });
      vt.finished.then(afterUpdate).catch(afterUpdate);
    } else {
      updateFn();
      afterUpdate();
    }
  }, []);

  const openCase = useCallback(
    (slug) => {
      setActiveWorldSlug(slug);
      setActiveDnaSlug(slug);
      runTransition(() => {
        window.history.pushState(null, '', `#case/${slug}`);
        setActiveCaseSlug(slug);
      }, '#case-heading');
    },
    [runTransition]
  );

  const goHome = useCallback(
    (scrollToId = null) => {
      if (activeCaseSlug) {
        runTransition(() => {
          window.history.pushState(null, '', '#/');
          setActiveCaseSlug(null);
        }, '#main-content');
        if (scrollToId) {
          window.setTimeout(() => {
            document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
          }, 480);
        }
      } else if (scrollToId) {
        document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [activeCaseSlug, runTransition]
  );

  const activeCaseProject = activeCaseSlug
    ? PROJECTS.find((p) => p.slug === activeCaseSlug) || null
    : null;

  return (
    <div className="hub-app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <MonogramLoader onComplete={() => setLoaderDone(true)} />

      <MorphingIslandNav
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'id' : 'en'))}
        isDarkSurface={isDarkNav}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMenuOpen(false)}
        onOpenCase={openCase}
        onGoHome={goHome}
        onOpenBrief={() => setBriefOpen(true)}
      />

      <main id="main-content" tabIndex={-1}>
        {activeCaseProject ? (
          <ScopedCaseStudy
            project={activeCaseProject}
            lang={lang}
            onBackHome={() => goHome()}
            onOpenCase={openCase}
          />
        ) : (
          <>
            <GalleryHero
              lang={lang}
              ready={loaderDone}
              activeWorldSlug={activeWorldSlug}
              onSelectWorld={setActiveWorldSlug}
              onScrollToSection={(id) =>
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }
            />

            <CuratorialIndex
              lang={lang}
              activeWorldSlug={activeWorldSlug}
              onSelectWorld={setActiveWorldSlug}
              onOpenCase={openCase}
            />

            <CraftSynthesisStage
              lang={lang}
              activeDnaSlug={activeDnaSlug}
              onSelectDna={setActiveDnaSlug}
              onOpenCase={openCase}
            />

            <MatrixGraveyardFooter
              lang={lang}
              onOpenCase={openCase}
              onOpenBrief={() => setBriefOpen(true)}
            />
          </>
        )}
      </main>

      <LiveWorldDock
        activeSlug={activeWorldSlug}
        onSelectWorld={setActiveWorldSlug}
        onOpenCase={openCase}
        hidden={dockHidden || Boolean(activeCaseProject)}
      />

      <BriefModal open={briefOpen} lang={lang} onClose={() => setBriefOpen(false)} />
    </div>
  );
}

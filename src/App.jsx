import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS } from './data/hubData';
import ObservatoryExperience from './webgl/ObservatoryExperience';
import IglooHudOverlay from './components/IglooHudOverlay';
import ChamberDossierModal from './components/ChamberDossierModal';
import ScopedCaseStudy from './components/ScopedCaseStudy';
import BriefModal from './components/BriefModal';
import { soundEngine } from './utils/soundEngine';

function parseCaseFromHash() {
  const hash = window.location.hash || '';
  const match = hash.match(/^#case\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const slug = match[1].toLowerCase();
  return PROJECTS.some((p) => p.slug === slug) ? slug : null;
}

function mod1(n) {
  return ((n % 1) + 1) % 1;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loopPct, setLoopPct] = useState(0);
  const [stage, setStage] = useState({ mode: 'loading', projectIdx: -1 });
  const [hoverTriangle, setHoverTriangle] = useState(null);
  const [cadPoints, setCadPoints] = useState([]);
  const [soundOn, setSoundOn] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [inspectSlug, setInspectSlug] = useState(null);
  const [activeCaseSlug, setActiveCaseSlug] = useState(() => parseCaseFromHash());
  const [briefOpen, setBriefOpen] = useState(false);

  // Unbounded continuous target & smoothed progress wrapped mod 1 for true infinite loop!
  const rawTargetRef = useRef(0);
  const rawCurrentRef = useRef(0);
  const wrappedProgressRef = useRef(0);

  // Beat 0: Isometric 3D Wireframe CAD Preloader (0 -> 100% in ~1.45s, instant under reduced motion)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLoadProgress(1);
      return undefined;
    }

    const duration = 1450;
    const start = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 2.4);
      setLoadProgress(eased);
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Sync #case/<slug> hash navigation
  useEffect(() => {
    const onHash = () => setActiveCaseSlug(parseCaseFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Bidirectional Virtual Wheel + Touch Drag + Keyboard Infinite Scroll Engine
  useEffect(() => {
    if (activeCaseSlug) return undefined;

    const isOverlayOpen = () => Boolean(inspectSlug || briefOpen);

    const onWheel = (e) => {
      if (isOverlayOpen()) return;
      e.preventDefault();
      const delta = Math.max(-160, Math.min(160, e.deltaY));
      rawTargetRef.current += delta * 0.00026;
    };

    let touchY = null;
    const onTouchStart = (e) => {
      if (isOverlayOpen() || e.touches.length !== 1) return;
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (isOverlayOpen() || touchY === null || e.touches.length !== 1) return;
      const curY = e.touches[0].clientY;
      const dy = touchY - curY;
      touchY = curY;
      rawTargetRef.current += dy * 0.0011;
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    const onKeyDown = (e) => {
      if (isOverlayOpen()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        rawTargetRef.current += 0.055;
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        rawTargetRef.current -= 0.055;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Expose deterministic helper for automated QA & smooth checkpoint jumps
    window.__setObservatoryProgress = (targetWrapped) => {
      rawTargetRef.current = targetWrapped;
      rawCurrentRef.current = targetWrapped;
      wrappedProgressRef.current = mod1(targetWrapped);
      setLoopPct(Math.round(wrappedProgressRef.current * 100));
    };

    let rafId = 0;
    let lastTime = performance.now();
    let lastPct = -1;

    const smoothLoop = (now) => {
      rafId = window.requestAnimationFrame(smoothLoop);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const alpha = 1 - Math.exp(-dt * 6.8);
      rawCurrentRef.current += (rawTargetRef.current - rawCurrentRef.current) * alpha;
      const wrapped = mod1(rawCurrentRef.current);
      wrappedProgressRef.current = wrapped;

      const pct = Math.round(wrapped * 100) % 100;
      if (pct !== lastPct) {
        lastPct = pct;
        setLoopPct(pct);
      }
    };

    rafId = window.requestAnimationFrame(smoothLoop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCaseSlug, inspectSlug, briefOpen]);

  // Smooth shortest-arc jump around the [0, 1) circle
  const jumpToProgress = useCallback((destWrapped) => {
    const curWrapped = mod1(rawTargetRef.current);
    let diff = mod1(destWrapped) - curWrapped;
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;
    rawTargetRef.current += diff;
    soundEngine.ping(580);
  }, []);

  const stepChamber = useCallback(
    (dir) => {
      const curIdx = stage.projectIdx >= 0 ? stage.projectIdx : 0;
      const nextIdx = (curIdx + dir + PROJECTS.length) % PROJECTS.length;
      jumpToProgress(0.32 + nextIdx * 0.104);
    },
    [stage.projectIdx, jumpToProgress]
  );

  const openFullCase = useCallback((slug) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => {
      window.history.pushState(null, '', `#case/${slug}`);
      setActiveCaseSlug(slug);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (!reduced && typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }, []);

  const closeFullCase = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => {
      window.history.pushState(null, '', '#/');
      setActiveCaseSlug(null);
    };
    if (!reduced && typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }, []);

  const activeCaseProject = activeCaseSlug
    ? PROJECTS.find((p) => p.slug === activeCaseSlug) || null
    : null;

  const inspectProject = inspectSlug
    ? PROJECTS.find((p) => p.slug === inspectSlug) || null
    : null;

  if (activeCaseProject) {
    return (
      <main id="main-content">
        <ScopedCaseStudy
          project={activeCaseProject}
          lang={lang}
          onBackHome={closeFullCase}
          onOpenCase={openFullCase}
        />
      </main>
    );
  }

  return (
    <main id="main-content" className="igloo-viewport-shell">
      <ObservatoryExperience
        scrollProgressRef={wrappedProgressRef}
        loadProgress={loadProgress}
        onHoverTriangleChange={setHoverTriangle}
        onProjectedCadChange={setCadPoints}
        onActiveStageChange={(nextStage) => {
          setStage(nextStage);
          if (nextStage.mode === 'chamber') soundEngine.ping(480 + nextStage.projectIdx * 70);
        }}
        onSelectProject={(slug) => setInspectSlug(slug)}
        modalOpen={Boolean(inspectProject || briefOpen)}
      />

      <IglooHudOverlay
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'id' : 'en'))}
        loadProgress={loadProgress}
        loopPct={loopPct}
        stage={stage}
        hoverTriangle={hoverTriangle}
        cadPoints={cadPoints}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(soundEngine.toggle())}
        indexOpen={indexOpen}
        onToggleIndex={() => setIndexOpen((prev) => !prev)}
        onJumpToProgress={jumpToProgress}
        onStepChamber={stepChamber}
        onInspectProject={(slug) => setInspectSlug(slug)}
        onOpenFullCase={openFullCase}
        onOpenBrief={() => setBriefOpen(true)}
      />

      <ChamberDossierModal
        project={inspectProject}
        lang={lang}
        onClose={() => setInspectSlug(null)}
        onOpenFullCase={openFullCase}
      />

      <BriefModal open={briefOpen} lang={lang} onClose={() => setBriefOpen(false)} />
    </main>
  );
}

import { useEffect, useRef, useState } from 'react';

export default function MonogramLoader({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setGone(true);
      onCompleteRef.current?.();
      return undefined;
    }

    const durationMs = 680;
    const start = performance.now();
    let rafId = 0;
    let unmountTimer = 0;

    const tick = (now) => {
      // Strictly clamped [0, 1] so frame 1 never produces negative percentage
      const progress = Math.max(0, Math.min(1, (now - start) / durationMs));
      const eased = 1 - Math.pow(1 - progress, 3);
      setPct(Math.round(eased * 100));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setExiting(true);
        onCompleteRef.current?.();
        unmountTimer = window.setTimeout(() => setGone(true), 560);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`monogram-loader ${exiting ? 'monogram-loader--exiting' : ''}`}
      data-testid="monogram-loader"
      aria-hidden="true"
    >
      <div className="monogram-loader__counter">{String(pct).padStart(3, '0')}%</div>
      <div className="monogram-loader__bar">
        <div
          className="monogram-loader__fill"
          style={{ transform: `scaleX(${Math.max(0.02, pct / 100)})` }}
        />
      </div>
      <div className="monogram-loader__meta mono-meta">
        <span>PRAFASTA · MONOGRAPH</span>
        <span>·</span>
        <span>05 AWWWARDS WORLDS</span>
      </div>
    </div>
  );
}

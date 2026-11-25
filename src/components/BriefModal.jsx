import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { PROJECTS, STUDIO_PROFILE } from '../data/hubData';

export default function BriefModal({ open, lang, onClose }) {
  const dialogRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    referenceWorld: PROJECTS[0].slug,
    scope: '',
  });

  useEffect(() => {
    if (!open) return undefined;
    const prevActive = document.activeElement;
    dialogRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (prevActive instanceof HTMLElement) prevActive.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="brief-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="brief-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-dialog-title"
        tabIndex={-1}
      >
        <div className="brief-dialog__head">
          <div>
            <span className="mono-meta" style={{ color: 'var(--ink-muted)' }}>
              DIRECT COMMISSION · {STUDIO_PROFILE.email}
            </span>
            <h2 id="brief-dialog-title" className="brief-dialog__title">
              {lang === 'id' ? 'Mulai Brief Proyek' : 'Start a Project Brief'}
            </h2>
          </div>
          <button
            type="button"
            className="row-icon-link"
            onClick={onClose}
            aria-label="Close brief modal"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="brief-success">
            <p className="mono-meta" style={{ marginBottom: 8 }}>
              BRIEF PREPARED LOCALLY · NO SERVER SUBMISSION REQUIRED
            </p>
            <p style={{ margin: '0 0 14px' }}>
              {lang === 'id'
                ? `Ringkasan brief untuk ${form.name || 'tim Anda'} siap dikirim langsung ke ${STUDIO_PROFILE.email}.`
                : `Your brief summary for ${form.name || 'your team'} is ready to send directly to ${STUDIO_PROFILE.email}.`}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={`mailto:${STUDIO_PROFILE.email}?subject=${encodeURIComponent(
                  `Project Brief (${form.referenceWorld}) from ${form.name || 'Visitor'}`
                )}&body=${encodeURIComponent(form.scope)}`}
                className="duo-btn duo-btn--solid"
              >
                Open Mail Client ↗
              </a>
              <button
                type="button"
                className="duo-btn"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form className="brief-form" onSubmit={handleSubmit}>
            <label className="brief-field">
              <span className="mono-meta">Name / Studio</span>
              <input
                type="text"
                required
                placeholder="e.g. Nadia Pratama · Studio Utara"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label className="brief-field">
              <span className="mono-meta">Email</span>
              <input
                type="email"
                required
                placeholder="you@studio.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="brief-field">
              <span className="mono-meta">Closest Craft Reference World</span>
              <select
                value={form.referenceWorld}
                onChange={(e) => setForm({ ...form, referenceWorld: e.target.value })}
              >
                {PROJECTS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.index} · {p.title} ({p.primaryStyle})
                  </option>
                ))}
              </select>
            </label>

            <label className="brief-field">
              <span className="mono-meta">Project Scope & Timeline</span>
              <textarea
                rows={4}
                required
                placeholder="Product goal, target launch window, and key interactive requirement..."
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
              />
            </label>

            <button type="submit" className="duo-btn duo-btn--solid" style={{ alignSelf: 'flex-start' }}>
              <span>{lang === 'id' ? 'Siapkan Brief' : 'Prepare Brief'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

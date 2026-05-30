/**
 * app/cert/CertClient.tsx — Client Component
 *
 * Death Certificate input page UI.
 * All interactive state (tab, form, processing) lives here.
 *
 * TZ_02 §7.2 State 1: section order
 * TZ_02 §7.3: Tab UI (Text|URL|File), touch-friendly, no dropdown on mobile
 * TZ_02 §7.4: Processing states — state-based, no fake percentage
 * TZ_02 §7.10: Anti-patterns (no animated bar fill, no confetti, no
 *               anthropomorphic indicators, no fake percentages)
 * TZ_03 §7.3–§7.11: all texts verbatim
 *
 * Mock mode: submit currently POSTs to /api/cert which returns mock data.
 * When Cloudflare Tunnel is live, /api/cert proxies to the real backend.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FAQBlock } from '@/components/shared/FAQBlock';

// ─── Types ────────────────────────────────────────────────────────────────────

type InputMode = 'text' | 'url' | 'file';

type ProcessingState =
  | 'idle'
  | 'queued'       // immediate, < 1 sec
  | 'analyzing'    // main processing
  | 'almost'       // 90%+ complete
  | 'long-queue'   // after 60 sec
  | 'email-me';    // after 90 sec

// ─── FAQ (TZ_03 §7.11 verbatim) ──────────────────────────────────────────────

const faqItems = [
  {
    question: 'How long does analysis take?',
    answer:
      '30 to 60 seconds for a typical document. Longer for documents near the maximum length, or when the model is busy with other requests.',
  },
  {
    question: 'Why does my Cert have a wide confidence interval?',
    answer:
      'Wider intervals occur for shorter documents, documents in underrepresented domains in our calibration corpus, or documents showing patterns our model is uncertain about. The interval is honest about uncertainty.',
  },
  {
    question: 'Can I run the same document twice and get different results?',
    answer:
      'The same input plus same methodology version produces the same output. Cryptographic hash verifies this. If you submit twice within the same methodology version, you get the same Cert with the same hash. After version updates, results may differ. Historical Certs remain valid through their original version.',
  },
  {
    question: 'Is my submitted text stored?',
    answer:
      'Yes, for 30 days after submission to support permanent URL rendering. After 30 days the original text is deleted; the Cert metadata (score, verdict, hash) remains. Do not submit confidential content. The privacy policy details retention policies.',
  },
  {
    question: 'Can I delete my Cert?',
    answer:
      'Contact us with the Cert URL and reason. We honor deletion requests within 14 days for Cert authors who can verify control of the original submission.',
  },
  {
    question: 'Why are some texts rejected?',
    answer:
      'Death Certificate rejects: text under 200 words, text over 5,000 words, non-English text, code (use Code DNA instead), text with extreme repetition, encoded or obfuscated content. Each rejection explains the specific issue.',
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] ' +
  '[text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] ' +
  'hover:decoration-[var(--text-primary)] transition-colors';

// ─── Component ────────────────────────────────────────────────────────────────

export function CertClient() {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [mode, setMode]             = useState<InputMode>('text');
  const [textValue, setTextValue]   = useState('');
  const [urlValue, setUrlValue]     = useState('');
  const [file, setFile]             = useState<File | null>(null);
  const [wordCount, setWordCount]   = useState(0);
  const [processing, setProcessing] = useState<ProcessingState>('idle');
  const [permalinkId, setPermalinkId] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Timer refs for processing state machine ─────────────────────────────────
  const timerLong  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerEmail = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerLong.current)  clearTimeout(timerLong.current);
      if (timerEmail.current) clearTimeout(timerEmail.current);
    };
  }, []);

  // ── Word count (text mode) ──────────────────────────────────────────────────
  function handleTextChange(val: string) {
    setTextValue(val);
    setWordCount(val.trim() === '' ? 0 : val.trim().split(/\s+/).length);
    if (error) setError(null); // clear previous submission error on edit
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setError(null);
    setProcessing('queued');

    // Start long-queue timer (60 sec) and email-me timer (90 sec)
    // TZ_02 §7.4: Long queue after 60s, Email me after 90s
    timerLong.current = setTimeout(() => setProcessing('long-queue'), 60_000);
    timerEmail.current = setTimeout(() => setProcessing('email-me'), 90_000);

    try {
      const formData = new FormData();
      formData.append('mode', mode);

      if (mode === 'text') {
        formData.append('text', textValue);
      } else if (mode === 'url') {
        formData.append('url', urlValue);
      } else if (mode === 'file' && file) {
        formData.append('file', file);
      }

      // Brief queued state
      await new Promise((r) => setTimeout(r, 800));
      setProcessing('analyzing');

      const response = await fetch('/api/cert', {
        method: 'POST',
        body: formData,
      });

      // Clear timers
      if (timerLong.current)  clearTimeout(timerLong.current);
      if (timerEmail.current) clearTimeout(timerEmail.current);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg = (data as { error?: string }).error ?? 'Analysis failed. Please try again.';
        setError(msg);
        setProcessing('idle');
        return;
      }

      setProcessing('almost');
      await new Promise((r) => setTimeout(r, 600));

      const result = await response.json() as { hash?: string; error?: string };

      if (!result.hash) {
        setError(result.error ?? 'No result returned.');
        setProcessing('idle');
        return;
      }

      // Redirect to result page
      router.push(`/cert/${result.hash}`);

    } catch {
      if (timerLong.current)  clearTimeout(timerLong.current);
      if (timerEmail.current) clearTimeout(timerEmail.current);
      setError('Service unavailable. Please try again.');
      setProcessing('idle');
    }
  }

  // ── Notify email submit ─────────────────────────────────────────────────────
  async function handleNotifySubmit() {
    if (!notifyEmail.trim() || !permalinkId) return;
    try {
      // TODO: implement app/api/cert/notify/route.ts
      // Saves email + cert_hash to cert_notifications table (TZ_04 §8.2)
      await fetch('/api/cert/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail, cert_hash: permalinkId }),
      });
      setNotifySent(true);
    } catch {
      // Silent — best effort
    }
  }

  // ── Validation helpers ──────────────────────────────────────────────────────
  const textTooShort = mode === 'text' && wordCount > 0 && wordCount < 200;
  const textTooLong  = mode === 'text' && wordCount > 5000;
  const canSubmit =
    processing === 'idle' &&
    !error &&
    (
      (mode === 'text' && wordCount >= 200 && wordCount <= 5000) ||
      (mode === 'url'  && urlValue.trim() !== '') ||
      (mode === 'file' && file !== null)
    );

  const isProcessing = processing !== 'idle';

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <main id="main-content">

      {/* ── HERO ──────────────────────────────────────────────────────────────
          TZ_03 §7.3 verbatim
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cert-heading"
        className="border-b border-[var(--border)]"
      >
        <div className="container pt-[80px] md:pt-[100px] pb-[56px] md:pb-[64px]">
          <div className="max-w-[720px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-6">
              Diagnostic instrument
            </p>
            <h1
              id="cert-heading"
              className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-5"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            >
              Death Certificate
            </h1>
            <p className="text-[19px] text-[var(--text-secondary)] leading-[1.55]">
              Statistical signature analysis for a single document.{' '}
              Calibrated. Versioned. Cryptographically signed.
            </p>
          </div>
        </div>
      </section>


      {/* ── WHAT THIS TOOL DOES ───────────────────────────────────────────────
          TZ_03 §7.4 verbatim
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="what-heading"
        className="border-b border-[var(--border)] py-[56px] md:py-[72px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2
              id="what-heading"
              className="font-serif text-[28px] md:text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8"
            >
              What this tool does
            </h2>
            <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-6">
              Submit a single English-language document. Death Certificate returns:
            </p>
            <ul className="space-y-0 mb-6" role="list">
              {[
                'IMS_text score from 0 to 100',
                '95% confidence interval (bootstrap-derived)',
                'Verbal label: Live, Hybrid, Synthetic, or Dead',
                'Methodology version with hash for reproducibility',
                'Cryptographic signature (Ed25519) for verification',
                'Permanent URL for sharing',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-2 text-[16px] text-[var(--text-secondary)] py-[8px] border-b border-[var(--border)] leading-[1.55]"
                >
                  <span className="shrink-0 text-[12px]" style={{ color: 'var(--accent)' }} aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
              The tool reflects statistical signature, not authorship proof. It is a diagnostic instrument, not a verdict.
            </p>
          </div>
        </div>
      </section>


      {/* ── TOOL UI ───────────────────────────────────────────────────────────
          TZ_02 §7.3: Tab switcher at top, card content, large submit button
          TZ_03 §7.5 verbatim texts
          TZ_02 §7.4: Processing states — state-based, no fake percentage
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="tool-heading"
        className="border-b border-[var(--border)] py-[56px] md:py-[72px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2 id="tool-heading" className="sr-only">
              Run Death Certificate
            </h2>

            {isProcessing ? (

              /* ── PROCESSING STATE ──────────────────────────────────────── */
              /* TZ_02 §7.4: state-based progress, no fake percentage */
              /* TZ_02 §7.10: no anthropomorphic "thinking..." indicators */
              <div
                className="border border-[var(--border)] bg-[var(--paper)] p-8 md:p-10"
                role="status"
                aria-live="polite"
              >
                {/* Progress bar — TZ_02 §7.4: state-based, no fake percentage */}
                <div className="w-full h-[3px] bg-[var(--border)] mb-6 overflow-hidden">
                  <div
                    className="h-full transition-none"
                    style={{
                      width:
                        processing === 'queued'     ? '10%' :
                        processing === 'analyzing'  ? '40%' :
                        processing === 'almost'     ? '90%' :
                        '95%',
                      backgroundColor: 'var(--accent)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* State: Queued — TZ_03 §7.6 */}
                {processing === 'queued' && (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                      Status
                    </p>
                    <p className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] mb-2">
                      Accepted. In queue.
                    </p>
                  </>
                )}

                {/* State: Analyzing — TZ_03 §7.6 */}
                {processing === 'analyzing' && (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                      Status
                    </p>
                    <p className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] mb-6">
                      Running analysis...
                    </p>
                    <ul className="space-y-2" role="list" aria-label="Analysis steps">
                      {[
                        'Computing perplexity distribution',
                        'Comparing against reference reservoir',
                        'Calculating stylometric features',
                        'Building bootstrap confidence interval',
                      ].map((step) => (
                        <li
                          key={step}
                          className="flex items-baseline gap-2 font-mono text-[12px] text-[var(--text-secondary)] uppercase tracking-[0.06em]"
                        >
                          <span className="shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true">—</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* State: Almost done — TZ_03 §7.6 */}
                {processing === 'almost' && (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                      Status
                    </p>
                    <p className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20]">
                      Almost done...
                    </p>
                  </>
                )}

                {/* State: Long queue — TZ_03 §7.6 */}
                {processing === 'long-queue' && (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                      Status
                    </p>
                    <p className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.25] mb-4">
                      This is taking longer than usual.
                    </p>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-[1.60] mb-4">
                      The model is busy with other requests. You can wait or close this tab and return via permalink:{' '}
                      {permalinkId ? (
                        <Link href={`/cert/${permalinkId}`} className={lnk}>
                          deadmeter.com/cert/{permalinkId}
                        </Link>
                      ) : (
                        <span className="text-[var(--text-tertiary)]">generating…</span>
                      )}
                    </p>
                  </>
                )}

                {/* State: Email me when ready — TZ_03 §7.6 */}
                {processing === 'email-me' && (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                      Status
                    </p>
                    <p className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.25] mb-4">
                      Get notified by email when ready.
                    </p>
                    {notifySent ? (
                      <p className="text-[15px] text-[var(--text-secondary)]">
                        We&apos;ll email you when your Cert is ready.
                      </p>
                    ) : (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleNotifySubmit(); }}
                        className="flex gap-0 max-w-[480px]"
                      >
                        <input
                          type="email"
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="flex-1 border border-[var(--border)] border-r-0 bg-[var(--paper)] px-4 py-3 text-[15px] font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus-visible:outline-none focus:border-[var(--text-primary)]"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 text-[14px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                    )}
                  </>
                )}

              </div>

            ) : (

              /* ── INPUT FORM ────────────────────────────────────────────── */
              <div>

                {/* Tab switcher — TZ_02 §7.3 */}
                <div
                  className="inline-flex mb-0"
                  role="tablist"
                  aria-label="Input mode"
                >
                  {(['text', 'url', 'file'] as InputMode[]).map((m, i) => (
                    <button
                      key={m}
                      role="tab"
                      aria-selected={mode === m}
                      aria-controls={`tab-panel-${m}`}
                      onClick={() => { setMode(m); setError(null); }}
                      className={[
                        'px-6 py-3 text-[13px] font-medium border transition-colors',
                        i > 0 ? '-ml-px' : '',
                        mode === m
                          ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)] z-10'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]',
                      ].join(' ')}
                    >
                      {m === 'text' ? 'Text' : m === 'url' ? 'URL' : 'File'}
                    </button>
                  ))}
                </div>

                {/* Tab panels */}
                <div className="border border-[var(--border)] border-t-0 bg-[var(--paper)] p-6 md:p-8 mb-4">

                  {/* TEXT — TZ_03 §7.5 */}
                  {mode === 'text' && (
                    <div id="tab-panel-text" role="tabpanel" aria-label="Text input">
                      <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-1">
                        Paste your document below.
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-4">
                        Minimum 200 words. Maximum 5,000 words. English only.
                      </p>
                      <textarea
                        value={textValue}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder="Paste your document here…"
                        rows={14}
                        className="w-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[15px] font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-y leading-[1.60] focus:outline-none focus:border-[var(--text-focus:outline-none focus-visible:outline-none focus:border-[var(--text-primary)] mb-3"
                        aria-label="Document text"
                        aria-describedby="word-count"
                      />
                      {/* Live word counter — TZ_03 §7.5 */}
                      <div
                        id="word-count"
                        className={[
                          'font-mono text-[12px] uppercase tracking-[0.06em]',
                          textTooShort ? 'text-[var(--accent)]' :
                          textTooLong  ? 'text-[var(--accent)]' :
                          wordCount > 0 ? 'text-[var(--live)]' :
                          'text-[var(--text-tertiary)]',
                        ].join(' ')}
                        aria-live="polite"
                      >
                        {wordCount.toLocaleString()} / 5,000
                        {textTooShort && ' — minimum 200 words'}
                        {textTooLong  && ' — maximum 5,000 words'}
                      </div>
                    </div>
                  )}

                  {/* URL — TZ_03 §7.5 */}
                  {mode === 'url' && (
                    <div id="tab-panel-url" role="tabpanel" aria-label="URL input">
                      <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-1">
                        Enter a URL.
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.60] mb-6">
                        We extract the article content automatically. If extraction fails or content is behind a paywall, switch to text mode and paste manually.
                      </p>
                      <input
                        type="url"
                        value={urlValue}
                        onChange={(e) => { setUrlValue(e.target.value); setError(null); }}
                        placeholder="https://example.com/article"
                        className="w-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[15px] font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus-visible:outline-none focus:border-[var(--text-primary)]"
                        aria-label="Article URL"
                      />
                    </div>
                  )}

                  {/* FILE — TZ_03 §7.5 */}
                  {mode === 'file' && (
                    <div id="tab-panel-file" role="tabpanel" aria-label="File upload">
                      <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-1">
                        Upload a .txt or .md file.
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.60] mb-6">
                        Maximum 5 MB. English language. No PDFs in v1.0 (PDF support coming later).
                      </p>
                      <div
                        className="border border-[var(--border)] border-dashed bg-[var(--bg)] p-10 text-center cursor-pointer hover:border-[var(--text-secondary)] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        aria-label="Upload file"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".txt,.md"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setFile(f);
                            setError(null);
                          }}
                        />
                        {file ? (
                          <div>
                            <p className="font-mono text-[13px] text-[var(--text-primary)] mb-1">
                              {file.name}
                            </p>
                            <p className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.06em]">
                              {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        ) : (
                          <p className="text-[15px] text-[var(--text-secondary)]">
                            Click to select a file, or drag and drop
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Error */}
                {error && (
                  <p
                    className="text-[14px] mb-4 font-mono uppercase tracking-[0.06em]"
                    style={{ color: 'var(--accent)' }}
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {/* Submit button — TZ_03 §7.5: "Run Death Certificate" */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="inline-flex items-center justify-center w-full px-8 py-[18px] text-[16px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-disabled={!canSubmit}
                >
                  Run Death Certificate
                </button>

                {/* What happens next — TZ_02 §7.3 */}
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mt-4 text-center">
                  30–60 seconds · Permanent URL · Cryptographically signed
                </p>

              </div>
            )}

          </div>
        </div>
      </section>


      {/* ── LIMITATIONS ───────────────────────────────────────────────────────
          TZ_03 §7.9 verbatim
          TZ_02 §7.2 State 1 section 5
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="limitations-heading"
        className="border-b border-[var(--border)] py-[56px] md:py-[72px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2
              id="limitations-heading"
              className="font-serif text-[28px] md:text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8"
            >
              What this tool cannot do
            </h2>
            <div className="space-y-5">
              {[
                'It cannot prove authorship. It can suggest a statistical pattern consistent or inconsistent with AI generation, with calibrated confidence. Proof of authorship requires multiple independent forms of evidence.',
                'It cannot detect AI text under recursive paraphrasing. This is a fundamental limit, not a flaw of any specific tool. See the methodology page §10 (Sadasivan boundary) for the formal result and its implications.',
                'It cannot detect AI text in mixed human-AI documents reliably. Hybrid authorship produces ambiguous signatures. The verbal label Hybrid covers this case explicitly.',
                'It cannot evaluate truth. Whether a document\'s claims are factually accurate is a separate question requiring fact-checking, source verification, and corroboration.',
                'It cannot replace editorial judgment. Use Death Certificate as a diagnostic signal in your investigative workflow, not as a substitute for journalistic verification.',
              ].map((para, i) => (
                <p key={i} className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── HOW THIS WORKS ────────────────────────────────────────────────────
          TZ_03 §7.10 verbatim
          TZ_02 §7.2 State 1 section 6
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="how-heading"
        className="border-b border-[var(--border)] py-[56px] md:py-[72px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2
              id="how-heading"
              className="font-serif text-[28px] md:text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8"
            >
              How this works
            </h2>
            <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-6">
              A four-block analysis pipeline:
            </p>
            <ol className="space-y-4 mb-8 pl-0" role="list">
              {[
                'Stylometric vector covering function word usage, sentence rhythm, POS distribution, punctuation patterns, lexical diversity, and character n-gram frequencies.',
                'Compression-based novelty detection through normalized compression distance against a reference reservoir of known-human and known-AI reference texts.',
                'Internal uncertainty estimation through perplexity distribution when processed by a small reference language model.',
                'Discourse cohesion measurement through inter-sentence semantic relationships.',
              ].map((step, i) => (
                <li key={i} className="flex items-baseline gap-4 text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                  <span className="shrink-0 font-mono text-[13px] font-medium text-[var(--text-tertiary)]">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="space-y-4 mb-8">
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                These four signals combine through a calibrated generalized linear model with isotonic regression for probability calibration. The output is mapped to the IMS_text score from 0 to 100.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Bootstrap confidence intervals are computed from text fragment resampling at 200 iterations. Wider intervals indicate shorter or more uncertain documents.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                The full methodology specification is published at deadmeter.com/methodology.
              </p>
            </div>
            <Link href="/methodology" className={lnk}>
              Read full methodology →
            </Link>
          </div>
        </div>
      </section>


      {/* ── FAQ ───────────────────────────────────────────────────────────────
          TZ_03 §7.11 verbatim
          TZ_02 §7.2 State 1 section 7
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-[56px] md:py-[72px]">
        <div className="container">
          <div className="max-w-[720px]">
            <FAQBlock items={faqItems} includeSchema={false} />
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-[var(--border)]">
              <Link href="/methodology" className={lnk}>Methodology</Link>
              <Link href="/tools" className={lnk}>All tools</Link>
              <Link href="/pricing" className={lnk}>Pricing</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
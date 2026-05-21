'use client';

import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface PulseSignupFormProps {
  centered?: boolean;
  className?: string;
}

export function PulseSignupForm({ centered = false, className = '' }: PulseSignupFormProps) {
  const [email,    setEmail]    = useState('');
  const [state,    setState]    = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState('success');
      setEmail('');
    } catch {
      setState('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  const align = centered ? 'text-center' : '';

  return (
    <div className={`${align} ${className}`}>
      <h2
        className={`font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-3 ${align}`}
      >
        Pulse arrives weekly
      </h2>
      <p className={`text-[17px] text-[var(--text-secondary)] mb-10 ${align}`}>
        A short, sober summary of the week&apos;s measurements. Tuesday mornings. Free forever.
      </p>

      {state === 'success' ? (
        <div className="border border-[var(--border)] p-5">
          <p className={`font-mono text-[13px] uppercase tracking-[0.05em] text-[var(--text-secondary)] ${align}`}>
            Subscribed. First Pulse arrives Tuesday.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row" noValidate>
          <label htmlFor="pulse-email" className="sr-only">
            Email address
          </label>
          <input
            id="pulse-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={state === 'loading'}
            autoComplete="email"
            className="flex-1 px-4 py-3 border border-[var(--border)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[16px] focus:outline-none focus:border-[var(--text-primary)] transition-colors disabled:opacity-60"
            style={{ borderRadius: 0 }}
          />
          <button
            type="submit"
            disabled={state === 'loading' || !email}
            className="px-7 py-3 bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderRadius: 0 }}
          >
            {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {state === 'error' && (
        <p className={`font-mono text-[13px] text-[var(--accent-bordeaux)] mt-3 ${align}`}>
          {errorMsg}
        </p>
      )}

      {state !== 'success' && (
        <p className={`text-[13px] text-[var(--text-tertiary)] mt-5 ${align}`}>
          We send the weekly Pulse and nothing else. No marketing. No tracking pixels.
          Unsubscribe with one click.
        </p>
      )}
    </div>
  );
}
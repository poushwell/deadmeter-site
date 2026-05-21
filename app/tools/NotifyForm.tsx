'use client';

import { useState } from 'react';

interface NotifyFormProps {
  toolName: string;
}

type FormState = 'idle' | 'open' | 'loading' | 'success' | 'error';

export function NotifyForm({ toolName }: NotifyFormProps) {
  const [state, setState] = useState<FormState>('idle');
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tool: toolName }),
      });
      setState('success');
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55]">
        We&apos;ll email you when{' '}
        <span className="font-medium text-[var(--text-primary)]">{toolName}</span> launches.
      </p>
    );
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={() => setState('open')}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--text-primary)] underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] [text-decoration-thickness:1.5px] [text-decoration-skip-ink:none] hover:decoration-[var(--text-primary)] transition-colors"
        aria-label={'Notify me when ' + toolName + ' is available'}
      >
        Notify me when available
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
      aria-label={'Notify me form for ' + toolName}
    >
      <div className="flex gap-2">
        <label htmlFor={'notify-' + toolName} className="sr-only">
          Email address
        </label>
        <input
          id={'notify-' + toolName}
          type="email"
          required
          autoFocus
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'loading'}
          className="flex-1 min-w-0 text-[14px] text-[var(--text-primary)] bg-[var(--bg)] border border-[var(--border)] px-4 py-3 placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-60 transition-colors"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="shrink-0 px-4 py-3 text-[13px] font-medium bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--accent)] disabled:opacity-50 transition-colors"
        >
          {state === 'loading' ? 'Sending...' : 'Notify me'}
        </button>
      </div>

      {state === 'error' && (
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-bordeaux)]">
          Something went wrong. Try again.
        </p>
      )}

      <button
        type="button"
        onClick={() => setState('idle')}
        className="self-start text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
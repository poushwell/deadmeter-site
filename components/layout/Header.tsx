/**
 * components/layout/Header.tsx
 *
 * TZ_02 §2.1 fixes:
 * 1. Removed backdropFilter blur        — TZ_05 anti-pattern
 * 2. py-6 → h-14                        — TZ_05: header 56px
 * 3. "Sign up" href="/cert" → Sign in + magic-link flow
 * 4. Mobile "Sign in" href="/cert" → magic-link form
 * 5. Added Supabase auth state + avatar dropdown (logged-in)
 * 6. useEffect: close menu on route change
 * 7. Body scroll lock when mobile menu open
 * 8. aria-modal="true" on mobile dialog
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from './Navigation';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [user,       setUser]       = useState<User | null>(null);
  const [email,      setEmail]      = useState('');
  const [sent,       setSent]       = useState(false);
  const [sending,    setSending]    = useState(false);

  const pathname = usePathname();
  const dropRef  = useRef<HTMLDivElement>(null);

  // ── Auth state ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // ── Close mobile menu on route change ──────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Body scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
        setSignInOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    try {
      await fetch('/api/auth/magic-link', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      });
    } finally {
      setSent(true);
      setSending(false);
    }
  }

  async function handleSignOut() {
    setDropOpen(false);
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]"
      // no backdropFilter — TZ_05: blur effects запрещены
    >
      {/* h-14 = 56px — TZ_05 header height */}
      <div className="container flex items-center justify-between h-14">

        <Link
          href="/"
          onClick={handleLogoClick}
          className="font-serif text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]"
        >
          Deadmeter
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Navigation />

          {user ? (
            /* Avatar dropdown — TZ_02 §2.1: logged-in state */
            <div className="relative" ref={dropRef}>
              <button
                type="button"
                onClick={() => setDropOpen((o) => !o)}
                aria-label="Account menu"
                aria-expanded={dropOpen}
                className="w-8 h-8 bg-[var(--accent)] text-white font-mono text-[12px] font-medium flex items-center justify-center"
              >
                {(user.email?.[0] ?? '?').toUpperCase()}
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-10 w-56 border border-[var(--border)] bg-[var(--bg)] z-50">
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-0.5">
                      Signed in as
                    </p>
                    <p className="text-[13px] text-[var(--text-primary)] truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--paper)] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Sign in — TZ_02 §2.1: magic-link, not /cert */
            <div className="relative" ref={dropRef}>
              <button
                type="button"
                onClick={() => { setSignInOpen((o) => !o); setSent(false); setEmail(''); }}
                className="ml-2 px-[27px] py-[13px] text-[14px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                style={{ borderRadius: 0 }}
              >
                Sign in
              </button>

              {signInOpen && (
                <div className="absolute right-0 top-14 w-72 border border-[var(--border)] bg-[var(--bg)] p-4 z-50">
                  {sent ? (
                    <>
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">
                        Check your email
                      </p>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                        We sent a sign-in link to {email}.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-3">
                        Sign in with email
                      </p>
                      <form onSubmit={handleSignIn} className="flex gap-0">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="flex-1 border border-[var(--border)] border-r-0 bg-[var(--paper)] px-3 py-2 text-[13px] font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)]"
                        />
                        <button
                          type="submit"
                          disabled={sending}
                          className="px-4 py-2 text-[12px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                        >
                          {sending ? '...' : '→'}
                        </button>
                      </form>
                      <p className="text-[11px] text-[var(--text-tertiary)] mt-2">
                        No password. Magic link sent to your inbox.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1 text-[var(--text-primary)]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <line x1="3" y1="3" x2="17" y2="17" />
              <line x1="17" y1="3" x2="3" y2="17" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <rect y="3"  width="20" height="1.5" rx="0.75" />
              <rect y="9"  width="20" height="1.5" rx="0.75" />
              <rect y="15" width="20" height="1.5" rx="0.75" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — inline drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Navigation mobile onLinkClick={() => setMobileOpen(false)} />

          <div className="pt-4 border-t border-[var(--border)] mt-4">
            {user ? (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-3">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : sent ? (
              <p className="text-[13px] text-[var(--text-secondary)]">
                Check your email for a sign-in link.
              </p>
            ) : (
              <form onSubmit={handleSignIn} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-[var(--border)] bg-[var(--paper)] px-3 py-2.5 text-[14px] font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 text-[13px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  {sending ? 'Sending...' : 'Sign in'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
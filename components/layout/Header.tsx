'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

function handleLogoClick(e: React.MouseEvent) {
  if (pathname === '/') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="container flex items-center justify-between py-6">
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
          <Link
            href="/cert"
            className="ml-2 px-[27px] py-[13px] text-[14px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            style={{ borderRadius: 0 }}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1 text-[var(--text-primary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <Navigation mobile onLinkClick={() => setMobileOpen(false)} />
          <div className="pt-4">
            <Link
              href="/cert"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-[13px] border border-[var(--text-primary)] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg)] transition-colors"
              style={{ borderRadius: 0 }}
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
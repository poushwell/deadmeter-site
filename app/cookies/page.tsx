import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Policy',
  // NOTE: TZ_03 §11.3 does not provide a meta description for this page.
  // TODO: confirm with Pavel before launch.
  description:
    'Cookie Policy for Deadmeter. First-party cookies only. No tracking, advertising, or third-party cookies.',
  path: '/cookies',
});

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://deadmeter.com/cookies',
      name: 'Cookie Policy',
      url: 'https://deadmeter.com/cookies',
      description:
        'Cookie Policy for Deadmeter. First-party cookies only. No tracking, advertising, or third-party cookies.',
      dateModified: '2026-05-20',
      isPartOf: { '@id': 'https://deadmeter.com' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://deadmeter.com/#organization',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
      logo: 'https://deadmeter.com/logo.png',
      founder: { '@type': 'Person', name: 'Pavel Ishchin' },
      description: 'Internet content tracking with calibrated confidence intervals.',
    },
  ],
};

// Inline link style for body text links
const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] [text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] hover:decoration-[var(--text-primary)] transition-colors';

// Reusable section divider
function Divider() {
  return <div className="border-t border-[var(--border)] mb-12" aria-hidden="true" />;
}

export default function CookiesPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />

      <main id="main-content">
        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <header className="border-b border-[var(--border)] bg-[var(--bg)]">
          <div className="container-reading pt-[80px] md:pt-[20px] pb-[48px] md:pb-[44px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-6">
              Legal
            </p>
            <h1 className="font-serif text-[38px] md:text-[44px] font-bold text-[var(--text-primary)] leading-[1.10] tracking-[-0.02em] mb-6">
              Cookie Policy
            </h1>
            <p className="font-mono text-[12px] text-[var(--text-tertiary)] tracking-[0.04em]">
              Last updated: May 20, 2026
            </p>
          </div>
        </header>

        {/* ── LEGAL CROSS-NAV ──────────────────────────────────────────── */}
        <nav
          aria-label="Legal pages"
          className="border-b border-[var(--border)] bg-[var(--bg)]"
        >
          <div className="container-reading">
            <div className="flex items-center gap-6 py-3">
              <Link
                href="/privacy"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Terms
              </Link>
              <span className="text-[13px] font-medium text-[var(--text-primary)] border-b-2 border-[var(--accent)] pb-0.5">
                Cookies
              </span>
            </div>
          </div>
        </nav>

        {/* ── ARTICLE CONTENT ──────────────────────────────────────────── */}
        <article>
          <div className="container-reading pt-[40px] pb-[80px] md:pb-[100px]">

            {/* §1 What cookies we use */}
            <section id="section-1" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                What cookies we use
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Deadmeter uses minimal cookies, all first-party.
              </p>
            </section>

            <Divider />

            {/* §2 Strictly necessary cookies */}
            <section id="section-2" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Strictly necessary cookies
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                These cookies are required for the service to function:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Authentication session (only when logged in, 30-day expiry)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  CSRF protection token (session duration)
                </li>
              </ul>
            </section>

            <Divider />

            {/* §3 Preference cookies */}
            <section id="section-3" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Preference cookies
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                Optional, set only when you make a preference choice:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Theme preference (light/dark/system, 1-year expiry)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Display preferences (1-year expiry)
                </li>
              </ul>
            </section>

            <Divider />

            {/* §4 What we do not use */}
            <section id="section-4" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                What we do not use
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                We do not use:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Tracking cookies
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Advertising cookies
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Third-party cookies
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Analytics cookies (see{' '}
                  <Link href="/privacy" className={lnk}>
                    Privacy Policy
                  </Link>{' '}
                  for our analytics approach)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Social media cookies
                </li>
              </ul>
            </section>

            <Divider />

            {/* §5 Managing cookies */}
            <section id="section-5" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Managing cookies
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                You can manage cookies through your browser settings. Disabling strictly necessary
                cookies will prevent login functionality.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Disabling preference cookies will reset your preferences on each visit.
              </p>
            </section>

            <Divider />

            {/* §6 Changes to this policy */}
            <section id="section-6" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Changes to this policy
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Updates announced through 30-day notice on the homepage. Previous versions
                archived.
              </p>
            </section>

            <Divider />

            {/* §7 Contact */}
            <section id="section-7" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Contact
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Questions about cookies:{' '}
                <a href="mailto:privacy@deadmeter.com" className={lnk}>
                  privacy@deadmeter.com
                </a>
                .
              </p>
            </section>

          </div>
        </article>

        {/* ── PAGE FOOTER (cross-links + version) ──────────────────────── */}
        <div className="container-reading pb-[80px]">
          <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav aria-label="Legal pages" className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-[var(--border-warm)]" aria-hidden="true">·</span>
              <Link
                href="/terms"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
              Last updated: May 20, 2026
            </p>
          </div>
        </div>

      </main>
    </>
  );
}
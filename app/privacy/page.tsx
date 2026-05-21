import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Deadmeter. Data collection, usage, retention, and user rights.',
  path: '/privacy',
});

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://deadmeter.com/privacy',
      name: 'Privacy Policy',
      url: 'https://deadmeter.com/privacy',
      description: 'Privacy policy for Deadmeter. Data collection, usage, retention, and user rights.',
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

export default function PrivacyPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />

      <main id="main-content">
        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <header className="border-b border-[var(--border)] bg-[var(--bg)]">
          <div className="container-reading pt-[80px] md:pt-[20px] pb-[48px] md:pb-[34px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-6">
              Legal
            </p>
            <h1 className="font-serif text-[28px] md:text-[44px] font-bold text-[var(--text-primary)] leading-[1.10] tracking-[-0.02em] mb-6">
              Privacy Policy
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
              <span className="text-[13px] font-medium text-[var(--text-primary)] border-b-2 border-[var(--accent)] pb-0.5">
                Privacy
              </span>
              <Link
                href="/terms"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </nav>

        {/* ── ARTICLE CONTENT ──────────────────────────────────────────── */}
        <article>
          <div className="container-reading pt-[40px] pb-[80px] md:pb-[100px]">

            {/* §1 Information we collect */}
            <section id="section-1" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Information we collect
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                When you visit Deadmeter without creating an account, we collect no personal
                information. We do not use Google Analytics, tracking pixels, or third-party
                tracking scripts.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                When you create an account, we collect your email address. This is the only
                required personal information. Optional information includes display name and
                time zone preference.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                When you submit text to Death Certificate or any tool, we temporarily store the
                submitted text for permalink rendering. Text is automatically deleted after 30
                days. Cert metadata (score, verdict, hash) remains accessible at the permanent
                URL indefinitely.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                When you subscribe to Pulse, we collect your email address for the purpose of
                sending the weekly Pulse publication. Your email is not shared with any third
                party.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                When you make a payment, payment processing is handled by Lemon Squeezy (and
                CryptoCloud for crypto annual subscriptions). We receive a receipt confirmation
                and your name and email but do not store payment card details.
              </p>
            </section>

            <Divider />

            {/* §2 How we use your information */}
            <section id="section-2" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                How we use your information
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                Email addresses are used for:
              </p>
              <ul className="list-disc pl-7 mb-6 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Sending the weekly Pulse if you subscribed
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Sending magic-link authentication if you have an account
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Sending account-related communications (subscription changes, receipts)
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                Submitted texts are used for:
              </p>
              <ul className="list-disc pl-7 mb-6 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Processing through tool pipelines
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Rendering permanent Cert URLs
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                We do not use your information for:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Targeted advertising
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Selling to third parties
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Building user profiles
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Cross-site tracking
                </li>
              </ul>
            </section>

            <Divider />

            {/* §3 How long we retain information */}
            <section id="section-3" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                How long we retain information
              </h2>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Account email:</strong>{' '}
                  while account is active. Deletion on request.
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Submitted texts:</strong>{' '}
                  30 days, then automatically deleted.
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">
                    Cert metadata (score, hash, verdict):
                  </strong>{' '}
                  indefinitely, accessible at permanent URL.
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">
                    Pulse subscription:
                  </strong>{' '}
                  until you unsubscribe. One-click unsubscribe in every email.
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Payment records:</strong>{' '}
                  as required by tax law (typically 7 years).
                </li>
              </ul>
            </section>

            <Divider />

            {/* §4 Third-party processors */}
            <section id="section-4" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Third-party processors
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Vercel (hosting)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Supabase (database)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Resend (email delivery)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Lemon Squeezy (payment processing)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  CryptoCloud (crypto payment processing)
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Each processor&apos;s privacy practices apply to data they handle. Processor URLs
                available on request.
              </p>
            </section>

            <Divider />

            {/* §5 Your rights */}
            <section id="section-5" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Your rights
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Access your stored personal information
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Correct inaccurate information
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Delete your account and associated data
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Export your data in a portable format
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Withdraw consent (unsubscribe, account deletion)
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                To exercise these rights, email{' '}
                <a href="mailto:privacy@deadmeter.com" className={lnk}>
                  privacy@deadmeter.com
                </a>{' '}
                with your request and the email address associated with your account.
              </p>
            </section>

            <Divider />

            {/* §6 Cookies */}
            <section id="section-6" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Cookies
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                Deadmeter uses minimal cookies:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Authentication session cookie (only when logged in, 30-day expiry)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Preference cookie for theme selection (only when set)
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                We do not use:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Tracking cookies
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Advertising cookies
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Third-party cookies
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                See the{' '}
                <Link href="/cookies" className={lnk}>
                  Cookie Policy
                </Link>{' '}
                for full details.
              </p>
            </section>

            <Divider />

            {/* §7 Contact */}
            <section id="section-7" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Contact
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                For privacy questions or rights requests, email{' '}
                <a href="mailto:privacy@deadmeter.com" className={lnk}>
                  privacy@deadmeter.com
                </a>
                .
              </p>
            </section>

            <Divider />

            {/* §8 Changes to this policy */}
            <section id="section-8" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Changes to this policy
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                We may update this policy. Material changes are announced through email to account
                holders and Pulse subscribers, plus a notice on the homepage for 30 days.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Previous versions of this policy are archived at{' '}
                <a href="https://deadmeter.com/privacy/v1" className={lnk}>
                  deadmeter.com/privacy/v1
                </a>
                ,{' '}
                <a href="https://deadmeter.com/privacy/v2" className={lnk}>
                  deadmeter.com/privacy/v2
                </a>
                , and so on.
              </p>
            </section>

          </div>
        </article>

        {/* ── PAGE FOOTER (archive + version) ──────────────────────────── */}
        <div className="container-reading pb-[80px]">
          <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav aria-label="Legal pages" className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-[var(--border-warm)]" aria-hidden="true">·</span>
              <Link
                href="/cookies"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Cookie Policy
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
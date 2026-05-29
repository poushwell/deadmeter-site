/**
 * emails/pulse-subscribe.tsx
 *
 * Pulse subscription confirmation email.
 * Sent once on new subscribe or re-subscribe.
 *
 * Text sources:
 *   - "We send Pulse and nothing else..." → TZ_03 §9.4
 *   - "Your email is not shared..."       → TZ_03 Privacy §8.2
 *   - "Tuesdays at 10am UTC"              → TZ_03 §9.3, §9.4
 *   - Tone                                → TZ_01 §4 (institutional, sober, no hype)
 *
 * Styles: inline only — email clients strip <style> blocks.
 * Palette values match TZ_05 Part 1 §2 exactly.
 */

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PulseSubscribeEmailProps {
  /** Subscriber email — used to build the one-click unsubscribe link */
  email: string;
  /** Absolute base URL. Defaults to production site. */
  baseUrl?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PulseSubscribeEmail({
  email,
  baseUrl = 'https://deadmeter.com',
}: PulseSubscribeEmailProps) {
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  const pulseUrl = `${baseUrl}/pulse`;

  return (
    <Html lang="en">
      <Head />

      {/* Shown in inbox before email is opened */}
      <Preview>Pulse subscription confirmed. Tuesdays at 10am UTC.</Preview>

      <Body style={s.body}>
        <Container style={s.container}>

          {/* Wordmark */}
          <Section style={s.headerSection}>
            <Text style={s.wordmark}>Deadmeter</Text>
          </Section>

          <Hr style={s.rule} />

          {/* Body copy */}
          <Section style={s.bodySection}>
            <Text style={s.heading}>Subscription confirmed.</Text>

            <Text style={s.p}>
              You&rsquo;ll receive Pulse weekly, Tuesdays at 10am UTC.
            </Text>

            <Text style={s.p}>
              We send Pulse and nothing else. No marketing. No tracking pixels.
              No promotional sequences.
            </Text>

            <Text style={s.p}>
              Your email is not shared with any third party.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={s.ctaSection}>
            <Link href={pulseUrl} style={s.cta}>
              View Pulse archive
            </Link>
          </Section>

          <Hr style={s.rule} />

          {/* Footer */}
          <Section style={s.footerSection}>
            <Text style={s.footerText}>
              Deadmeter &middot; Internet content tracking with confidence intervals
            </Text>
            <Text style={s.footerText}>
              <Link href={unsubscribeUrl} style={s.unsubLink}>
                Unsubscribe
              </Link>
              {' '}from Pulse. One click, immediate effect.
            </Text>
            <Text style={s.mono}>
              METHODOLOGY V1.0 &middot; deadmeter.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
// TZ_05 Part 1 §2 palette values, applied inline for email client compatibility.
// No CSS variables — email clients do not support custom properties.

// TZ_05: --bg: #FAF9F5
// TZ_05: --text-primary: #1A1A1A
// TZ_05: --text-secondary: #6B6B68
// TZ_05: --text-tertiary: #918E83
// TZ_05: --border: #E5E2D8
// TZ_05: --accent: #D97757

const BG      = '#FAF9F5';
const INK     = '#1A1A1A';
const MUTED   = '#6B6B68';
const META    = '#918E83';
const RULE    = '#E5E2D8';
const ACCENT  = '#D97757';

const SANS  = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO  = "'Courier New', Courier, monospace";

const s = {
  body: {
    backgroundColor: BG,
    margin: '0',
    padding: '0',
    WebkitTextSizeAdjust: '100%',
    msTextSizeAdjust: '100%',
  },

  container: {
    backgroundColor: BG,
    maxWidth: '540px',
    margin: '0 auto',
    padding: '0',
  },

  headerSection: {
    padding: '40px 40px 24px',
  },

  wordmark: {
    fontFamily: SERIF,
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: INK,
    margin: '0',
    padding: '0',
  },

  rule: {
    borderColor: RULE,
    borderTopWidth: '1px',
    borderTopStyle: 'solid' as const,
    margin: '0 40px',
  },

  bodySection: {
    padding: '32px 40px',
  },

  heading: {
    fontFamily: SERIF,
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '1.25',
    color: INK,
    margin: '0 0 24px 0',
    padding: '0',
  },

  p: {
    fontFamily: SANS,
    fontSize: '15px',
    lineHeight: '1.65',
    color: MUTED,
    margin: '0 0 14px 0',
    padding: '0',
  },

  ctaSection: {
    padding: '0 40px 32px',
  },

  cta: {
    display: 'inline-block',
    backgroundColor: ACCENT,
    color: '#FFFFFF',
    fontFamily: SANS,
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0',
    textDecoration: 'none',
    padding: '11px 22px',
  },

  footerSection: {
    padding: '24px 40px 40px',
  },

  footerText: {
    fontFamily: SANS,
    fontSize: '12px',
    lineHeight: '1.60',
    color: META,
    margin: '0 0 6px 0',
    padding: '0',
  },

  unsubLink: {
    color: INK,
    textDecoration: 'underline',
  },

  mono: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: META,
    margin: '14px 0 0 0',
    padding: '0',
  },
} as const;
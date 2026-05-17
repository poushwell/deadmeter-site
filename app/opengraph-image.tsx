import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Deadmeter · Internet content tracking with confidence intervals';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        background: '#FAF9F5',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        fontFamily: 'Georgia, serif',
      }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
          Deadmeter
        </span>
        <div>
          <h1 style={{ fontSize: 60, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, maxWidth: 860 }}>
            Internet content tracking, with confidence intervals.
          </h1>
          <p style={{ fontSize: 22, color: '#6B6B68', marginTop: 24, marginBottom: 0, lineHeight: 1.5, fontFamily: 'system-ui, sans-serif', fontWeight: 400, maxWidth: 720 }}>
            Weekly measurements of AI saturation, bot activity, and information manipulation. Open methodology. Apolitical scope.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, color: '#918E83', fontFamily: 'monospace' }}>deadmeter.com</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757', display: 'inline-block' }} />
          <span style={{ fontSize: 15, color: '#918E83', fontFamily: 'monospace' }}>Open methodology</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757', display: 'inline-block' }} />
          <span style={{ fontSize: 15, color: '#918E83', fontFamily: 'monospace' }}>Calibrated CI</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
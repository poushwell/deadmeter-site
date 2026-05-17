import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        background: '#D97757',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ color: '#FAF9F5', fontSize: 110, fontWeight: 700, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
          D
        </span>
      </div>
    ),
    { ...size },
  );
}
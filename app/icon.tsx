import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        background: '#D97757',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
      }}>
        <span style={{ color: '#FAF9F5', fontSize: 20, fontWeight: 700, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
          D
        </span>
      </div>
    ),
    { ...size },
  );
}
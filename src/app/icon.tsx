
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 10,
          background: 'radial-gradient(circle at center, #000000 0%, #1a1a1a 50%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00ff41',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '0px',
          border: '1px solid #00ff41',
          borderRadius: '2px',
          textShadow: '0 0 3px #00ff41',
        }}
      >
        IECA
      </div>
    ),
    {
      ...size,
    }
  )
}

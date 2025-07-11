
import { ImageResponse } from 'next/og'
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export default async function Icon() {
    const imagePath = path.join(process.cwd(), 'public', 'assets', '1752137694206.jpg');
    const imageData = await fs.readFile(imagePath);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        <img 
            width="32"
            height="32"
            // @ts-ignore - The `src` attribute expects a string, but we are providing an ArrayBuffer.
            // This is the correct way to do it for ImageResponse.
            src={imageData.buffer}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}

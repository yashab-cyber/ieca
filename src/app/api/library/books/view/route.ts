import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookPath = searchParams.get('path');

    if (!bookPath) {
      return NextResponse.json(
        { success: false, message: 'Book path is required' },
        { status: 400 }
      );
    }

    // Validate the path to prevent directory traversal
    if (bookPath.includes('..') || !bookPath.startsWith('/books/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid book path' },
        { status: 400 }
      );
    }

    const fullPath = join(process.cwd(), 'content', bookPath);
    
    try {
      const fileBuffer = await readFile(fullPath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      });
    } catch (error) {
      console.error('File not found:', fullPath);
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error serving book:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to serve book' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { resourceService } from '@/lib/services';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await resourceService.incrementDownloads(id);

    return NextResponse.json({
      success: true,
      message: "Download count incremented successfully!",
    });

  } catch (error) {
    console.error('Download increment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to increment download count' },
      { status: 500 }
    );
  }
}

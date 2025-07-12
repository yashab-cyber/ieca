import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/security/ip-logger/sessions/[id] - Get specific session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    const session = await (prisma as any).securityToolUsage.findUnique({
      where: { id: sessionId },
      include: {
        ipLogs: true,
        tool: true
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const inputData = session.inputData as any;
    const outputData = session.outputData as any;
    const uniqueIPs = new Set(session.ipLogs.map((log: any) => log.ipAddress)).size;

    return NextResponse.json({
      id: session.id,
      name: inputData.name,
      description: inputData.description,
      trackingUrl: outputData?.trackingUrl,
      redirectUrl: inputData.redirectUrl,
      isActive: session.status === 'PROCESSING' || session.status === 'COMPLETED',
      clickCount: session.ipLogs.length,
      uniqueIPs,
      createdAt: session.createdAt.toISOString(),
      expiresAt: inputData.expiresAt
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// PATCH /api/security/ip-logger/sessions/[id] - Update session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { isActive } = body;

    const session = await (prisma as any).securityToolUsage.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updatedSession = await (prisma as any).securityToolUsage.update({
      where: { id: sessionId },
      data: {
        status: isActive ? 'PROCESSING' : 'CANCELLED'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/security/ip-logger/sessions/[id] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Delete all associated IP logs first
    await (prisma as any).ipLogEntry.deleteMany({
      where: { usageId: sessionId }
    });

    // Delete the session
    await (prisma as any).securityToolUsage.delete({
      where: { id: sessionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}

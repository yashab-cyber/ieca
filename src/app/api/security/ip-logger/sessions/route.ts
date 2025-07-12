import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/security/ip-logger/sessions - Get all IP logger sessions for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // In real app, get from auth
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // First, ensure we have the IP_LOGGER tool
    let tool = await (prisma as any).securityTool.findFirst({
      where: { type: 'IP_LOGGER' }
    });

    if (!tool) {
      tool = await (prisma as any).securityTool.create({
        data: {
          name: 'IP Logger',
          type: 'IP_LOGGER',
          description: 'Generate tracking links to log IP addresses and gather visitor information',
          isActive: true
        }
      });
    }

    // Get all sessions for this user and tool
    const sessions = await (prisma as any).securityToolUsage.findMany({
      where: {
        userId,
        toolId: tool.id,
        status: { not: 'CANCELLED' }
      },
      include: {
        ipLogs: {
          select: {
            id: true,
            ipAddress: true,
            clickedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to match frontend interface
    const transformedSessions = sessions.map((session: any) => {
      const inputData = session.inputData as any;
      const outputData = session.outputData as any;
      
      // Calculate unique IPs
      const uniqueIPs = new Set(session.ipLogs.map((log: any) => log.ipAddress)).size;
      
      return {
        id: session.id,
        name: inputData.name || 'Unnamed Session',
        description: inputData.description || '',
        trackingUrl: outputData?.trackingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/track/${session.sessionId}`,
        redirectUrl: inputData.redirectUrl,
        isActive: session.status === 'COMPLETED' || session.status === 'PROCESSING',
        clickCount: session.ipLogs.length,
        uniqueIPs,
        createdAt: session.createdAt.toISOString(),
        expiresAt: inputData.expiresAt ? new Date(inputData.expiresAt).toISOString() : undefined
      };
    });

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error('Error fetching IP logger sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/security/ip-logger/sessions - Create new IP logger session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'user1', name, description, redirectUrl, expiresIn } = body; // Get userId from auth in real app

    if (!name || !redirectUrl) {
      return NextResponse.json(
        { error: 'Name and redirect URL are required' },
        { status: 400 }
      );
    }

    // Get or create IP_LOGGER tool
    let tool = await (prisma as any).securityTool.findFirst({
      where: { type: 'IP_LOGGER' }
    });

    if (!tool) {
      tool = await (prisma as any).securityTool.create({
        data: {
          name: 'IP Logger',
          type: 'IP_LOGGER',
          description: 'Generate tracking links to log IP addresses and gather visitor information',
          isActive: true
        }
      });
    }

    // Generate unique session ID
    const sessionId = `ip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expiration date
    let expiresAt = null;
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresIn);
    }

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/track/${sessionId}`;

    // Create session in database
    const session = await (prisma as any).securityToolUsage.create({
      data: {
        toolId: tool.id,
        userId,
        sessionId,
        inputData: {
          name,
          description,
          redirectUrl,
          expiresAt: expiresAt?.toISOString(),
          expiresIn
        },
        outputData: {
          trackingUrl,
          sessionId
        },
        status: 'PROCESSING'
      }
    });

    return NextResponse.json({
      id: session.id,
      name,
      description,
      trackingUrl,
      redirectUrl,
      isActive: true,
      clickCount: 0,
      uniqueIPs: 0,
      createdAt: session.createdAt.toISOString(),
      expiresAt: expiresAt?.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating IP logger session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

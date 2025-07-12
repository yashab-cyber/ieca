import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import net from 'net';

const prisma = new PrismaClient();

interface PortScanResult {
  port: number;
  isOpen: boolean;
  service?: string;
  banner?: string;
  responseTime: number;
}

interface PortScanRequest {
  target: string;
  ports: number[];
  timeout?: number;
  scanType?: 'tcp' | 'udp';
}

// Common port-to-service mapping
const COMMON_SERVICES: { [key: number]: string } = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  993: 'IMAPS',
  995: 'POP3S',
  3389: 'RDP',
  5432: 'PostgreSQL',
  3306: 'MySQL',
  1433: 'SQL Server',
  6379: 'Redis',
  27017: 'MongoDB'
};

async function scanPort(target: string, port: number, timeout: number = 3000): Promise<PortScanResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const socket = new net.Socket();
    
    socket.setTimeout(timeout);
    
    socket.connect(port, target, () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        port,
        isOpen: true,
        service: COMMON_SERVICES[port],
        responseTime
      });
    });
    
    socket.on('error', () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        port,
        isOpen: false,
        responseTime
      });
    });
    
    socket.on('timeout', () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        port,
        isOpen: false,
        responseTime
      });
    });
  });
}

function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
}

export async function POST(request: NextRequest) {
  try {
    const body: PortScanRequest = await request.json();
    const { target, ports, timeout = 3000, scanType = 'tcp' } = body;

    // Validate input
    if (!target || !ports || ports.length === 0) {
      return NextResponse.json(
        { error: 'Target and ports are required' },
        { status: 400 }
      );
    }

    // Validate target format
    if (!isValidIP(target) && !isValidDomain(target)) {
      return NextResponse.json(
        { error: 'Invalid target format. Please provide a valid IP address or domain name.' },
        { status: 400 }
      );
    }

    // Limit port scan to prevent abuse
    if (ports.length > 1000) {
      return NextResponse.json(
        { error: 'Too many ports specified. Maximum 1000 ports allowed.' },
        { status: 400 }
      );
    }

    // Validate port numbers
    const invalidPorts = ports.filter(port => port < 1 || port > 65535);
    if (invalidPorts.length > 0) {
      return NextResponse.json(
        { error: `Invalid port numbers: ${invalidPorts.join(', ')}` },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    // Perform port scan with concurrency limit
    const concurrencyLimit = 50; // Limit concurrent connections
    const results: PortScanResult[] = [];
    
    for (let i = 0; i < ports.length; i += concurrencyLimit) {
      const batch = ports.slice(i, i + concurrencyLimit);
      const batchResults = await Promise.all(
        batch.map(port => scanPort(target, port, timeout))
      );
      results.push(...batchResults);
    }

    const endTime = Date.now();
    const scanDuration = endTime - startTime;

    // Count open/closed ports
    const openPorts = results.filter(r => r.isOpen);
    const closedPorts = results.filter(r => !r.isOpen);

    // Log the scan to database
    try {
      await (prisma as any).securityScan.create({
        data: {
          scanType: 'PORT_SCAN',
          target,
          userId: 'user1', // Replace with actual user ID from auth
          status: 'COMPLETED',
          results: JSON.stringify({
            target,
            scanType,
            totalPorts: ports.length,
            openPorts: openPorts.length,
            closedPorts: closedPorts.length,
            scanDuration,
            results
          }),
          startedAt: new Date(startTime),
          completedAt: new Date(endTime)
        }
      });
    } catch (dbError) {
      console.error('Error logging scan to database:', dbError);
      // Continue with response even if logging fails
    }

    return NextResponse.json({
      success: true,
      scan: {
        target,
        scanType,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: scanDuration,
        totalPorts: ports.length,
        openPorts: openPorts.length,
        closedPorts: closedPorts.length,
        results: results.sort((a, b) => a.port - b.port)
      }
    });

  } catch (error) {
    console.error('Port scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error during port scan' },
      { status: 500 }
    );
  }
}

// Get scan history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1';
    const limit = parseInt(searchParams.get('limit') || '10');

    const scans = await (prisma as any).securityScan.findMany({
      where: {
        userId,
        scanType: 'PORT_SCAN'
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      scans: scans.map((scan: any) => ({
        id: scan.id,
        target: scan.target,
        status: scan.status,
        startTime: scan.startedAt?.toISOString(),
        endTime: scan.completedAt?.toISOString(),
        duration: scan.completedAt && scan.startedAt 
          ? scan.completedAt.getTime() - scan.startedAt.getTime() 
          : null,
        results: scan.results ? JSON.parse(scan.results) : null
      }))
    });

  } catch (error) {
    console.error('Error fetching port scan history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}

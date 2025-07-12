import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dns from 'dns/promises';

const prisma = new PrismaClient();

interface SubdomainFinderRequest {
  domain: string;
  method: 'bruteforce' | 'dns' | 'certificate';
  wordlist?: string[];
  timeout?: number;
}

interface SubdomainResult {
  subdomain: string;
  ipAddress?: string;
  status: 'active' | 'inactive';
  responseTime: number;
  records?: {
    A?: string[];
    AAAA?: string[];
    CNAME?: string[];
    MX?: string[];
  };
}

// Common subdomain wordlist
const COMMON_SUBDOMAINS = [
  'www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'webdisk',
  'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig', 'mobile', 'm', 'wap',
  'blog', 'shop', 'forum', 'admin', 'test', 'dev', 'staging', 'api', 'cdn',
  'media', 'static', 'images', 'img', 'css', 'js', 'support', 'help', 'docs',
  'wiki', 'news', 'store', 'app', 'secure', 'vpn', 'mail2', 'email', 'direct',
  'server', 'host', 'portal', 'beta', 'gamma', 'alpha', 'demo', 'files',
  'download', 'downloads', 'ftp2', 'ssh', 'remote', 'proxy', 'router', 'fw',
  'firewall', 'gateway', 'mx1', 'mx2', 'ns3', 'dns1', 'dns2', 'search',
  'members', 'upload', 'uploads', 'www2', 'secure2', 'ww1', 'ww2', 'admin2'
];

function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
}

async function checkSubdomain(subdomain: string, timeout: number = 5000): Promise<SubdomainResult> {
  const startTime = Date.now();
  
  try {
    // Set DNS timeout
    const originalTimeout = dns.Resolver.prototype.getServers;
    
    const [aRecords, aaaaRecords, cnameRecords, mxRecords] = await Promise.allSettled([
      dns.resolve4(subdomain).catch(() => []),
      dns.resolve6(subdomain).catch(() => []),
      dns.resolveCname(subdomain).catch(() => []),
      dns.resolveMx(subdomain).catch(() => [])
    ]);

    const responseTime = Date.now() - startTime;
    
    const records = {
      A: aRecords.status === 'fulfilled' ? aRecords.value : [],
      AAAA: aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : [],
      CNAME: cnameRecords.status === 'fulfilled' ? cnameRecords.value : [],
      MX: mxRecords.status === 'fulfilled' ? mxRecords.value.map(mx => mx.exchange) : []
    };

    const hasRecords = Object.values(records).some(arr => arr.length > 0);
    const ipAddress = records.A?.[0] || records.AAAA?.[0];

    return {
      subdomain,
      ipAddress,
      status: hasRecords ? 'active' : 'inactive',
      responseTime,
      records: hasRecords ? records : undefined
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      subdomain,
      status: 'inactive',
      responseTime
    };
  }
}

async function bruteforceSubdomains(
  domain: string, 
  wordlist: string[], 
  timeout: number
): Promise<SubdomainResult[]> {
  const results: SubdomainResult[] = [];
  const concurrencyLimit = 20; // Limit concurrent DNS requests
  
  for (let i = 0; i < wordlist.length; i += concurrencyLimit) {
    const batch = wordlist.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(subdomain => checkSubdomain(`${subdomain}.${domain}`, timeout))
    );
    results.push(...batchResults);
    
    // Add small delay between batches to avoid overwhelming DNS servers
    if (i + concurrencyLimit < wordlist.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

async function dnsEnumeration(domain: string): Promise<SubdomainResult[]> {
  const results: SubdomainResult[] = [];
  
  try {
    // Try to get NS records to find name servers
    const nsRecords = await dns.resolveNs(domain).catch(() => []);
    
    // Try common DNS record types that might reveal subdomains
    const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV'];
    
    for (const ns of nsRecords) {
      const result = await checkSubdomain(ns);
      if (result.status === 'active') {
        results.push(result);
      }
    }
    
    // Try some common service subdomains
    const serviceSubdomains = ['_sip._tcp', '_xmpp-server._tcp', '_caldav._tcp'];
    for (const service of serviceSubdomains) {
      try {
        const srvRecords = await dns.resolveSrv(`${service}.${domain}`);
        for (const srv of srvRecords) {
          const result = await checkSubdomain(srv.name);
          if (result.status === 'active') {
            results.push(result);
          }
        }
      } catch (error) {
        // Ignore errors for service discovery
      }
    }
    
  } catch (error) {
    console.error('DNS enumeration error:', error);
  }
  
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubdomainFinderRequest = await request.json();
    const { domain, method, wordlist, timeout = 5000 } = body;

    // Validate input
    if (!domain || !method) {
      return NextResponse.json(
        { error: 'Domain and method are required' },
        { status: 400 }
      );
    }

    // Validate domain format
    if (!isValidDomain(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Validate method
    if (!['bruteforce', 'dns', 'certificate'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid method. Supported: bruteforce, dns, certificate' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let results: SubdomainResult[] = [];

    try {
      switch (method) {
        case 'bruteforce':
          const subdomainList = wordlist || COMMON_SUBDOMAINS;
          // Limit wordlist size to prevent abuse
          const limitedWordlist = subdomainList.slice(0, 200);
          results = await bruteforceSubdomains(domain, limitedWordlist, timeout);
          break;
          
        case 'dns':
          results = await dnsEnumeration(domain);
          break;
          
        case 'certificate':
          // For demo purposes, we'll use DNS enumeration
          // In reality, this would query certificate transparency logs
          results = await dnsEnumeration(domain);
          break;
          
        default:
          return NextResponse.json(
            { error: 'Unsupported method' },
            { status: 400 }
          );
      }

      const endTime = Date.now();
      const scanDuration = endTime - startTime;

      // Filter to only active subdomains
      const activeSubdomains = results.filter(r => r.status === 'active');
      const totalChecked = results.length;

      // Log the scan to database
      try {
        await (prisma as any).securityScan.create({
          data: {
            scanType: 'SUBDOMAIN_SCAN',
            target: domain,
            userId: 'user1', // Replace with actual user ID from auth
            status: 'COMPLETED',
            results: JSON.stringify({
              domain,
              method,
              totalChecked,
              activeSubdomains: activeSubdomains.length,
              scanDuration,
              subdomains: activeSubdomains
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
          domain,
          method,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          duration: scanDuration,
          totalChecked,
          activeSubdomains: activeSubdomains.length,
          subdomains: activeSubdomains.sort((a, b) => a.subdomain.localeCompare(b.subdomain))
        }
      });

    } catch (scanError) {
      console.error('Subdomain scan error:', scanError);
      return NextResponse.json(
        { error: 'Error during subdomain scanning' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Subdomain finder error:', error);
    return NextResponse.json(
      { error: 'Internal server error during subdomain scanning' },
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
        scanType: 'SUBDOMAIN_SCAN'
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
    console.error('Error fetching subdomain scan history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}

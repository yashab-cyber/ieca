import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /track/[sessionId] - Handle tracking link clicks and log IP information
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    
    // Find the IP logger session using the session ID
    // For now, we'll create a simple tracking mechanism
    // In a real implementation, you'd have a dedicated tracking sessions table
    
    // For demo purposes, let's use a default redirect URL
    const redirectUrl = 'https://github.com/OWASP/owasp-top-ten';

    
    // Extract visitor information
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer');
    
    // Get geo information (in a real app, you'd use a service like ipapi.co or MaxMind)
    const geoInfo = await getGeoInfo(ip);
    
    // Parse user agent for device info
    const deviceInfo = parseUserAgent(userAgent);

    // Log the visit - for now we'll just log to console since we don't have the exact model structure
    try {
      console.log('Tracking click:', {
        sessionId,
        targetUrl: redirectUrl,
        ipAddress: ip,
        userAgent,
        country: geoInfo.country,
        city: geoInfo.city,
        region: geoInfo.region,
        timezone: geoInfo.timezone,
        isp: geoInfo.isp,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        referer,
        clickedAt: new Date(),
        metadata: {
          headers: Object.fromEntries(request.headers.entries()),
          url: request.url
        }
      });
    } catch (logError) {
      console.error('Error logging IP entry:', logError);
      // Continue with redirect even if logging fails
    }

    // Redirect to the target URL
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling tracking request:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Fallback to localhost for development
  return '127.0.0.1';
}

async function getGeoInfo(ip: string) {
  // In a real application, use a service like:
  // - ipapi.co
  // - ip-api.com
  // - MaxMind GeoIP2
  // - ipgeolocation.io
  
  try {
    // Mock implementation - replace with real service
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Unknown',
        city: 'Local Network',
        region: 'Unknown',
        timezone: 'Unknown',
        isp: 'Local ISP'
      };
    }

    // Example using ip-api.com (free tier, no API key required)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone,isp`, {
      headers: { 'User-Agent': 'IECA Security Tools' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
          timezone: data.timezone || 'Unknown',
          isp: data.isp || 'Unknown'
        };
      }
    }
  } catch (error) {
    console.error('Error fetching geo info:', error);
  }

  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    timezone: 'Unknown',
    isp: 'Unknown'
  };
}

function parseUserAgent(userAgent: string) {
  // Simple user agent parsing - in production, use a library like ua-parser-js
  const ua = userAgent.toLowerCase();
  
  let device = 'Desktop';
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect device
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }

  // Detect browser
  if (ua.includes('chrome') && !ua.includes('edge')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
  } else if (ua.includes('opera')) {
    browser = 'Opera';
  }

  // Detect OS
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }

  return { device, browser, os };
}

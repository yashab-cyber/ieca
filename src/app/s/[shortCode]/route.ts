import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import * as crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = await params;
    
    if (!shortCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Find the shortened URL
    const shortenedUrl = await (prisma as any).shortenedUrl.findFirst({
      where: { shortCode }
    });

    if (!shortenedUrl) {
      return new NextResponse('Shortened URL not found', { status: 404 });
    }

    // Check if URL is active
    if (!shortenedUrl.isActive) {
      return new NextResponse('This link has been disabled', { status: 410 });
    }

    // Check if URL has expired
    if (shortenedUrl.expiresAt && new Date() > shortenedUrl.expiresAt) {
      return new NextResponse('This link has expired', { status: 410 });
    }

    // Check if URL is password protected
    if (shortenedUrl.password) {
      const { searchParams } = new URL(request.url);
      const providedPassword = searchParams.get('password');
      
      if (!providedPassword) {
        // Return password prompt page
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Password Required</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  max-width: 400px; 
                  margin: 100px auto; 
                  padding: 20px;
                  background: #f8fafc;
                }
                .container {
                  background: white;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                h1 { color: #1f2937; margin-bottom: 20px; }
                input[type="password"] {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  margin-bottom: 15px;
                  font-size: 16px;
                }
                button {
                  width: 100%;
                  padding: 12px;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-size: 16px;
                  cursor: pointer;
                }
                button:hover { background: #2563eb; }
                .description { color: #6b7280; margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🔒 Password Required</h1>
                ${shortenedUrl.description ? `<p class="description">${shortenedUrl.description}</p>` : ''}
                <form method="GET">
                  <input type="password" name="password" placeholder="Enter password" required autofocus>
                  <button type="submit">Access Link</button>
                </form>
              </div>
            </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Verify password
      const hashedPassword = crypto.createHash('sha256').update(providedPassword).digest('hex');
      if (hashedPassword !== shortenedUrl.password) {
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invalid Password</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  max-width: 400px; 
                  margin: 100px auto; 
                  padding: 20px;
                  background: #f8fafc;
                }
                .container {
                  background: white;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                h1 { color: #dc2626; margin-bottom: 20px; }
                .error { color: #dc2626; margin-bottom: 20px; }
                input[type="password"] {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #fca5a5;
                  border-radius: 6px;
                  margin-bottom: 15px;
                  font-size: 16px;
                }
                button {
                  width: 100%;
                  padding: 12px;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-size: 16px;
                  cursor: pointer;
                }
                button:hover { background: #2563eb; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>❌ Invalid Password</h1>
                <p class="error">The password you entered is incorrect.</p>
                <form method="GET">
                  <input type="password" name="password" placeholder="Enter password" required autofocus>
                  <button type="submit">Try Again</button>
                </form>
              </div>
            </body>
          </html>
        `, {
          status: 401,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // Update click count
    await (prisma as any).shortenedUrl.update({
      where: { id: shortenedUrl.id },
      data: { clicks: { increment: 1 } }
    });

    // Log the click for analytics (optional)
    try {
      const userAgent = request.headers.get('user-agent') || '';
      const referer = request.headers.get('referer') || '';
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

      // You could log this to a separate clicks table for analytics
      console.log(`Click tracked: ${shortCode} from ${ipAddress}`);
    } catch (error) {
      console.error('Error logging click:', error);
    }

    // Redirect to original URL
    return NextResponse.redirect(shortenedUrl.originalUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

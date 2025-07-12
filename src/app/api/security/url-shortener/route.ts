import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface ShortenRequest {
  url: string;
  customAlias?: string;
  expiresIn?: number; // hours
  password?: string;
  description?: string;
}

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  customAlias?: string;
  description?: string;
  isActive: boolean;
  hasPassword: boolean;
  expiresAt?: string;
  createdAt: string;
}

function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z0-9-_]{3,20}$/.test(alias);
}

export async function POST(request: NextRequest) {
  try {
    const body: ShortenRequest = await request.json();
    const { url, customAlias, expiresIn, password, description } = body;

    // Validate input
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Must include http:// or https://' },
        { status: 400 }
      );
    }

    // Validate custom alias if provided
    if (customAlias && !isValidAlias(customAlias)) {
      return NextResponse.json(
        { error: 'Custom alias must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    // Check if custom alias is already taken
    if (customAlias) {
      const existing = await (prisma as any).shortenedUrl.findFirst({
        where: {
          OR: [
            { shortCode: customAlias },
            { customAlias: customAlias }
          ]
        }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Custom alias is already taken' },
          { status: 409 }
        );
      }
    }

    // Generate unique short code if no custom alias
    let shortCode = customAlias;
    if (!shortCode) {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts++;
        
        const existing = await (prisma as any).shortenedUrl.findFirst({
          where: { shortCode }
        });
        
        if (!existing) break;
        
        if (attempts > 10) {
          shortCode = generateShortCode(8); // Use longer code
          break;
        }
      } while (attempts <= 10);
    }

    // Calculate expiration date
    let expiresAt: Date | undefined;
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date(Date.now() + (expiresIn * 60 * 60 * 1000));
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    }

    // Create shortened URL record
    const shortenedUrl = await (prisma as any).shortenedUrl.create({
      data: {
        originalUrl: url,
        shortCode,
        customAlias,
        description,
        password: hashedPassword,
        expiresAt,
        userId: 'user1', // Replace with actual user ID from auth
        isActive: true,
        clicks: 0
      }
    });

    const response: ShortenedUrl = {
      id: shortenedUrl.id,
      originalUrl: shortenedUrl.originalUrl,
      shortCode: shortenedUrl.shortCode,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/s/${shortenedUrl.shortCode}`,
      clicks: shortenedUrl.clicks,
      customAlias: shortenedUrl.customAlias || undefined,
      description: shortenedUrl.description || undefined,
      isActive: shortenedUrl.isActive,
      hasPassword: !!shortenedUrl.password,
      expiresAt: shortenedUrl.expiresAt?.toISOString(),
      createdAt: shortenedUrl.createdAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      url: response
    });

  } catch (error) {
    console.error('URL shortening error:', error);
    return NextResponse.json(
      { error: 'Internal server error during URL shortening' },
      { status: 500 }
    );
  }
}

// Get user's shortened URLs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1';
    const limit = parseInt(searchParams.get('limit') || '20');
    const shortCode = searchParams.get('shortCode');

    if (shortCode) {
      // Get specific URL details
      const url = await (prisma as any).shortenedUrl.findFirst({
        where: { shortCode }
      });

      if (!url) {
        return NextResponse.json(
          { error: 'Shortened URL not found' },
          { status: 404 }
        );
      }

      const response: ShortenedUrl = {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/s/${url.shortCode}`,
        clicks: url.clicks,
        customAlias: url.customAlias || undefined,
        description: url.description || undefined,
        isActive: url.isActive,
        hasPassword: !!url.password,
        expiresAt: url.expiresAt?.toISOString(),
        createdAt: url.createdAt.toISOString()
      };

      return NextResponse.json({
        success: true,
        url: response
      });
    }

    // Get user's URLs
    const urls = await (prisma as any).shortenedUrl.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const response = urls.map((url: any) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/s/${url.shortCode}`,
      clicks: url.clicks,
      customAlias: url.customAlias || undefined,
      description: url.description || undefined,
      isActive: url.isActive,
      hasPassword: !!url.password,
      expiresAt: url.expiresAt?.toISOString(),
      createdAt: url.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      urls: response
    });

  } catch (error) {
    console.error('Error fetching shortened URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}

// Update shortened URL
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get('shortCode');
    const body = await request.json();

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    const url = await (prisma as any).shortenedUrl.findFirst({
      where: { shortCode }
    });

    if (!url) {
      return NextResponse.json(
        { error: 'Shortened URL not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updateData: any = {};
    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    const updatedUrl = await (prisma as any).shortenedUrl.update({
      where: { id: url.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'URL updated successfully'
    });

  } catch (error) {
    console.error('Error updating shortened URL:', error);
    return NextResponse.json(
      { error: 'Failed to update URL' },
      { status: 500 }
    );
  }
}

// Delete shortened URL
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get('shortCode');

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    const url = await (prisma as any).shortenedUrl.findFirst({
      where: { shortCode }
    });

    if (!url) {
      return NextResponse.json(
        { error: 'Shortened URL not found' },
        { status: 404 }
      );
    }

    await (prisma as any).shortenedUrl.delete({
      where: { id: url.id }
    });

    return NextResponse.json({
      success: true,
      message: 'URL deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shortened URL:', error);
    return NextResponse.json(
      { error: 'Failed to delete URL' },
      { status: 500 }
    );
  }
}

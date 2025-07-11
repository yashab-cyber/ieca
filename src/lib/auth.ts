import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Middleware to verify JWT token
export async function authenticateUser(request: NextRequest): Promise<{ user: any } | { error: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Get user from database
    const user = await userService.getUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      return { error: 'User not found or inactive' };
    }

    return { user };

  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid token' };
  }
}

// Middleware to check if user has admin role
export function requireAdmin(user: any): boolean {
  return user && (user.role === 'ADMIN' || user.role === 'MODERATOR');
}

// Helper function to create JWT token
export function createToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

// Helper function to handle authentication errors
export function createAuthErrorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  }, { status: 401 });
}

// Helper function to handle authorization errors
export function createAuthorizationErrorResponse(message: string = 'Access denied') {
  return NextResponse.json({
    success: false,
    message,
  }, { status: 403 });
}

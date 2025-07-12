import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // Get current user (for now using hardcoded email, in production this should come from JWT)
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user statistics
    const stats = await userService.getUserStats(user.id);

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user stats' },
      { status: 500 }
    );
  }
}

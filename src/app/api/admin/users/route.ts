import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['MEMBER', 'MODERATOR', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const users = await userService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        profile: user.profile,
      })),
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const body = await request.json();
    const { action, userId, ...userData } = body;

    switch (action) {
      case 'toggleStatus':
        const updatedUser = await userService.updateUserProfile(userId, { 
          isActive: !userData.currentStatus 
        });
        
        return NextResponse.json({
          success: true,
          message: `User ${!userData.currentStatus ? 'activated' : 'deactivated'} successfully`,
          data: updatedUser,
        });

      case 'updateRole':
        const validatedData = updateUserSchema.parse(userData);
        const userWithNewRole = await userService.updateUserProfile(userId, validatedData);
        
        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          data: userWithNewRole,
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action',
        }, { status: 400 });
    }

  } catch (error) {
    console.error('User management error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  skills: z.array(z.string()),
});

export async function GET() {
  try {
    // In a real app, you would get the user ID from the JWT token
    // For now, we'll use the admin user from localStorage or session
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        linkedin: user.linkedin,
        github: user.github,
        bio: user.profile?.bio,
        skills: user.profile?.skills || [],
        avatar: user.profile?.avatar,
        joinedAt: user.profile?.joinedAt,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profileData = updateProfileSchema.parse(body);
    
    // In a real app, you would get the user ID from the JWT token
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await userService.updateUserProfile(user.id, {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      linkedin: profileData.linkedin,
      github: profileData.github,
      bio: profileData.bio,
      skills: profileData.skills,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid LinkedIn URL"
  }),
  github: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid GitHub URL"
  }),
  bio: z.string().optional(),
  skills: z.array(z.string()),
});

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers (set by authentication middleware)
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // For now, we'll use a fallback to get the current user
    // In production, this should come from JWT token verification
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
        experience: user.profile?.experience,
        location: user.profile?.location,
        website: user.profile?.website,
        isPublic: user.profile?.isPublic,
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
    
    // Get the current user
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Use the new complete profile update function
    const updatedUser = await userService.updateCompleteUserProfile(user.id, {
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
      message: 'Profile updated successfully',
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        linkedin: updatedUser?.linkedin,
        github: updatedUser?.github,
        bio: updatedUser?.profile?.bio,
        skills: updatedUser?.profile?.skills || [],
        avatar: updatedUser?.profile?.avatar,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large (max 5MB)' },
        { status: 400 }
      );
    }

    // Get current user (for now using hardcoded email, in production this should come from JWT)
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (dirError) {
      console.error('Directory creation error:', dirError);
      // Directory might already exist, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `avatar-${user.id}-${timestamp}-${randomId}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Write file to disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log('Avatar file written successfully:', filePath);
    } catch (fileError) {
      console.error('File write error:', fileError);
      return NextResponse.json(
        { success: false, message: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Update user profile with new avatar URL
    const avatarUrl = `/uploads/avatars/${fileName}`;
    try {
      const updatedUser = await userService.updateCompleteUserProfile(user.id, {
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
        linkedin: user.linkedin || undefined,
        github: user.github || undefined,
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        avatar: avatarUrl, // Add avatar URL
      });

      return NextResponse.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatarUrl,
        user: updatedUser
      });
    } catch (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update profile with new avatar' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

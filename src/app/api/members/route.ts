import { NextResponse } from 'next/server';
import { userService } from '@/lib/services';

export async function GET() {
  try {
    const members = await userService.getMembers();
    
    // Transform the data for the frontend
    const transformedMembers = members.map((member: any) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      avatar: member.profile?.avatar,
      skills: member.profile?.skills || [],
      bio: member.profile?.bio,
      linkedin: member.linkedin,
      github: member.github,
      isPublic: member.profile?.isPublic || false,
      joinedAt: member.profile?.joinedAt,
      online: Math.random() > 0.5, // Random online status for demo
    }));

    return NextResponse.json({
      success: true,
      members: transformedMembers,
    });

  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get members' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // Get all members with their profiles for leaderboard
    const members = await userService.getMembers();
    
    // Sort by points (from profile) and add rank
    const leaderboard = members
      .filter(member => member.profile?.points && member.profile.points > 0)
      .sort((a, b) => (b.profile?.points || 0) - (a.profile?.points || 0))
      .map((member, index) => ({
        rank: index + 1,
        id: member.id,
        name: member.name,
        points: member.profile?.points || 0,
        reputation: member.profile?.reputation || 0,
        rank_title: member.profile?.rank || 'Member',
        completedMissions: Math.floor((member.profile?.points || 0) / 200), // Estimate missions based on points
        avatar: `https://placehold.co/100x100.png`,
      }));

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}


'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Trophy, TrendingUp, Loader2, Shield, Zap, FileText, MessageSquare, Calendar, Activity, User } from 'lucide-react';

interface LeaderboardMember {
  rank: number;
  id: string;
  name: string;
  points: number;
  reputation: number;
  rank_title: string;
  completedMissions: number;
  avatar: string;
  securityUsage: number;
  securityScans: number;
  vulnerabilityReports: number;
  blogPosts: number;
  chatMessages: number;
  joinedAt: string;
  lastActive?: string;
}

const rankColors: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-gray-400',
    3: 'text-orange-400',
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0 });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        if (data.success) {
          setLeaderboardData(data.data);
          setStats({
            totalMembers: data.totalMembers || 0,
            activeMembers: data.activeMembers || 0,
          });
        } else {
          setError(data.message || 'Failed to load leaderboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Trophy className="h-4 w-4" />;
    if (rank === 3) return <Trophy className="h-4 w-4" />;
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 md:py-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 md:py-20">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Leaderboard</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const restOfBoard = leaderboardData.slice(3);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="text-center mb-8">
        <Trophy className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Leaderboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Recognizing the dedication and impact of our top cybersecurity contributors.
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.activeMembers}</div>
            <div className="text-sm text-muted-foreground">Active Contributors</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.open('/portal/profile', '_blank')}
            >
              <User className="h-3 w-3 mr-1" />
              View My Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topThree.map((member, index) => (
          <Card key={member.rank} className={`relative overflow-hidden ${index === 0 ? 'border-primary shadow-lg scale-105' : ''}`}>
            {index === 0 && <Crown className="absolute -top-2 -right-2 h-12 w-12 text-yellow-400 opacity-30" />}
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-20 w-20 mb-3 border-4 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-lg font-bold">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`absolute -top-2 -left-2 flex items-center justify-center h-8 w-8 rounded-full bg-background border-2 font-bold ${getRankColor(member.rank)}`}>
                  {getRankIcon(member.rank) || member.rank}
                </div>
              </div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <Badge variant="secondary" className="mb-2">{member.rank_title}</Badge>
              <CardDescription className="font-bold text-xl text-primary">
                {member.points.toLocaleString()} pts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>{member.securityUsage}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>{member.securityScans}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{member.vulnerabilityReports}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{member.blogPosts}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {member.completedMissions} missions • {member.reputation} reputation
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>Detailed member standings based on cybersecurity activities and contributions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-center">Tools</TableHead>
                  <TableHead className="text-center">Scans</TableHead>
                  <TableHead className="text-center">Reports</TableHead>
                  <TableHead className="text-center">Posts</TableHead>
                  <TableHead className="text-center">Reputation</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restOfBoard.map((member) => (
                  <TableRow key={member.rank}>
                    <TableCell>
                      <div className={`flex items-center gap-2 font-bold ${getRankColor(member.rank)}`}>
                        {getRankIcon(member.rank)}
                        <span>{member.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.rank_title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span>{member.securityUsage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3 text-green-500" />
                        <span>{member.securityScans}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="h-3 w-3 text-red-500" />
                        <span>{member.vulnerabilityReports}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-3 w-3 text-purple-500" />
                        <span>{member.blogPosts}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {member.reputation}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold text-primary">{member.points.toLocaleString()}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Activity Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Security Tools Used</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span>Security Scans</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-500" />
              <span>Vulnerability Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <span>Blog Posts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

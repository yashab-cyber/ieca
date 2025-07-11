
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Trophy, TrendingUp } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: "Arjun Sharma", points: 2580, missions: 12, avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
  { rank: 2, name: "Priya Singh", points: 2410, missions: 15, avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
  { rank: 3, name: "Vikram Rathore", points: 2250, missions: 10, avatar: "https://placehold.co/100x100.png", hint: "man portrait technology" },
  { rank: 4, name: "Aisha Khan", points: 2190, missions: 14, avatar: "https://placehold.co/100x100.png", hint: "woman professional" },
  { rank: 5, name: "Rohan Verma", points: 1980, missions: 9, avatar: "https://placehold.co/100x100.png", hint: "man developer" },
  { rank: 6, name: "Ananya Gupta", points: 1870, missions: 8, avatar: "https://placehold.co/100x100.png", hint: "woman portrait professional" },
  { rank: 7, name: "Siddharth Menon", points: 1750, missions: 7, avatar: "https://placehold.co/100x100.png", hint: "man glasses" },
  { rank: 8, name: "Neha Reddy", points: 1620, missions: 6, avatar: "https://placehold.co/100x100.png", hint: "woman developer" },
];

const rankColors: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-gray-400',
    3: 'text-orange-400',
};

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3);
  const restOfBoard = leaderboardData.slice(3);

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <Trophy className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Leaderboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Recognizing the dedication and impact of our top volunteer contributors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {topThree.map((member, index) => (
          <Card key={member.rank} className={`relative overflow-hidden ${index === 0 ? 'border-primary shadow-lg' : ''}`}>
             {index === 0 && <Crown className="absolute -top-4 -right-4 h-16 w-16 text-yellow-400 opacity-20" />}
            <CardHeader className="text-center items-center">
                <div className="relative">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div className={`absolute -top-2 -left-2 flex items-center justify-center h-10 w-10 rounded-full bg-background font-bold text-2xl ${rankColors[member.rank]}`}>
                        {member.rank}
                    </div>
                </div>
              <CardTitle className="font-headline">{member.name}</CardTitle>
              <CardDescription className="font-bold text-lg text-primary">{member.points.toLocaleString()} Points</CardDescription>
            </CardHeader>
             <CardContent className="text-center text-sm text-muted-foreground">
                <p>{member.missions} missions completed</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>Overall member standings based on contribution points.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-right">Missions</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restOfBoard.map((member) => (
                  <TableRow key={member.rank}>
                    <TableCell className="font-bold text-lg">{member.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{member.missions}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{member.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

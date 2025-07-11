
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Star, Mic } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function MemberDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  // Load members on component mount
  React.useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: "Error",
        description: "Unable to load member directory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Member Directory</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Connect with the talented volunteers powering IECA's mission.
        </p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Button variant="ghost" size="icon" className="absolute left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => toast({title: "Voice Search Clicked", description: "Voice search is not yet implemented."})}>
                <Mic className="h-5 w-5" />
                <span className="sr-only">Voice Search</span>
            </Button>
          <Input
            placeholder="Search by name or skill..."
            className="pl-20 text-lg h-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3" onClick={() => toast({title: "Advanced Filters Clicked", description: "Advanced filters are not yet implemented."})}>
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-muted-foreground hidden md:inline">Filters</span>
            </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg">Loading members...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="group text-center pt-6 bg-card hover:shadow-xl transition-shadow duration-300">
               <CardHeader className="relative flex flex-col items-center p-0">
                   <div className="relative">
                      <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                          <AvatarImage src={member.avatar || "https://placehold.co/100x100.png"} alt={member.name} className="rounded-full" />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member.online && <div className="absolute bottom-4 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" title="Online"></div>}
                   </div>
                   <Button variant="ghost" size="icon" className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast({title: "Favorite Clicked", description: `${member.name} has been added to your favorites.`})}>
                       <Star className="h-5 w-5" />
                       <span className="sr-only">Favorite Member</span>
                   </Button>
                  <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-medium text-sm">{member.role || 'IECA Member'}</p>
               </CardHeader>
              <CardContent className="mt-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {(member.skills || []).map((skill: string, index: number) => (
                    <Badge key={`${skill}-${index}`} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

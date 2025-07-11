
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Star, Mic } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const members = [
  { name: "Arjun Sharma", role: "Chief Security Architect", avatar: "https://placehold.co/100x100.png", hint: "man portrait", skills: ["Cloud Security", "Architecture"], online: true },
  { name: "Priya Singh", role: "Head of Threat Intelligence", avatar: "https://placehold.co/100x100.png", hint: "woman portrait", skills: ["Threat Intel", "OSINT"], online: true },
  { name: "Vikram Rathore", role: "Lead Penetration Tester", avatar: "https://placehold.co/100x100.png", hint: "man portrait technology", skills: ["Penetration Testing", "Red Teaming"], online: false },
  { name: "Ananya Gupta", role: "Cyber Forensics Expert", avatar: "https://placehold.co/100x100.png", hint: "woman portrait professional", skills: ["Forensics", "Incident Response"], online: true },
  { name: "Rohan Verma", role: "Penetration Tester", avatar: "https://placehold.co/100x100.png", hint: "man developer", skills: ["Penetration Testing", "Web Apps"], online: false },
  { name: "Aisha Khan", role: "Incident Responder", avatar: "https://placehold.co/100x100.png", hint: "woman professional", skills: ["Incident Response", "Malware Analysis"], online: true },
];

export default function MemberDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.name} className="group text-center pt-6 bg-card hover:shadow-xl transition-shadow duration-300">
             <CardHeader className="relative flex flex-col items-center p-0">
                 <div className="relative">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} className="rounded-full" />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.online && <div className="absolute bottom-4 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" title="Online"></div>}
                 </div>
                 <Button variant="ghost" size="icon" className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast({title: "Favorite Clicked", description: `${member.name} has been added to your favorites.`})}>
                     <Star className="h-5 w-5" />
                     <span className="sr-only">Favorite Member</span>
                 </Button>
                <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                <p className="text-primary font-medium text-sm">{member.role}</p>
             </CardHeader>
            <CardContent className="mt-4">
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

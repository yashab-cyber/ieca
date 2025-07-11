
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Award, Target, ShieldCheck, Zap } from "lucide-react";
import React from 'react';

const skills = [
  { id: "pentesting", label: "Penetration Testing" },
  { id: "forensics", label: "Digital Forensics" },
  { id: "malware", label: "Malware Analysis" },
  { id: "cloud", label: "Cloud Security" },
  { id: "incident", label: "Incident Response" },
  { id: "threat", label: "Threat Intelligence" },
  { id: "osint", label: "OSINT" },
  { id: "red-teaming", label: "Red Teaming" },
] as const;

const badges = [
    { icon: Award, title: "Top Contributor", description: "Awarded for being in the top 10% of contributors for a quarter." },
    { icon: Target, title: "Mission Specialist", description: "Successfully completed 5 critical incident responses." },
    { icon: ShieldCheck, title: "Community Defender", description: "Resolved 25+ community-reported vulnerabilities." },
    { icon: Zap, title: "Rapid Responder", description: "Acknowledged for exceptional speed in incident response." },
];


const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
  linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal('')),
  github: z.string().url("Please enter a valid GitHub URL.").optional().or(z.literal('')),
  skills: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one skill.",
  }),
  bio: z.string().max(500).optional(),
});


export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [profileLoading, setProfileLoading] = React.useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      skills: [],
      bio: "",
    },
  });

  // Load user profile on component mount
  React.useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        const user = data.user;
        form.reset({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
          skills: user.skills || [],
          bio: user.bio || "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Unable to load profile data",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your information has been successfully saved.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto py-12 md:py-20">
        <div className="text-center">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Your Profile</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Keep your information up to date to help us match you with the right missions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          
          <Card>
            <CardHeader>
                <CardTitle>Achievements & Stats</CardTitle>
                <CardDescription>Your contributions and recognitions within the IECA community.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Rank</p>
                        <p className="text-2xl font-bold">#12</p>
                    </div>
                     <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Points</p>
                        <p className="text-2xl font-bold">1,840</p>
                    </div>
                     <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Missions</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                     <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Badges</p>
                        <p className="text-2xl font-bold">{badges.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => {
                        const Icon = badge.icon;
                        return (
                             <div key={badge.title} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                                <Icon className="h-8 w-8 text-primary"/>
                                <div>
                                    <h4 className="font-bold text-sm">{badge.title}</h4>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                             </div>
                        )
                    })}
                </div>

            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed on your public profile within the portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
               <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Priya Singh" data-ai-hint="woman portrait professional" />
                    <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <div className="flex gap-2">
                        <Input id="picture" type="file" className="max-w-xs" />
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB.</p>
                </div>
               </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Priya Singh" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="priya.singh@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Short Bio</FormLabel>
                        <FormControl><Textarea placeholder="Tell everyone a little about yourself..." className="min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Select all areas where you have expertise. This helps in assigning tasks.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <FormField control={form.control} name="skills" render={() => (
                    <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.map((item) => (
                            <FormField key={item.id} control={form.control} name="skills" render={({ field }) => {
                                return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                (field.value || []).filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                                )
                            }} />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
              <CardDescription>Links to your professional profiles (optional).</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="linkedin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="github" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile</FormLabel>
                      <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
               </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


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
import { Upload, Award, Target, ShieldCheck, Zap, TrendingUp, Calendar, Activity, Users, MessageSquare, FileText, Clock, Trophy, ExternalLink, UserPlus } from "lucide-react";
import React from 'react';
import ChangePasswordCard from '@/components/change-password-card';

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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  linkedin: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Please enter a valid LinkedIn URL."
  }),
  github: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Please enter a valid GitHub URL."
  }),
  skills: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one skill.",
  }),
  bio: z.string().max(500).optional(),
});


export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [currentAvatar, setCurrentAvatar] = React.useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [userStats, setUserStats] = React.useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      const data = await response.json();
      
      if (data.success) {
        setUserStats(data.stats);
      } else {
        console.error('Failed to load user stats:', data.message);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        const user = data.user;
        setCurrentAvatar(user.avatar);
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPG, PNG, GIF, and WebP files are allowed.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Avatar must be smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setCurrentAvatar(result.avatarUrl);
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
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
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
                        <p className="text-2xl font-bold text-primary">#{userStats?.rank || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{userStats?.rankTitle || 'Rookie'}</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full text-xs"
                            onClick={() => window.open('/portal/leaderboard', '_blank')}
                        >
                            <Trophy className="h-3 w-3 mr-1" />
                            View Leaderboard
                        </Button>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border">
                        <div className="flex items-center justify-center mb-2">
                            <Award className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="text-2xl font-bold text-green-500">{userStats?.points?.toLocaleString() || 0}</p>
                        <p className="text-xs text-muted-foreground">{userStats?.reputation || 0} reputation</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border">
                        <div className="flex items-center justify-center mb-2">
                            <Target className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">Missions Completed</p>
                        <p className="text-2xl font-bold text-blue-500">{userStats?.missions || 0}</p>
                        <p className="text-xs text-muted-foreground">Total activities</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border">
                        <div className="flex items-center justify-center mb-2">
                            <ShieldCheck className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">Badges Earned</p>
                        <p className="text-2xl font-bold text-purple-500">{userStats?.badges || 0}</p>
                        <p className="text-xs text-muted-foreground">Achievements</p>
                    </div>
                </div>

                {/* Activity Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <ShieldCheck className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <p className="text-sm font-medium">{userStats?.activityBreakdown?.securityToolUsage || 0}</p>
                        <p className="text-xs text-muted-foreground">Security Tools</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <Zap className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <p className="text-sm font-medium">{userStats?.activityBreakdown?.securityScans || 0}</p>
                        <p className="text-xs text-muted-foreground">Security Scans</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <FileText className="h-5 w-5 mx-auto mb-1 text-red-500" />
                        <p className="text-sm font-medium">{userStats?.activityBreakdown?.vulnerabilityReports || 0}</p>
                        <p className="text-xs text-muted-foreground">Vuln Reports</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <MessageSquare className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <p className="text-sm font-medium">{userStats?.activityBreakdown?.blogPosts || 0}</p>
                        <p className="text-xs text-muted-foreground">Blog Posts</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                        <p className="text-sm font-medium">{userStats?.activityBreakdown?.chatMessages || 0}</p>
                        <p className="text-xs text-muted-foreground">Chat Messages</p>
                    </div>
                </div>

                {/* Achievement Badges */}
                <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Achievement Badges
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userStats?.badgeDetails?.map((badge: any) => {
                            const iconMap: { [key: string]: any } = {
                              'Award': Award,
                              'Target': Target,
                              'ShieldCheck': ShieldCheck,
                              'Zap': Zap,
                              'Calendar': Calendar,
                              'Crown': Trophy,
                              'Trophy': Trophy,
                              'UserPlus': UserPlus,
                            };
                            const Icon = iconMap[badge.icon] || Award;
                            return (
                                 <div key={badge.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all">
                                    <Icon className="h-8 w-8 text-primary"/>
                                    <div>
                                        <h5 className="font-bold text-sm">{badge.title}</h5>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    </div>
                                 </div>
                            )
                        })}
                        {(!userStats?.badgeDetails || userStats.badgeDetails.length === 0) && (
                          <div className="col-span-full text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed">
                            <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-muted-foreground">No badges earned yet</p>
                            <p className="text-sm text-muted-foreground">Complete security missions to unlock achievements!</p>
                          </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                {userStats?.recentActivity && userStats.recentActivity.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent Activity
                        </h4>
                        <div className="space-y-3">
                            {userStats.recentActivity.map((activity: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                                    <div className="flex-shrink-0">
                                        {activity.type === 'security_tool' && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                                        {activity.type === 'security_scan' && <Zap className="h-5 w-5 text-green-500" />}
                                        {activity.type === 'vulnerability_report' && <FileText className="h-5 w-5 text-red-500" />}
                                        {activity.type === 'blog_post' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-sm">{activity.title}</h5>
                                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-primary">+{activity.points}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Member Since */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-medium">Member Since</p>
                            <p className="text-sm text-muted-foreground">
                                {userStats?.joinedAt ? new Date(userStats.joinedAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                }) : 'Unknown'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div className="text-right">
                            <p className="font-medium">Last Active</p>
                            <p className="text-sm text-muted-foreground">
                                {userStats?.lastActive ? new Date(userStats.lastActive).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                }) : 'Recently'}
                            </p>
                        </div>
                    </div>
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
                    <AvatarImage 
                      src={currentAvatar || "https://placehold.co/100x100.png"} 
                      alt="Profile Picture" 
                    />
                    <AvatarFallback>
                      {form.watch('name')?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <div className="flex gap-2">
                        <Input 
                          id="picture" 
                          type="file" 
                          className="max-w-xs" 
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleAvatarUpload}
                          disabled={avatarUploading}
                        />
                        <Button 
                          variant="outline" 
                          type="button"
                          disabled={avatarUploading}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4"/> 
                          {avatarUploading ? 'Uploading...' : 'Upload'}
                        </Button>
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

      {/* Password Change Card - Separate form outside main profile form */}
      <ChangePasswordCard />
    </div>
  );
}

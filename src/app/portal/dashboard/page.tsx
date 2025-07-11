
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users, User, BarChart2, MessageSquare, Settings, Trophy } from "lucide-react";
import { GlobalChat } from "@/components/global-chat";
import Link from "next/link";
import { useState, useEffect } from "react";

const portalLinks = [
  {
    title: "Member Directory",
    description: "Find and connect with other volunteers.",
    icon: Users,
    href: "/portal/directory",
    color: "text-primary"
  },
  {
    title: "Your Profile",
    description: "Update your skills and contact information.",
    icon: User,
    href: "/portal/profile",
     color: "text-primary"
  },
  {
    title: "Leaderboard",
    description: "See top contributors and rankings.",
    icon: Trophy,
    href: "/portal/leaderboard",
     color: "text-primary"
  },
  {
    title: "Knowledge Base",
    description: "Access shared library and training materials.",
    icon: BookOpen,
    href: "/portal/library", 
     color: "text-primary"
  },
  {
    title: "Analytics",
    description: "View contribution stats and impact metrics.",
    icon: BarChart2,
    href: "/portal/analytics",
     color: "text-primary"
  },
];


export default function PortalDashboard() {
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // Use the admin user for demo purposes
    // In a real app, this would come from authentication context
    setCurrentUserId('cmcysuiuv00008mwmerfy4h5z'); // Yashab Alam (Admin)
  }, []);

  return (
    <div className="container mx-auto py-6 sm:py-12 md:py-20 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-accent">Member Dashboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Welcome back, volunteer. Here's your central hub for collaboration and resources.
        </p>
      </div>

      {/* Global Chat Section */}
      <div className="mb-8 sm:mb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-2 order-2 xl:order-1">
            <GlobalChat currentUserId={currentUserId} />
          </div>
          
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  Chat Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <strong>Share Files:</strong> Upload PDFs, images, code files, documents, presentations, and more.
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <strong>Real-time:</strong> Messages and file sharing in real-time with all members.
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <strong>Reactions:</strong> React to messages with emojis.
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <strong>Replies:</strong> Reply to specific messages for better context.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Supported File Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>• PDF Documents</div>
                  <div>• Images (JPG, PNG)</div>
                  <div>• Code Files</div>
                  <div>• Word Documents</div>
                  <div>• PowerPoint</div>
                  <div>• ZIP Archives</div>
                  <div>• Excel Sheets</div>
                  <div>• Text Files</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Portal Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {portalLinks.map((link) => {
          const Icon = link.icon;
          return (
             <Link href={link.href} key={link.title}>
                <Card className="h-full bg-card hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                    <CardHeader className="flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
                         <div className={`bg-primary/10 ${link.color} p-2 sm:p-3 rounded-full w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <CardTitle className={`font-headline text-lg sm:text-xl`}>{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <CardDescription className="text-sm">{link.description}</CardDescription>
                    </CardContent>
                </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

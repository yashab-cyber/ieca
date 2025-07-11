
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users, User, BarChart2, MessageSquare, Settings, Trophy } from "lucide-react";
import Link from "next/link";

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
  {
    title: "Internal Comms",
    description: "Secure forums and chat channels.",
    icon: MessageSquare,
    href: "#",
     color: "text-primary"
  },
];


export default function PortalDashboard() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Member Dashboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Welcome back, volunteer. Here's your central hub for collaboration and resources.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portalLinks.map((link) => {
          const Icon = link.icon;
          return (
             <Link href={link.href} key={link.title}>
                <Card className="h-full bg-card hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                    <CardHeader className="flex-row items-center gap-4">
                         <div className={`bg-primary/10 ${link.color} p-3 rounded-full w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                            <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className={`font-headline text-xl`}>{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{link.description}</CardDescription>
                    </CardContent>
                </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

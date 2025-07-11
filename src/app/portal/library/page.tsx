
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const resources = [
  {
    title: "Threat Intelligence Handbook",
    summary: "A comprehensive guide to Open-Source Intelligence (OSINT) and proactive threat hunting techniques, essential for modern cybersecurity professionals.",
    author: "Priya Singh",
    date: "July 20, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "intelligence data",
    tags: ["threat-intel", "osint", "handbook"]
  },
  {
    title: "Advanced Penetration Testing Techniques",
    summary: "Explore cutting-edge methods for network and application penetration testing, including exploit development and advanced evasion tactics.",
    author: "Arjun Sharma",
    date: "July 18, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "binary code",
    tags: ["pentesting", "red-team", "exploits"]
  },
  {
    title: "Mastering Cloud Security on AWS & Azure",
    summary: "A deep dive into securing cloud infrastructure. Covers IAM policies, network security groups, and best practices for a multi-cloud environment.",
    author: "Ananya Gupta",
    date: "July 15, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "cloud network",
    tags: ["cloud-security", "aws", "azure"]
  },
  {
    title: "IoT Hacking: A Practical Guide",
    summary: "Learn to identify and exploit vulnerabilities in Internet of Things devices, from smart home gadgets to industrial control systems.",
    author: "Vikram Rathore",
    date: "July 12, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "iot internet",
    tags: ["iot", "hacking", "vulnerabilities"]
  },
   {
    title: "Digital Forensics & Incident Response Playbook",
    summary: "Step-by-step procedures for handling security incidents, from initial detection to evidence collection and post-incident analysis.",
    author: "Priya Singh",
    date: "July 10, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "forensics investigation",
    tags: ["dfir", "incident-response", "playbook"]
  },
   {
    title: "Secure Coding Standards for Web Applications",
    summary: "A CISO's guide to implementing secure coding practices across the development lifecycle to prevent common vulnerabilities like XSS and SQLi.",
    author: "Arjun Sharma",
    date: "July 08, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "web development",
    tags: ["secure-coding", "devsecops", "ciso"]
  },
];

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Member Knowledge Base</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          An exclusive collection of resources, handbooks, and training materials curated for IECA volunteers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
            <div className="relative h-48 w-full">
              <Image src={resource.imageUrl} alt={resource.title} fill style={{objectFit: "cover"}} data-ai-hint={resource.hint} />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl leading-tight">{resource.title}</CardTitle>
               <div className="flex flex-wrap gap-2 pt-2">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{resource.summary}</CardDescription>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>By {resource.author} on {resource.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

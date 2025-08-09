
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, Shield, Users, Globe, Linkedin, Github, Mail, Link as LinkIcon, Twitter, Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateSEO, generateStructuredData } from "@/lib/seo";
import { Metadata } from 'next';

export const metadata: Metadata = generateSEO({
  title: 'About IECA - Indian Error Cyber Army | Our Mission & Team',
  description: 'Learn about IECA, India\'s premier volunteer-driven cybersecurity collective. Discover our mission, values, team, and commitment to protecting India\'s digital infrastructure through free cybersecurity services.',
  keywords: [
    'about IECA',
    'Indian Error Cyber Army mission',
    'cybersecurity team India',
    'volunteer cybersecurity',
    'non-profit cybersecurity',
    'cyber defense India',
    'ethical hacking collective',
    'cybersecurity professionals India',
    'digital security mission',
    'cyber army volunteers'
  ],
  canonical: 'https://ieca.in/about'
});

const teamMembers = [
    { name: "Arjun Sharma", role: "Chief Security Architect", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
    { name: "Priya Singh", role: "Head of Threat Intelligence", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
    { name: "Vikram Rathore", role: "Lead Penetration Tester", avatar: "https://placehold.co/100x100.png", hint: "man portrait technology" },
    { name: "Ananya Gupta", role: "Cyber Forensics Expert", avatar: "https://placehold.co/100x100.png", hint: "woman portrait professional" },
];

export default function AboutPage() {
  const structuredData = generateStructuredData('WebPage', {
    name: 'About IECA - Indian Error Cyber Army',
    description: 'Learn about IECA, India\'s premier volunteer-driven cybersecurity collective and our mission to protect India\'s digital infrastructure.',
    url: 'https://ieca.in/about',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ieca.in' },
        { '@type': 'ListItem', position: 2, name: 'About', item: 'https://ieca.in/about' }
      ]
    }
  });

  return (
    <div className="container mx-auto py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">About the Indian Error Cyber Army</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          A non-profit, volunteer-driven collective dedicated to fortifying India's digital defenses against emerging cyber threats.
        </p>
      </section>

      <section className="relative mb-20">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
             <Image 
                src="https://placehold.co/1200x400.png"
                alt="IECA Team Collaboration - Indian Error Cyber Army cybersecurity professionals working together" 
                fill 
                style={{objectFit: "cover"}}
                data-ai-hint="team collaboration"
                className="brightness-50"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl md:text-5xl font-bold font-headline text-white text-center p-4">United for a Secure Digital India</h2>
             </div>
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
            <h2 className="text-3xl font-bold font-headline text-accent mb-4">Our Origin & Mission</h2>
            <p className="text-muted-foreground mb-4">
                The Indian Error Cyber Army (IECA) was founded in 2020 by a group of passionate cybersecurity professionals who saw a critical need for a coordinated, pro-bono effort to protect our nation's digital infrastructure. What started as a small forum has grown into a formidable collective of ethical hackers, security researchers, and incident responders.
            </p>
            <p className="text-muted-foreground">
                Our mission is simple yet profound: to provide free, world-class cybersecurity services to organizations and individuals across India, ensuring that everyone has the right to be secure online. We operate with the core values of integrity, collaboration, and relentless innovation.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex items-center gap-4 p-4">
                    <Shield className="h-8 w-8 text-primary"/>
                    <CardTitle className="font-headline text-lg">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">To create a resilient digital India, where every citizen and organization is safe from cyber threats.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex items-center gap-4 p-4">
                    <Target className="h-8 w-8 text-primary"/>
                    <CardTitle className="font-headline text-lg">Our Goal</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">To be the first line of volunteer-driven defense against cybercrime in the nation.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-12 text-center">Founder &amp; CEO</h2>
        <Card className="max-w-3xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 p-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <Image 
                  src="/assets/1752227611346.jpg"
                  alt="Yashab Alam"
                  fill
                  style={{objectFit: 'cover', objectPosition: 'center'}}
                  data-ai-hint="man portrait professional"
                  className="rounded-full"
              />
            </div>
            <div className="text-center md:text-left">
              <CardTitle className="font-headline text-3xl">Yashab Alam</CardTitle>
              <p className="text-primary font-semibold text-lg mt-1">Project Architecture, Security Implementation, Strategic Direction</p>
              <div className="flex flex-wrap gap-4 text-sm mt-4 justify-center md:justify-start">
                  <Link href="mailto:yashabalam707@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /> Email</Link>
                  <Link href="https://github.com/yashab-cyber" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Github className="h-4 w-4" /> GitHub</Link>
                  <Link href="https://www.linkedin.com/in/yashab-alam" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Linkedin className="h-4 w-4" /> LinkedIn</Link>
                  <Link href="https://www.instagram.com/yashab.alam" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" /> Instagram</Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-12 text-center">Development Partner</h2>
         <Card className="max-w-3xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 p-6">
            <div className="relative w-40 h-40 flex-shrink-0">
                <Image 
                    src="https://placehold.co/400x400.png"
                    alt="ZehraSec Logo"
                    fill
                    style={{objectFit: 'cover'}}
                    data-ai-hint="technology company logo"
                    className="rounded-full"
                />
            </div>
            <div className="text-center md:text-left">
                <CardTitle className="font-headline text-3xl">ZehraSec</CardTitle>
                <p className="text-primary font-semibold text-lg mt-1">Frontend Development, UI/UX Design, Feature Implementation</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mt-4 justify-center md:justify-start">
                    <Link href="https://www.zehrasec.com" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /> Website</Link>
                    <Link href="mailto:contact@zehrasec.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /> Email</Link>
                    <Link href="https://www.linkedin.com/company/zehrasec" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Linkedin className="h-4 w-4" /> LinkedIn</Link>
                    <Link href="https://x.com/zehrasec" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Twitter className="h-4 w-4" /> Twitter/X</Link>
                    <Link href="https://www.instagram.com/_zehrasec" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" /> Instagram</Link>
                    <Link href="https://www.facebook.com/profile.php?id=61575580721849" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Facebook className="h-4 w-4" /> Facebook</Link>
                </div>
                 <Button asChild variant="outline" className="mt-4">
                     <Link href="https://whatsapp.com/channel/0029Vaoa1GfKLaHlL0Kc8k1q" target="_blank">
                        Join WhatsApp Channel
                    </Link>
                </Button>
            </div>
          </div>
        </Card>
      </section>
      
      <section className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-12">Meet Our Core Volunteer Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center pt-6 bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} className="rounded-full" />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold font-headline">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

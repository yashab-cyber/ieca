import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, ServerCog, Users, Trophy, Star, Target, FileScan } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services for India',
  description: "India's premier cybersecurity collective. Get free threat intelligence, vulnerability assessments, incident response, and cyber education. Join 500+ ethical hackers protecting India's digital infrastructure.",
  keywords: [
    'cybersecurity India',
    'free cybersecurity services',
    'threat intelligence',
    'vulnerability assessment',
    'incident response',
    'ethical hacking India',
    'cyber security collective',
    'Indian hackers',
    'penetration testing',
    'cyber education',
    'digital security India',
    'cyber defense',
    'security consulting'
  ],
  openGraph: {
    title: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services',
    description: "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, and cyber education. Join 500+ ethical hackers.",
    type: 'website',
    url: 'https://ieca.in',
    images: [
      {
        url: '/email/ieca-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'IECA - Indian Error Cyber Army - Free Cybersecurity Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services',
    description: "India's premier cybersecurity collective providing free threat intelligence and cyber education.",
    images: ['/email/ieca-logo.jpg'],
  },
  alternates: {
    canonical: 'https://ieca.in',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* JSON-LD for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "IECA - Indian Error Cyber Army",
            "url": "https://ieca.in",
            "description": "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, incident response, and cyber education.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ieca.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://twitter.com/ieca_cyber",
              "https://linkedin.com/company/ieca-cyber",
              "https://github.com/ieca-cyber"
            ]
          }),
        }}
      />
      <HeroSection />
      <ServicesSection />
      <AchievementsSection />
      <TeamSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  const title = "IECA: Indian Error Cyber Army";
  return (
    <section className="py-24 md:py-40 bg-background" itemScope itemType="https://schema.org/Organization">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-accent mb-6" itemProp="name">
            {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8" itemProp="description">
          We are a collective of India's top hackers, the Indian Error Cyber Army, united by a single mission: to provide free, world-class cybersecurity services and protect our nation's digital future.
        </p>
        <div className="flex justify-center gap-4" role="group" aria-label="Primary actions">
          <Button size="lg" asChild>
            <Link href="/contact" aria-label="Report a cybersecurity threat to IECA">Report a Threat</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources" aria-label="Explore free cybersecurity resources and tools">Explore Resources</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const services = [
  { icon: ShieldCheck, title: "Threat Intelligence", description: "Proactive identification and analysis of cyber threats to prevent attacks before they happen. Freely available for all." },
  { icon: FileScan, title: "Vulnerability Assessment", description: "Comprehensive scanning and penetration testing to identify and help remediate security weaknesses at no cost." },
  { icon: ServerCog, title: "Incident Response", description: "24/7 volunteer-driven support to help you respond to and recover from cyberattacks." },
  { icon: Users, title: "Community Education", description: "Empowering everyone with the knowledge to recognize and respond to cyber threats effectively through free workshops and resources." },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-secondary/50" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent">Our Free Services</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">We offer a comprehensive suite of cybersecurity services to defend India's digital ecosystem, completely free of charge.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="text-center bg-card hover:shadow-lg transition-shadow duration-300"
                itemScope 
                itemType="https://schema.org/Service"
              >
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <CardTitle className="font-headline mt-4" itemProp="name">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground" itemProp="description">{service.description}</p>
                  <meta itemProp="provider" content="Indian Error Cyber Army" />
                  <meta itemProp="priceRange" content="Free" />
                  <meta itemProp="category" content="Cybersecurity" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const achievements = [
    { icon: Trophy, title: "National Security Award 2023", description: "Recognized for outstanding contribution to national cybersecurity." },
    { icon: Target, title: "Zero-Day Exploit Neutralized", description: "Successfully thwarted a major state-sponsored attack on critical infrastructure." },
    { icon: Star, title: "Community-Powered Defense", description: "Protected over 1000 small businesses and NGOs from ransomware attacks in the last year." },
];

function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent">Our Impact</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Celebrating our successes in the ongoing mission to secure India's digital future.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className="bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">{achievement.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{achievement.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}


const teamMembers = [
    { name: "Arjun Sharma", role: "Chief Security Architect", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
    { name: "Priya Singh", role: "Head of Threat Intelligence", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
    { name: "Vikram Rathore", role: "Lead Penetration Tester", avatar: "https://placehold.co/100x100.png", hint: "man portrait technology" },
    { name: "Ananya Gupta", role: "Cyber Forensics Expert", avatar: "https://placehold.co/100x100.png", hint: "woman portrait professional" },
];

function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent">Meet Our Volunteers</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Our strength lies in our community of dedicated and highly skilled cybersecurity professionals.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center pt-6 bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold font-headline">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-accent">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-background mb-4">Facing a Cyber Threat?</h2>
        <p className="text-lg text-background/80 max-w-2xl mx-auto mb-8">
          You are not alone. Our team is ready to help, free of charge. Reach out to us for immediate assistance or to report a vulnerability.
        </p>
        <Button size="lg" variant="default" asChild>
            <Link href="/contact">Get Free Help Now</Link>
        </Button>
      </div>
    </section>
  );
}

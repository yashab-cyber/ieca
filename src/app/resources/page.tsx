import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    title: "Understanding the New Phishing Scams Targeting UPI Users",
    summary: "A new wave of sophisticated phishing attacks is targeting UPI users in India. This article breaks down their methods and provides crucial tips for staying safe.",
    author: "Priya Singh",
    date: "July 20, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "cyber security",
    tags: ["phishing", "upi", "scams"]
  },
  {
    title: "The Rise of AI in Cyberattacks: A Double-Edged Sword",
    summary: "Artificial intelligence is now being used by both attackers and defenders. Learn how AI is changing the threat landscape and what it means for your organization.",
    author: "Arjun Sharma",
    date: "July 18, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "artificial intelligence",
    tags: ["ai", "security"]
  },
  {
    title: "Securing Your Remote Workforce: Post-Pandemic Best Practices",
    summary: "With remote work here to stay, ensuring the security of your distributed team is paramount. Explore our guide to the latest tools and policies.",
    author: "Ananya Gupta",
    date: "July 15, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "remote work",
    tags: ["remote-work", "security", "best-practices"]
  },
  {
    title: "IoT Devices: The Unseen Gateway for Attackers",
    summary: "Your smart devices could be the weakest link in your security chain. This report highlights common IoT vulnerabilities and how to mitigate them.",
    author: "Vikram Rathore",
    date: "July 12, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "iot internet",
    tags: ["iot", "vulnerabilities"]
  },
   {
    title: "Ransomware Evolution: Trends to Watch in 2024",
    summary: "Ransomware tactics are constantly evolving. We analyze the latest trends, from double extortion to RaaS, and how you can build a resilient defense.",
    author: "Priya Singh",
    date: "July 10, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "hacker code",
    tags: ["ransomware", "trends"]
  },
   {
    title: "The CISO's Guide to Cloud Security Posture Management",
    summary: "Misconfigurations in the cloud remain a top security risk. This guide provides a framework for effective Cloud Security Posture Management (CSPM).",
    author: "Arjun Sharma",
    date: "July 08, 2024",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "cloud computing",
    tags: ["cloud-security", "ciso", "cspm"]
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Cybersecurity Resource Center</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Your central hub for the latest news, in-depth articles, and expert analysis on the evolving cybersecurity landscape. Stay informed, stay secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
            <div className="relative h-48 w-full">
              <Image src={article.imageUrl} alt={article.title} fill style={{objectFit: "cover"}} data-ai-hint={article.hint} />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl leading-tight">{article.title}</CardTitle>
               <div className="flex flex-wrap gap-2 pt-2">
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{article.summary}</CardDescription>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>By {article.author} on {article.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
               <Image src="/assets/1752137694206.jpg" alt="IECA Logo" width={32} height={32} className="h-8 w-8 rounded-md" />
              <span className="text-xl font-bold font-headline">IECA</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Indian Error Cyber Army: A volunteer collective protecting India's digital future.
            </p>
             <div className="flex items-center gap-4 mt-6">
              <Link href="https://x.com/zehrasec" target="_blank" aria-label="Twitter/X">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.linkedin.com/company/zehrasec" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://github.com/yashab-cyber" target="_blank" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
              <nav className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Get Involved</h3>
              <nav className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/join" className="hover:text-primary transition-colors">Join as a Volunteer</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Report an Incident</Link>
                <Link href="/portal/dashboard" className="hover:text-primary transition-colors">Member Portal</Link>
              </nav>
            </div>
             <div>
              <h3 className="font-headline font-semibold mb-4">Legal</h3>
              <nav className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} IECA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


'use client';
import Link from 'next/link';
import { Menu, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import Image from 'next/image';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/resources', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
    { href: '/join', label: 'Join Us' },
    { href: '/portal/dashboard', label: 'Member Portal' },
    { href: '/admin', label: 'Admin' },
];

function HeaderActions() {
  const pathname = usePathname();
  const isPortalPage = pathname.startsWith('/portal') || pathname === '/login';

  if (isPortalPage) {
    return (
      <Button asChild>
        <Link href="/portal/dashboard">Portal Home</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild>
        <Link href="/join"><Handshake />Join Us</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/contact">Report a Threat</Link>
      </Button>
    </>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/1752137694206.jpg" alt="IECA Logo" width={24} height={24} className="h-6 w-6 rounded-sm" />
            <span className="font-bold font-headline">IECA</span>
          </Link>
        </div>
        
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="text-primary"/>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background/95 backdrop-blur-xl">
                <div className="px-2 pt-6">
                  <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsOpen(false)}>
                     <Image src="/assets/1752137694206.jpg" alt="IECA Logo" width={24} height={24} className="h-6 w-6 rounded-sm" />
                    <span className="font-bold font-headline">IECA</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                      {isClient && navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        
        <div className="flex flex-1 items-center justify-center md:justify-between">
            {isClient && (
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
                    {navLinks.map((link) => (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className={cn(
                        "transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
            )}
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
           <ThemeToggle />
           {isClient && <HeaderActions />}
        </div>
      </div>
    </header>
  );
}

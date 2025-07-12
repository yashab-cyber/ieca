'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Shield, 
  Users, 
  User, 
  Trophy, 
  BookOpen, 
  BarChart2 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: Home },
  { name: 'Security Tools', href: '/portal/security', icon: Shield },
  { name: 'Directory', href: '/portal/directory', icon: Users },
  { name: 'Profile', href: '/portal/profile', icon: User },
  { name: 'Leaderboard', href: '/portal/leaderboard', icon: Trophy },
  { name: 'Library', href: '/portal/library', icon: BookOpen },
  { name: 'Analytics', href: '/portal/analytics', icon: BarChart2 },
];

export function PortalNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

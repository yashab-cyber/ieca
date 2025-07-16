import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ChatWidget } from '@/components/chat/chat-widget';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@/components/analytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ieca.in'),
  title: {
    default: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services for India',
    template: '%s | IECA - Indian Error Cyber Army'
  },
  description: "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, incident response, and cyber education. Join the Indian Error Cyber Army protecting our nation's digital infrastructure.",
  keywords: [
    'cybersecurity',
    'India cybersecurity',
    'ethical hacking',
    'threat intelligence',
    'vulnerability assessment',
    'incident response',
    'cyber education',
    'free cybersecurity services',
    'Indian hackers',
    'cyber army',
    'penetration testing',
    'security consulting',
    'cyber defense',
    'digital security',
    'information security',
    'cyber threats',
    'security awareness',
    'bug bounty',
    'red team',
    'blue team'
  ],
  authors: [{ name: 'Indian Error Cyber Army', url: 'https://ieca.in' }],
  creator: 'Indian Error Cyber Army',
  publisher: 'Indian Error Cyber Army',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-16', sizes: '16x16', type: 'image/png' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
      { url: '/icon-64', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/icon',
    apple: '/icon',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ieca.in',
    title: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services',
    description: "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, and cyber education to protect our nation's digital infrastructure.",
    siteName: 'Indian Error Cyber Army',
    images: [
      {
        url: '/email/ieca-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'IECA - Indian Error Cyber Army Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IECA - Indian Error Cyber Army | Free Cybersecurity Services',
    description: "India's premier cybersecurity collective providing free cybersecurity services to protect our nation's digital infrastructure.",
    images: ['/email/ieca-logo.jpg'],
    creator: '@ieca_cyber',
    site: '@ieca_cyber',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://ieca.in',
    languages: {
      'en-IN': 'https://ieca.in',
      'hi-IN': 'https://ieca.in/hi',
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Indian Error Cyber Army",
    "alternateName": "IECA",
    "url": "https://ieca.in",
    "logo": "https://ieca.in/email/ieca-logo.jpg",
    "description": "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, incident response, and cyber education.",
    "foundingDate": "2020",
    "foundingLocation": {
      "@type": "Country",
      "name": "India"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "knowsAbout": [
      "Cybersecurity",
      "Ethical Hacking",
      "Threat Intelligence",
      "Vulnerability Assessment",
      "Incident Response",
      "Penetration Testing",
      "Digital Forensics",
      "Security Consulting"
    ],
    "serviceType": [
      "Cybersecurity Services",
      "Threat Intelligence",
      "Vulnerability Assessment",
      "Incident Response",
      "Security Education",
      "Penetration Testing"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://ieca.in/contact"
    },
    "sameAs": [
      "https://twitter.com/ieca_cyber",
      "https://linkedin.com/company/ieca-cyber",
      "https://github.com/ieca-cyber"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="IECA" />
        <meta name="application-name" content="IECA" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon" type="image/png" />
        <link rel="apple-touch-icon" href="/icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          "font-body bg-background text-foreground antialiased min-h-screen flex flex-col"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <ChatWidget />
          {/* Analytics component - Add your tracking IDs here when ready */}
          <Analytics 
            gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            hotjarId={process.env.NEXT_PUBLIC_HOTJAR_ID}
            clarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

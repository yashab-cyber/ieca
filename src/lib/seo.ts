import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  ogImage?: string
  structuredData?: object
}

export function generateSEO({
  title,
  description,
  keywords = [],
  canonical,
  noIndex = false,
  ogImage = '/email/ieca-logo.jpg',
  structuredData
}: SEOConfig): Metadata {
  const baseUrl = 'https://ieca.in'
  const fullTitle = title.includes('IECA') ? title : `${title} | IECA - Indian Error Cyber Army`
  
  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      'cybersecurity',
      'India cybersecurity',
      'ethical hacking',
      'IECA',
      'Indian Error Cyber Army',
      'free cybersecurity services'
    ],
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: canonical || baseUrl,
      siteName: 'IECA - Indian Error Cyber Army',
      locale: 'en_IN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@ieca_cyber',
      site: '@ieca_cyber',
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
  }
}

export const defaultKeywords = [
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
]

export function generateStructuredData(type: 'WebPage' | 'Organization' | 'Service' | 'Article', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'WebPage':
      return {
        ...baseStructuredData,
        name: data.title,
        description: data.description,
        url: data.url,
        isPartOf: {
          '@type': 'WebSite',
          name: 'IECA - Indian Error Cyber Army',
          url: 'https://ieca.in'
        },
        ...data
      }
    
    case 'Organization':
      return {
        ...baseStructuredData,
        name: 'Indian Error Cyber Army',
        alternateName: 'IECA',
        url: 'https://ieca.in',
        logo: 'https://ieca.in/email/ieca-logo.jpg',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          url: 'https://ieca.in/contact'
        },
        sameAs: [
          'https://twitter.com/ieca_cyber',
          'https://linkedin.com/company/ieca-cyber',
          'https://github.com/ieca-cyber'
        ],
        ...data
      }
    
    case 'Service':
      return {
        ...baseStructuredData,
        provider: {
          '@type': 'Organization',
          name: 'Indian Error Cyber Army',
          url: 'https://ieca.in'
        },
        areaServed: {
          '@type': 'Country',
          name: 'India'
        },
        category: 'Cybersecurity',
        ...data
      }
    
    case 'Article':
      return {
        ...baseStructuredData,
        author: {
          '@type': 'Organization',
          name: 'Indian Error Cyber Army',
          url: 'https://ieca.in'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Indian Error Cyber Army',
          url: 'https://ieca.in',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ieca.in/email/ieca-logo.jpg'
          }
        },
        ...data
      }
    
    default:
      return { ...baseStructuredData, ...data }
  }
}

// Common structured data schemas
export const organizationSchema = generateStructuredData('Organization', {
  description: "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, incident response, and cyber education.",
  foundingDate: '2020',
  foundingLocation: {
    '@type': 'Country',
    name: 'India'
  },
  areaServed: {
    '@type': 'Country',
    name: 'India'
  },
  knowsAbout: [
    'Cybersecurity',
    'Ethical Hacking',
    'Threat Intelligence',
    'Vulnerability Assessment',
    'Incident Response',
    'Penetration Testing',
    'Digital Forensics',
    'Security Consulting'
  ],
  serviceType: [
    'Cybersecurity Services',
    'Threat Intelligence',
    'Vulnerability Assessment',
    'Incident Response',
    'Security Education',
    'Penetration Testing'
  ]
})

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'IECA - Indian Error Cyber Army',
  url: 'https://ieca.in',
  description: "India's premier cybersecurity collective providing free threat intelligence, vulnerability assessments, incident response, and cyber education.",
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://ieca.in/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  },
  sameAs: [
    'https://twitter.com/ieca_cyber',
    'https://linkedin.com/company/ieca-cyber',
    'https://github.com/ieca-cyber'
  ]
}

import { Metadata } from 'next';
import ContactPageClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact IECA - Report Cyber Threats & Get Free Security Help',
  description: 'Contact the Indian Error Cyber Army to report cybersecurity threats, request free security assistance, or join our volunteer cybersecurity collective. 24/7 incident response available.',
  keywords: [
    'contact IECA',
    'report cyber threat',
    'cybersecurity help',
    'incident response',
    'free security assistance',
    'cyber attack reporting',
    'security consultation',
    'vulnerability reporting',
    'cyber threat intel',
    'emergency cyber response'
  ],
  openGraph: {
    title: 'Contact IECA - Report Cyber Threats & Get Free Security Help',
    description: 'Contact the Indian Error Cyber Army to report cybersecurity threats, request free security assistance, or join our volunteer cybersecurity collective.',
    url: 'https://ieca.in/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ieca.in/contact'
  }
};

export default function ContactPage() {
  return <ContactPageClient />;
}
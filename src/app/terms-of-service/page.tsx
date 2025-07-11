
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 md:py-20 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-8">Terms of Service</h1>
        <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="font-headline text-2xl mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the services provided by the Indian Error Cyber Army ("IECA"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="font-headline text-2xl mt-8">2. Description of Service</h2>
        <p>
          IECA provides free, volunteer-based cybersecurity services, including but not limited to threat intelligence, vulnerability assessments, incident response, and educational resources. All services are provided "as is" and on a pro-bono basis.
        </p>

        <h2 className="font-headline text-2xl mt-8">3. User Conduct</h2>
        <p>
          You agree not to use our services for any unlawful purpose. You must not attempt to disrupt the integrity or performance of our services or infrastructure. Any information you provide to us must be accurate and truthful to the best of your knowledge.
        </p>
        
        <h2 className="font-headline text-2xl mt-8">4. Volunteer Code of Conduct</h2>
        <p>
            All volunteers accepted into IECA must adhere to a strict code of conduct and ethics policy. Violation of this code may result in immediate dismissal from the collective. All volunteer activities are performed on a pro-bono basis without expectation of compensation.
        </p>

        <h2 className="font-headline text-2xl mt-8">5. Disclaimer of Warranties</h2>
        <p>
          Our services are provided on an "as is" and "as available" basis. IECA makes no warranty that the services will meet your requirements, be uninterrupted, timely, secure, or error-free. Any action you take upon the information or assistance provided by IECA is strictly at your own risk.
        </p>

        <h2 className="font-headline text-2xl mt-8">6. Limitation of Liability</h2>
        <p>
          In no event shall IECA or its volunteers be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services. As a non-profit, volunteer collective, our liability is expressly limited to the fullest extent permitted by law.
        </p>

        <h2 className="font-headline text-2xl mt-8">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page. Your continued use of our services after any such changes constitutes your acceptance of the new terms.
        </p>

        <h2 className="font-headline text-2xl mt-8">Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:contact@ieca.gov.in" className="text-primary hover:underline">contact@ieca.gov.in</a>.
        </p>
      </div>
    </div>
  );
}

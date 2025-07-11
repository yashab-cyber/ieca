
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-8">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="font-headline text-2xl mt-8">Introduction</h2>
        <p>
          The Indian Error Cyber Army ("IECA", "we", "us", or "our") is committed to protecting the privacy of our users, volunteers, and visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, apply to be a volunteer, or use our services.
        </p>

        <h2 className="font-headline text-2xl mt-8">Information We Collect</h2>
        <p>
          We may collect personal information from you in a variety of ways, including:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> When you apply to join IECA or contact us, you may provide us with certain personally identifiable information, such as your name, email address, phone number, and professional details.</li>
          <li><strong>Derivative Data:</strong> Our servers automatically collect information when you access the site, such as your IP address, browser type, operating system, and access times.</li>
          <li><strong>Data from Contact Forms:</strong> Information that you provide when you contact us for support or to report an incident.</li>
        </ul>

        <h2 className="font-headline text-2xl mt-8">Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
        </p>
        <ul>
          <li>Process volunteer applications.</li>
          <li>Respond to your inquiries and provide support.</li>
          <li>Monitor and analyze usage and trends to improve our website.</li>
          <li>Protect against malicious activity and secure our platform.</li>
          <li>Communicate with you about your involvement with IECA.</li>
        </ul>

        <h2 className="font-headline text-2xl mt-8">Disclosure of Your Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. All information is handled internally by vetted volunteers for the sole purpose of carrying out IECA's mission. We may disclose your information if required by law.
        </p>

        <h2 className="font-headline text-2xl mt-8">Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2 className="font-headline text-2xl mt-8">Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:contact@ieca.gov.in" className="text-primary hover:underline">contact@ieca.gov.in</a>.
        </p>
      </div>
    </div>
  );
}

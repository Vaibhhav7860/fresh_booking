import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy - FreshBooking',
  description: 'Read FreshBooking\'s Privacy Policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: April 25, 2025</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to FreshBooking ("we", "our", or "us"). We are committed to protecting your privacy and personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you visit our website <strong>freshbooking.in</strong> and use our services.
          </p>
          <p>
            By accessing or using our platform, you agree to the terms of this Privacy Policy. If you do not agree
            with the terms, please do not access the website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>We may collect the following personal information when you register, post a property, or make an inquiry:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Property listing details (address, photos, pricing)</li>
            <li>Account credentials (encrypted passwords)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you access our platform, we may automatically collect:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information (operating system, screen resolution)</li>
            <li>Pages visited and time spent on the platform</li>
            <li>Referring website or search terms</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our platform</li>
            <li>Process property listings and buyer/renter inquiries</li>
            <li>Communicate with you about your account, listings, or inquiries</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our platform, features, and user experience</li>
            <li>Detect and prevent fraud, abuse, or unauthorized access</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Sharing of Information</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul>
            <li><strong>Property Owners/Seekers:</strong> When you make an inquiry, your contact details are shared with the property owner to facilitate communication.</li>
            <li><strong>Service Providers:</strong> Third-party vendors who assist us with hosting, analytics, email delivery, and customer support.</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information, including encryption
            of passwords, secure HTTPS connections, and restricted access to personal data. However, no method of
            electronic storage or transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you
            services. We may also retain information to comply with legal obligations, resolve disputes, and enforce
            our agreements. You may request deletion of your account and associated data by contacting us.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal information</li>
            <li>Withdraw consent for data processing</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Request a copy of your data in a portable format</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise any of these rights, please contact us at the details provided below.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites or services. We are not responsible for the
            privacy practices of these external sites. We encourage you to review their privacy policies before
            providing any personal information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal
            information from children. If we become aware that we have collected information from a child under 18,
            we will take steps to delete such information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
            updated "Last Updated" date. We encourage you to review this policy periodically for any changes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> support@freshbooking.in</li>
            <li><strong>Website:</strong> www.freshbooking.in</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

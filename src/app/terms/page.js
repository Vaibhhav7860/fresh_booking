import styles from '../privacy-policy/page.module.css';

export const metadata = {
  title: 'Terms & Conditions - FreshBooking',
  description: 'Read FreshBooking\'s Terms and Conditions governing the use of our real estate platform.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms &amp; Conditions</h1>
        <p className={styles.lastUpdated}>Last Updated: April 25, 2025</p>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the FreshBooking platform ("Platform"), you accept and agree to be bound by these
            Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must not use the Platform.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use the Platform, including property
            buyers, sellers, renters, agents, and builders.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Definitions</h2>
          <ul>
            <li><strong>"Platform"</strong> refers to the FreshBooking website, mobile applications, and all related services.</li>
            <li><strong>"User"</strong> refers to any individual or entity accessing or using the Platform.</li>
            <li><strong>"Property Listing"</strong> refers to any property advertisement posted on the Platform.</li>
            <li><strong>"Content"</strong> refers to any text, images, data, or other material uploaded to the Platform.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 18 years old to create an account.</li>
            <li>One person may not maintain more than one account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Property Listings</h2>
          <h3>4.1 Posting Listings</h3>
          <ul>
            <li>All property listings must be accurate, truthful, and not misleading.</li>
            <li>You must have the legal right or authorization to list a property.</li>
            <li>Listings must not contain offensive, discriminatory, or illegal content.</li>
            <li>Photos must be genuine representations of the property.</li>
            <li>Duplicate listings for the same property are not allowed.</li>
          </ul>

          <h3>4.2 Listing Removal</h3>
          <p>
            FreshBooking reserves the right to remove any listing that violates these Terms, is reported as fraudulent,
            or does not comply with applicable laws without prior notice.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Post false, misleading, or fraudulent property information</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Scrape, crawl, or use automated tools to extract data from the Platform</li>
            <li>Interfere with or disrupt the Platform's infrastructure</li>
            <li>Impersonate any person or entity</li>
            <li>Transmit viruses, malware, or other harmful code</li>
            <li>Use the Platform to send unsolicited communications (spam)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Intellectual Property</h2>
          <p>
            All content on the Platform, including but not limited to text, graphics, logos, icons, images, and software,
            is the property of FreshBooking or its content suppliers and is protected by Indian and international
            copyright laws. You may not reproduce, distribute, modify, or create derivative works without our prior
            written consent.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Disclaimer of Warranties</h2>
          <ul>
            <li>The Platform is provided on an "as is" and "as available" basis.</li>
            <li>FreshBooking does not guarantee the accuracy, completeness, or reliability of any property listing.</li>
            <li>We do not verify the identity of users or the authenticity of property details unless explicitly stated.</li>
            <li>We are not a party to any transaction between buyers and sellers.</li>
            <li>Users are advised to conduct their own due diligence before making any property-related decisions.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, FreshBooking shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including but not limited to loss of profits, data, or
            goodwill, arising out of or related to your use of the Platform.
          </p>
          <p>
            FreshBooking's total liability for any claim arising from the use of the Platform shall not exceed the
            amount paid by you, if any, for accessing the Platform during the 12 months preceding the claim.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless FreshBooking, its officers, directors, employees, and agents from
            any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these Terms,
            or your violation of any rights of a third party.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Third-Party Services</h2>
          <p>
            The Platform may contain links to third-party websites or services. FreshBooking does not endorse and is not
            responsible for the content, accuracy, or practices of such third-party services. Your use of third-party
            services is at your own risk.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising
            from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts
            in Gurugram, Haryana, India.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Changes to Terms</h2>
          <p>
            FreshBooking reserves the right to modify these Terms at any time. Changes will be effective immediately upon
            posting on this page. Your continued use of the Platform after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> support@freshbooking.in</li>
            <li><strong>Website:</strong> www.freshbooking.in</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

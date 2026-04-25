import styles from '../privacy-policy/page.module.css';

export const metadata = {
  title: 'Cookies Policy - FreshBooking',
  description: 'Learn about how FreshBooking uses cookies and similar technologies on our platform.',
};

export default function CookiesPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Cookies Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: April 25, 2025</p>

        <section className={styles.section}>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a
            website. They are widely used to make websites work more efficiently, provide information to website owners,
            and improve the user experience.
          </p>
          <p>
            Cookies may be set by the website you are visiting ("first-party cookies") or by third parties whose
            services the website uses ("third-party cookies").
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. How We Use Cookies</h2>
          <p>FreshBooking uses cookies for the following purposes:</p>

          <h3>2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for the Platform to function properly. They enable core features such as
            user authentication, security, and session management. Without these cookies, services you have requested
            cannot be provided.
          </p>
          <ul>
            <li><strong>Authentication:</strong> To keep you logged in during your session</li>
            <li><strong>Security:</strong> To protect against unauthorized access and fraud</li>
            <li><strong>Session Management:</strong> To maintain your preferences during a browsing session</li>
          </ul>

          <h3>2.2 Functional Cookies</h3>
          <p>
            These cookies allow us to remember your preferences and settings, providing a more personalized experience.
          </p>
          <ul>
            <li>Remembering your search preferences and recent searches</li>
            <li>Storing your preferred city or location</li>
            <li>Maintaining your filter selections across sessions</li>
          </ul>

          <h3>2.3 Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our Platform by collecting and reporting
            information anonymously. This helps us improve the Platform's performance and user experience.
          </p>
          <ul>
            <li>Pages visited and time spent on each page</li>
            <li>Click patterns and navigation paths</li>
            <li>Error reporting and performance monitoring</li>
            <li>Traffic sources and user demographics (anonymized)</li>
          </ul>

          <h3>2.4 Marketing Cookies</h3>
          <p>
            These cookies may be set by our advertising partners to build a profile of your interests and show you
            relevant advertisements on other websites. They do not directly store personal information but uniquely
            identify your browser and device.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Cookies We Use</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Cookie Name</span>
              <span>Purpose</span>
              <span>Duration</span>
              <span>Type</span>
            </div>
            <div className={styles.tableRow}>
              <span>auth_token</span>
              <span>User authentication</span>
              <span>Session</span>
              <span>Essential</span>
            </div>
            <div className={styles.tableRow}>
              <span>user_prefs</span>
              <span>User preferences</span>
              <span>1 year</span>
              <span>Functional</span>
            </div>
            <div className={styles.tableRow}>
              <span>_ga</span>
              <span>Google Analytics tracking</span>
              <span>2 years</span>
              <span>Analytics</span>
            </div>
            <div className={styles.tableRow}>
              <span>_gid</span>
              <span>Google Analytics session</span>
              <span>24 hours</span>
              <span>Analytics</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. Managing Cookies</h2>
          <p>
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific websites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p>
            Please note that blocking or deleting cookies may impact your experience on our Platform. Some features
            may not function properly if cookies are disabled.
          </p>

          <h3>Browser-Specific Instructions</h3>
          <ul>
            <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Third-Party Cookies</h2>
          <p>
            Some cookies on our Platform are placed by third-party services that appear on our pages. We do not control
            these cookies. The main third-party services we use include:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> For website traffic analysis and reporting</li>
            <li><strong>Social Media Platforms:</strong> For social sharing buttons and embedded content</li>
          </ul>
          <p>
            We recommend reviewing the privacy and cookie policies of these third parties for more information on how
            they use cookies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Cookies Policy from time to time to reflect changes in technology, legislation, or our
            data practices. Any updates will be posted on this page with a revised "Last Updated" date. We encourage
            you to check this page periodically.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> support@freshbooking.in</li>
            <li><strong>Website:</strong> www.freshbooking.in</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

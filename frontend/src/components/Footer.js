import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoFresh}>Fresh</span>
              <span className={styles.logoBooking}>Booking</span>
            </Link>
            <p className={styles.tagline}>
              India's most innovative real estate platform. Buy, sell, or rent properties with ease.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/></svg>
              </a>
            </div>
          </div>

          {/* Real Estate */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Real Estate</h4>
            <Link href="/properties?listing_type=sell">Buy Property</Link>
            <Link href="/properties?listing_type=rent">Rent Property</Link>
            <Link href="/post-property">Sell Property</Link>
            <Link href="/properties?property_type=plot">Plots / Land</Link>
            <Link href="/properties?property_type=office">Commercial</Link>
          </div>

          {/* Services */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Services</h4>
            <span>Home Loans <em className={styles.soon}>Coming Soon</em></span>
            <span>Property Valuation <em className={styles.soon}>Coming Soon</em></span>
            <span>Legal Services <em className={styles.soon}>Coming Soon</em></span>
            <span>Interior Design <em className={styles.soon}>Coming Soon</em></span>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <Link href="#">About Us</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Contact Us</Link>
            <Link href="#">Partner With Us</Link>
          </div>

          {/* Support */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <Link href="#">Help Center</Link>
            <Link href="#">Safety Guidelines</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Use</Link>
            <Link href="#">Sitemap</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} FreshBooking. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

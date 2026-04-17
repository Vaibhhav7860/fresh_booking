import Link from 'next/link';
import styles from './SectionGetStarted.module.css';

const OPTIONS = [
  { icon: '🏠', title: 'Buy a Home', desc: 'Find your dream property from thousands of listings', link: '/properties?listing_type=sell', color: '#0D9488' },
  { icon: '🔑', title: 'Rent a Home', desc: 'Discover rental properties that fit your budget', link: '/properties?listing_type=rent', color: '#6366F1' },
  { icon: '✨', title: 'New Launches', desc: 'Explore newly launched projects across India', link: '/properties?listing_type=sell', color: '#F59E0B', badge: 'NEW' },
  { icon: '📝', title: 'Post Property', desc: 'Sell or rent your property with ease', link: '/post-property', color: '#10B981' },
  { icon: '📍', title: 'Plots / Land', desc: 'Find the perfect plot for your next investment', link: '/properties?property_type=plot', color: '#F97316' },
];

export default function SectionGetStarted() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="section-title">GET STARTED WITH EXPLORING REAL ESTATE OPTIONS</h2>
        <p className="section-subtitle">Everything you need to find your perfect property</p>

        <div className={styles.grid}>
          {OPTIONS.map((opt, i) => (
            <Link href={opt.link} key={i} className={styles.card} style={{ '--accent': opt.color }}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{opt.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>
                {opt.title}
                {opt.badge && <span className={styles.badge}>{opt.badge}</span>}
              </h3>
              <p className={styles.cardDesc}>{opt.desc}</p>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

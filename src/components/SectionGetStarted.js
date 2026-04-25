import Link from 'next/link';
import { Home, Key, Sparkles, PenSquare, MapPin } from 'lucide-react';
import styles from './SectionGetStarted.module.css';

const OPTIONS = [
  { icon: <Home size={28} />, title: 'Buy a Home', desc: 'Find your dream property from thousands of listings', link: '/properties?quick=buy', color: '#0D9488' },
  { icon: <Key size={28} />, title: 'Rent a Home', desc: 'Discover rental properties that fit your budget', link: '/properties?quick=rent', color: '#6366F1' },
  { icon: <Sparkles size={28} />, title: 'New Launches', desc: 'Explore newly launched projects across India', link: '/properties?quick=new_launch', color: '#F59E0B', badge: 'NEW' },
  { icon: <PenSquare size={28} />, title: 'Post Property', desc: 'Sell or rent your property with ease', link: '/post-property', color: '#10B981' },
  { icon: <MapPin size={28} />, title: 'Plots / Land', desc: 'Find the perfect plot for your next investment', link: '/properties?quick=plot', color: '#F97316' },
];

export default function SectionGetStarted() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="section-title">GET STARTED WITH EXPLORING REAL ESTATE OPTIONS</h2>

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

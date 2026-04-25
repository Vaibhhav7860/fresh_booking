import { Landmark, ClipboardList, Palette, Wrench } from 'lucide-react';
import styles from './SectionServices.module.css';

const SERVICES = [
  { icon: <Landmark size={28} />, title: 'Home Loans', desc: 'Get the best home loan offers from leading banks with lowest interest rates', tag: 'Coming Soon' },
  { icon: <ClipboardList size={28} />, title: 'Property Legal', desc: 'Complete legal verification and documentation services for your property', tag: 'Coming Soon' },
  { icon: <Palette size={28} />, title: 'Interior Design', desc: 'Transform your new home with professional interior design services', tag: 'Coming Soon' },
  { icon: <Wrench size={28} />, title: 'Property Management', desc: 'End-to-end property management services for hassle-free ownership', tag: 'Coming Soon' },
];

export default function SectionServices() {
  return (
    <section className={`section section-alt`}>
      <div className="container">
        <h2 className="section-title">Services Coming Soon</h2>
        <p className="section-subtitle">Comprehensive real estate services to simplify your property journey</p>

        <div className={styles.grid}>
          {SERVICES.map((svc, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconWrap}>{svc.icon}</div>
              <h3 className={styles.title}>{svc.title}</h3>
              <p className={styles.desc}>{svc.desc}</p>
              {svc.tag && <span className={styles.tag}>{svc.tag}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

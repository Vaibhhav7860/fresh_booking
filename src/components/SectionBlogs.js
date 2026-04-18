import styles from './SectionBlogs.module.css';

const BLOGS = [
  {
    title: 'Top 10 Tips for First-Time Home Buyers in 2024',
    excerpt: 'Navigate the real estate market confidently with our comprehensive guide for first-time buyers.',
    category: 'Buying Guide',
    date: 'Dec 15, 2024',
    emoji: '🏡',
  },
  {
    title: 'RERA Regulations: What Every Property Buyer Must Know',
    excerpt: 'Understanding RERA compliance and how it protects your real estate investment in India.',
    category: 'Legal',
    date: 'Dec 10, 2024',
    emoji: '⚖️',
  },
  {
    title: 'Best Cities for Real Estate Investment in India',
    excerpt: 'Discover which Indian cities offer the highest returns on property investments.',
    category: 'Investment',
    date: 'Dec 5, 2024',
    emoji: '📊',
  },
];

export default function SectionBlogs() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Blogs & News</h2>
        <p className="section-subtitle">Stay informed with the latest real estate insights and trends</p>

        <div className={styles.grid}>
          {BLOGS.map((blog, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.emoji}>{blog.emoji}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.meta}>
                  <span className={styles.category}>{blog.category}</span>
                  <span className={styles.date}>{blog.date}</span>
                </div>
                <h3 className={styles.title}>{blog.title}</h3>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <button className={styles.readMore}>Read More <span>→</span></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import styles from './SectionCities.module.css';

const CITIES = [
  { name: 'Mumbai', image: '/indian_cities/mumbai.jpeg', count: '25,480+' },
  { name: 'Delhi', image: '/indian_cities/delhi.jpg', count: '19,250+' },
  { name: 'Bangalore', image: '/indian_cities/Bangalore.webp', count: '18,500+' },
  { name: 'Hyderabad', image: '/indian_cities/hyderabad.png', count: '15,120+' },
  { name: 'Pune', image: '/indian_cities/pune.avif', count: '12,650+' },
  { name: 'Chennai', image: '/indian_cities/chennai.webp', count: '10,200+' },
];

export default function SectionCities() {
  return (
    <section className={`section section-alt`}>
      <div className="container">
        <h2 className="section-title">Explore Real Estate in Popular Indian Cities</h2>
        <p className="section-subtitle">Find properties in India&apos;s most sought-after cities</p>

        <div className={styles.grid}>
          {CITIES.map((city, i) => (
            <Link href={`/properties?search=${city.name}`} key={i} className={styles.card}>
              <img src={city.image} alt={city.name} className={styles.cityImage} />
              <div className={styles.cardOverlay}>
                <h3 className={styles.cityName}>{city.name}</h3>
                <p className={styles.count}>{city.count} Properties</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

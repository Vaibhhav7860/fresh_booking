'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSearch.module.css';

const TABS = [
  { key: 'sell', label: 'Buy', icon: '🏠' },
  { key: 'rent', label: 'Rent', icon: '🔑' },
  { key: 'new_launch', label: 'New Launch', icon: '✨', dot: true },
  { key: 'commercial', label: 'Commercial', icon: '🏢' },
];

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sell');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    let params = new URLSearchParams();
    if (activeTab === 'commercial') {
      params.set('property_type', 'office');
    } else if (activeTab === 'new_launch') {
      params.set('listing_type', 'sell');
    } else {
      params.set('listing_type', activeTab);
    }
    if (searchCity.trim()) {
      params.set('search', searchCity.trim());
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className={styles.hero}>
      {/* Decorative elements */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorGrid}></div>

      <div className={styles.content}>
        <span className={styles.tagline}>INDIA'S PREMIUM REAL ESTATE PLATFORM</span>
        <h1 className={styles.heading}>
          Find Your Perfect
          <br />
          <span className={styles.headingGold}>Dream Home</span>
        </h1>
        <p className={styles.sub}>
          Discover luxurious properties across India's most sought-after locations.
          <br className={styles.brDesktop} />
          Buy, sell, or rent with confidence on FreshBooking.
        </p>

        <div className={styles.searchCard}>
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
                {tab.dot && <span className={styles.dot}></span>}
              </button>
            ))}
          </div>

          <form className={styles.searchRow} onSubmit={handleSearch}>
            <div className={styles.inputWrap}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9BA3C2" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by city, locality, or project name..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search Properties
            </button>
          </form>

          <div className={styles.quickLinks}>
            <span className={styles.quickLabel}>Popular:</span>
            {['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'].map(city => (
              <button key={city} className={styles.quickChip} onClick={() => { setSearchCity(city); }}>
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>50,000+</strong>
            <span>Premium Properties</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <strong>100+</strong>
            <span>Cities Covered</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <strong>10,000+</strong>
            <span>Happy Families</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <strong>99%</strong>
            <span>Client Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}

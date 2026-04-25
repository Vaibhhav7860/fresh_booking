'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getBanners, getImageUrl } from '@/lib/api';
import { Home, Key, Sparkles, Building2 } from 'lucide-react';
import styles from './HeroSearch.module.css';

const TABS = [
  { key: 'sell', label: 'Buy', icon: <Home size={18} /> },
  { key: 'rent', label: 'Rent', icon: <Key size={18} /> },
  { key: 'new_launch', label: 'New Launch', icon: <Sparkles size={18} />, dot: true },
  { key: 'commercial', label: 'Commercial', icon: <Building2 size={18} /> },
];

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sell');
  const [searchCity, setSearchCity] = useState('');
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch banners from API
  useEffect(() => {
    getBanners()
      .then(data => setBanners(data || []))
      .catch(() => setBanners([]));
  }, []);

  // Auto-advance carousel every 5 seconds
  const nextSlide = useCallback(() => {
    if (banners.length <= 1) return;
    setCurrentSlide(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, banners.length]);

  const goToSlide = (index) => setCurrentSlide(index);

  const prevSlideHandler = () => {
    setCurrentSlide(prev => prev === 0 ? banners.length - 1 : prev - 1);
  };

  const nextSlideHandler = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const handleBannerClick = (propertyId) => {
    if (propertyId) {
      router.push(`/properties/${propertyId}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let params = new URLSearchParams();
    // Map hero tabs to the quick filter values the properties page uses
    const tabToQuick = { sell: 'buy', rent: 'rent', new_launch: 'new_launch', commercial: 'commercial' };
    params.set('quick', tabToQuick[activeTab]);
    if (searchCity.trim()) {
      params.set('search', searchCity.trim());
    }
    router.push(`/properties?${params.toString()}`);
  };

  const hasBanners = banners.length > 0;

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Background Slides */}
      {hasBanners ? (
        <div className={styles.carouselContainer}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.carouselSlide} ${index === currentSlide ? styles.carouselSlideActive : ''}`}
              onClick={() => handleBannerClick(banner.property_id)}
              role="button"
              tabIndex={0}
              aria-label={banner.title || `View property`}
              onKeyDown={(e) => e.key === 'Enter' && handleBannerClick(banner.property_id)}
            >
              <img
                src={getImageUrl(banner.image_id)}
                alt={banner.title || 'Banner'}
                className={styles.carouselImage}
                draggable={false}
              />
              <div className={styles.carouselOverlay} />
            </div>
          ))}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                onClick={(e) => { e.stopPropagation(); prevSlideHandler(); }}
                aria-label="Previous slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                onClick={(e) => { e.stopPropagation(); nextSlideHandler(); }}
                aria-label="Next slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {banners.length > 1 && (
            <div className={styles.carouselDots}>
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.carouselDot} ${index === currentSlide ? styles.carouselDotActive : ''}`}
                  onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Fallback: static background when no banners configured */
        <div className={styles.staticBg} />
      )}

      {/* Decorative elements */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorGrid}></div>

      <div className={styles.content}>
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
      </div>
    </section>
  );
}

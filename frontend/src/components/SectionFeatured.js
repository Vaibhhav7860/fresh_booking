'use client';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import { getFeaturedProperties } from '@/lib/api';

export default function SectionFeatured() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getFeaturedProperties().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Featured Properties</h2>
        <p className="section-subtitle">Handpicked properties just for you</p>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</p>
            <p>Featured properties will be highlighted here by our team.</p>
          </div>
        )}
      </div>
    </section>
  );
}

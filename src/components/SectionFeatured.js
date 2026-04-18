'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getFeaturedProperties } from '@/lib/api';

export default function SectionFeatured() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getFeaturedProperties().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Handpicked properties just for you</p>
          </div>
          {properties.length > 4 && (
            <Link href="/properties/featured" className="btn btn-outline btn-view-all">View All →</Link>
          )}
        </div>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}</div>
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

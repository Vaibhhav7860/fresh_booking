'use client';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import { getTrendingProperties } from '@/lib/api';

export default function SectionTrending() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getTrendingProperties().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title">Trending Projects</h2>
        <p className="section-subtitle">Most viewed properties this week</p>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📈</p>
            <p>Trending projects will appear here as properties get more views.</p>
          </div>
        )}
      </div>
    </section>
  );
}

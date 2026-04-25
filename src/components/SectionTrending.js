'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getTrendingProperties } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

export default function SectionTrending() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getTrendingProperties().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Trending Projects</h2>
            <p className="section-subtitle">Most viewed properties this week</p>
          </div>
          {properties.length > 4 && (
            <Link href="/properties/trending" className="btn btn-outline btn-view-all">View All →</Link>
          )}
        </div>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '12px' }}><TrendingUp size={48} strokeWidth={1.5} /></p>
            <p>Trending projects will appear here as properties get more views.</p>
          </div>
        )}
      </div>
    </section>
  );
}

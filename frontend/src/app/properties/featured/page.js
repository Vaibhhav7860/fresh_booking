'use client';
import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { getFeaturedProperties } from '@/lib/api';

export default function FeaturedPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProperties().then(data => {
      setProperties(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '8px' }}>Featured Properties</h1>
        <p className="section-subtitle" style={{ marginBottom: '36px' }}>Handpicked premium properties curated by our team</p>

        {loading ? (
          <div className="grid-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-xl)' }}></div>)}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid-4">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</p>
            <p>No featured properties available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

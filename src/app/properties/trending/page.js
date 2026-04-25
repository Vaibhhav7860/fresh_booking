'use client';
import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { getTrendingProperties } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingProperties().then(data => {
      setProperties(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '8px' }}>Trending Projects</h1>
        <p className="section-subtitle" style={{ marginBottom: '36px' }}>Most viewed properties — see what everyone is looking at</p>

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
            <p style={{ marginBottom: '12px' }}><TrendingUp size={48} strokeWidth={1.5} /></p>
            <p>No trending projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import { getNewLaunches } from '@/lib/api';

export default function SectionNewLaunches() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getNewLaunches().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">New Launches</h2>
        <p className="section-subtitle">Explore the latest residential projects and new developments</p>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>🏗️</p>
            <p>New launches will appear here. Be the first to list a property!</p>
          </div>
        )}
      </div>
    </section>
  );
}

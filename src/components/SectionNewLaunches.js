'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getNewLaunches } from '@/lib/api';
import { Construction } from 'lucide-react';

export default function SectionNewLaunches() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getNewLaunches().then(setProperties).catch(() => {}); }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">New Launches</h2>
            <p className="section-subtitle">Explore the latest residential projects and new developments</p>
          </div>
          {properties.length > 4 && (
            <Link href="/properties/new-launches" className="btn btn-outline btn-view-all">View All →</Link>
          )}
        </div>
        {properties.length > 0 ? (
          <div className="grid-4">{properties.slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '12px' }}><Construction size={48} strokeWidth={1.5} /></p>
            <p>New launches will appear here. Be the first to list a property!</p>
          </div>
        )}
      </div>
    </section>
  );
}

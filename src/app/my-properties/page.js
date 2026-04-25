'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyProperties, deleteProperty, getImageUrl, formatPrice, formatArea } from '@/lib/api';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { Lock, Home, Star, BadgeCheck } from 'lucide-react';
import styles from './page.module.css';

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (user) {
      getMyProperties()
        .then(setProperties)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Check for posted=true in URL
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('posted') === 'true') {
        setToast('Property posted successfully!');
        setTimeout(() => setToast(''), 4000);
      } else if (searchParams.get('edited') === 'true') {
        setToast('Property updated successfully!');
        setTimeout(() => setToast(''), 4000);
      }
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      setToast('Property deleted successfully');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return (
      <div className={styles.emptyState}>
        <Lock size={48} strokeWidth={1.5} />
        <h2>Login Required</h2>
        <p>Please login to view your listed properties.</p>
        <button className="btn btn-primary btn-large" onClick={() => setShowAuth(true)}>Go to Login</button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>My Properties</h1>
          <div className={styles.loadingGrid}>
            {[1,2,3].map(i => <div key={i} className={`${styles.skeleton} skeleton`}></div>)}
          </div>
        </div>
      </div>
    );
  }

  const typeLabels = {
    flat: 'Flat/Apartment', independent_house: 'Independent House', villa: 'Villa',
    plot: 'Plot/Land', office: 'Office Space', shop: 'Shop/Showroom'
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Properties</h1>
            <p className={styles.subtitle}>{properties.length} {properties.length === 1 ? 'property' : 'properties'} listed</p>
          </div>
          <Link href="/post-property" className="btn btn-primary">+ Post New Property</Link>
        </div>

        {properties.length === 0 ? (
          <div className={styles.emptyState}>
            <Home size={48} strokeWidth={1.5} />
            <h2>No Properties Listed Yet</h2>
            <p>Start by posting your first property!</p>
            <Link href="/post-property" className="btn btn-primary btn-large">Post Property FREE</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {properties.map(prop => (
              <div key={prop.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img
                    src={prop.image_ids?.length > 0 ? getImageUrl(prop.image_ids[0]) : '/placeholder-property.jpg'}
                    alt={prop.project_name || 'Property'}
                    onError={(e) => { e.target.src = '/placeholder-property.jpg'; }}
                  />
                  <div className={styles.cardBadge}>
                    {prop.listing_type === 'sell' ? 'For Sale' : prop.listing_type === 'rent' ? 'For Rent' : 'PG'}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardPrice}>{formatPrice(prop.expected_price)}</div>
                  <h3 className={styles.cardTitle}>{prop.project_name || typeLabels[prop.property_type] || 'Property'}</h3>
                  <p className={styles.cardLocation}>{[prop.locality, prop.city].filter(Boolean).join(', ')}</p>
                  <div className={styles.cardSpecs}>
                    {prop.bhk_type && <span>{prop.bhk_type.toUpperCase()}</span>}
                    {prop.bathrooms && <span>{prop.bathrooms} Bath</span>}
                    {prop.built_up_area && <span>{formatArea(prop.built_up_area)}</span>}
                  </div>
                  <div className={styles.cardMeta}>
                    <span>Views: {prop.views_count}</span>
                    {prop.is_featured && <span className={styles.featuredTag}><Star size={14} /> Featured</span>}
                    {prop.is_verified && <span className={styles.verifiedTag}><BadgeCheck size={14} /> Verified</span>}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/edit-property/${prop.id}`} className={styles.editBtn}>Edit</Link>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(prop.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}


import Link from 'next/link';
import { formatPrice, formatArea, getImageUrl } from '@/lib/api';
import { BadgeCheck, Camera } from 'lucide-react';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const {
    id, listing_type, property_type, city, locality, project_name,
    bhk_type, built_up_area, bathrooms, image_ids,
    expected_price, is_featured, is_verified
  } = property;

  const imageUrl = image_ids?.length > 0
    ? getImageUrl(image_ids[0])
    : '/placeholder-property.jpg';

  const typeLabels = {
    flat: 'Flat/Apartment', independent_house: 'Independent House', villa: 'Villa',
    plot: 'Plot/Land', office: 'Office Space', shop: 'Shop/Showroom'
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={project_name || 'Property'} className={styles.image} onError={(e) => { e.target.src = '/placeholder-property.jpg'; }} />
        <div className={styles.badges}>
          {is_featured && <span className={styles.badgeFeatured}>Featured</span>}
          {is_verified && <span className={styles.badgeVerified}><BadgeCheck size={14} /> Verified</span>}
        </div>
        <div className={styles.listingBadge}>
          {listing_type === 'sell' ? 'For Sale' : listing_type === 'rent' ? 'For Rent' : 'PG'}
        </div>
        {image_ids?.length > 1 && (
          <div className={styles.imageCount}><Camera size={14} /> {image_ids.length}</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.price}>{formatPrice(expected_price)}</div>
        <h3 className={styles.title}>
          {project_name || typeLabels[property_type] || 'Property'}
        </h3>
        <p className={styles.location}>{[locality, city].filter(Boolean).join(', ')}</p>

        <div className={styles.specs}>
          {bhk_type && <span>{bhk_type.toUpperCase()}</span>}
          {bathrooms && <span>{bathrooms} Bath</span>}
          {built_up_area && <span>{formatArea(built_up_area)}</span>}
        </div>

        <Link href={`/properties/${id}`} className={styles.viewBtn}>View Details</Link>
      </div>
    </div>
  );
}

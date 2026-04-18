'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getProperty, getProperties, getImageUrl, formatPrice, formatArea } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import ContactModal from '@/components/ContactModal';
import styles from './page.module.css';

function PropertyData() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState('contact');

  // EMI State
  const [loanAmt, setLoanAmt] = useState(4100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  useEffect(() => {
    if (!id) return;
    getProperty(id).then(data => {
      setProperty(data);
      if (data.expected_price) {
        setLoanAmt(Math.floor(data.expected_price * 0.8));
      }
      if (data.city) {
        getProperties(`city=${encodeURIComponent(data.city)}&limit=10`).then(res => {
          setSimilar(res.filter(p => p.id !== data.id));
        });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className="skeleton" style={{ height: '500px', borderRadius: 'var(--radius-xl)', marginBottom: '30px' }}></div>
          <div className={styles.contentGrid}>
            <div>
              <div className="skeleton" style={{ height: '100px', marginBottom: '20px' }}></div>
              <div className="skeleton" style={{ height: '300px', marginBottom: '20px' }}></div>
            </div>
            <div className="skeleton" style={{ height: '400px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Property not found</h2>
        </div>
      </div>
    );
  }

  const prevSlide = () => setCurrentSlide(s => s === 0 ? property.image_ids.length - 1 : s - 1);
  const nextSlide = () => setCurrentSlide(s => s === property.image_ids.length - 1 ? 0 : s + 1);

  // EMI Math
  const p = Number(loanAmt) || 0;
  const r = (Number(rate) || 0) / 12 / 100;
  const n = (Number(tenure) || 0) * 12;
  const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = isNaN(emi) ? 0 : emi * n;
  const totalInterest = Math.max(0, totalPayment - p);

  // Derived Title (like "3 BHK Luxury Apartment in Andheri West")
  const config = property.bhk_type ? property.bhk_type.toUpperCase() : '';
  const ptMap = { 'flat': 'Apartment', 'independent_house': 'Independent House', 'villa': 'Villa', 'plot': 'Plot/Land', 'office': 'Office', 'shop': 'Shop' };
  const pTypeStr = ptMap[property.property_type] || 'Property';
  let titleStr = property.project_name ? property.project_name : `${config} ${pTypeStr}`;
  if (property.locality) titleStr += ` in ${property.locality}`;

  return (
    <div className={styles.page}>
      <div className="container">
        
        {/* Photo Slider */}
        <div className={styles.sliderWrapper}>
          {property.image_ids && property.image_ids.length > 0 ? (
            <>
              <div className={styles.sliderContent} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {property.image_ids.map((imgId, idx) => (
                  <div key={idx} className={styles.slide}>
                    <img src={getImageUrl(imgId)} alt={`Property Photo ${idx + 1}`} onError={e => { e.target.src = '/placeholder-home.jpg'; }} />
                  </div>
                ))}
              </div>
              {property.image_ids.length > 1 && (
                <>
                  <button className={styles.sliderNavLeft} onClick={prevSlide}>❮</button>
                  <button className={styles.sliderNavRight} onClick={nextSlide}>❯</button>
                  <div className={styles.photoCountOverlay}>
                    {currentSlide + 1} / {property.image_ids.length} Photos
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.slide}>
                <img src="/placeholder-home.jpg" alt="No photos available" />
                <div className={styles.photoCountOverlay}>0 Photos</div>
            </div>
          )}
        </div>

        <div className={styles.contentGrid}>
          {/* Main Left Content */}
          <div className={styles.mainLeft}>
            <div className={styles.headerArea}>
              <div className={styles.badges}>
                {property.is_featured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>}
                {property.is_verified && (
                  <span className={`${styles.badge} ${styles.badgeVerified}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Verified
                  </span>
                )}
              </div>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{titleStr}</h1>
                <div className={styles.actions}>
                  <button className={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                  <button className={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </button>
                </div>
              </div>
              <div className={styles.locationRow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {[property.locality, property.city].filter(Boolean).join(', ')}
              </div>
              <div className={styles.priceWrap}>
                <div className={styles.priceBig}>{formatPrice(property.expected_price)}</div>
                {property.expected_price && property.built_up_area && (
                  <div className={styles.priceInfo}>₹{Math.floor(property.expected_price / property.built_up_area).toLocaleString()}/sq.ft</div>
                )}
              </div>
            </div>

            <div className={styles.quickInfoStrip}>
              <div className={styles.quickItem}>
                 <span className={styles.quickLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14c5-3 13-3 18 0 M3 10c7-4 13-4 18 0 M6 21v-3 M18 21v-3 M4 21h16 M12 3v7"/></svg>
                    Bedrooms
                 </span>
                 <span className={styles.quickValue}>{property.bhk_type ? property.bhk_type.charAt(0) : '-'}</span>
              </div>
              <div className={styles.quickItem}>
                 <span className={styles.quickLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20 M4 12v7 M20 12v7 M12 19v3 M9 22h6 M12 6a3 3 0 00-3 3v3h6V9a3 3 0 00-3-3z M12 2v4"/></svg>
                    Bathrooms
                 </span>
                 <span className={styles.quickValue}>{property.bathrooms || '-'}</span>
              </div>
              <div className={styles.quickItem}>
                 <span className={styles.quickLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    {property.built_up_area ? 'Super Built-up' : 'Carpet Area'}
                 </span>
                 <span className={styles.quickValue}>{formatArea(property.built_up_area || property.carpet_area) || '-'}</span>
              </div>
              <div className={styles.quickItem}>
                 <span className={styles.quickLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8 M8 12h8"/></svg>
                    Balconies
                 </span>
                 <span className={styles.quickValue}>{property.balconies || '-'}</span>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>Property Details</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Carpet Area</span>
                   <span className={styles.detailValue}>{formatArea(property.carpet_area) || 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Floor</span>
                   <span className={styles.detailValue}>{property.floor_no ? `${property.floor_no} of ${property.total_floors || '?'}` : 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Listing Type</span>
                   <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{property.listing_type}</span>
                </div>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Property Age</span>
                   <span className={styles.detailValue}>{property.age_of_property || 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Project Name</span>
                   <span className={styles.detailValue}>{property.project_name || 'N/A'}</span>
                </div>
                <div className={styles.detailRow}>
                   <span className={styles.detailLabel}>Furnishing</span>
                   <span className={styles.detailValue}>{property.furnishing ? property.furnishing.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {property.description && (
               <div className={styles.sectionBlock}>
                 <h2 className={styles.sectionTitle}>Description</h2>
                 <p className={styles.description}>{property.description}</p>
               </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Amenities</h2>
                <div className={styles.amenitiesGrid}>
                  {property.amenities.map(item => (
                     <div key={item} className={styles.amenityItem}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                       {item}
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMI Calculator Block */}
            {property.listing_type !== 'rent' && property.listing_type !== 'pg' && (
              <div className={styles.emiBlock}>
                <div className={styles.emiHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="16" y1="18" x2="16" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="8" y1="18" x2="8" y2="18.01"/></svg>
                  EMI Calculator
                </div>

                <div className={styles.emiRow}>
                  <div className={styles.emiRowHeader}>
                    <span style={{ color: 'var(--text-muted)' }}>₹ Loan Amount</span>
                    <span className={styles.emiValInput}>{formatPrice(loanAmt)}</span>
                  </div>
                  <input type="range" className={styles.emiSlider} min={100000} max={25000000} step={100000} value={loanAmt} onChange={e => setLoanAmt(e.target.value)} />
                  <div className={styles.emiSliderLabels}><span>₹1 L</span><span>₹2.50 Cr</span></div>
                </div>

                <div className={styles.emiRow}>
                  <div className={styles.emiRowHeader}>
                    <span style={{ color: 'var(--text-muted)' }}>% Interest Rate (p.a.)</span>
                    <span className={styles.emiValInput}>{rate} %</span>
                  </div>
                  <input type="range" className={styles.emiSlider} min={5} max={15} step={0.1} value={rate} onChange={e => setRate(e.target.value)} />
                  <div className={styles.emiSliderLabels}><span>5%</span><span>15%</span></div>
                </div>

                <div className={styles.emiRow}>
                  <div className={styles.emiRowHeader}>
                    <span style={{ color: 'var(--text-muted)' }}>📅 Loan Tenure</span>
                    <span className={styles.emiValInput}>{tenure} Years</span>
                  </div>
                  <input type="range" className={styles.emiSlider} min={1} max={30} step={1} value={tenure} onChange={e => setTenure(e.target.value)} />
                  <div className={styles.emiSliderLabels}><span>1 Yr</span><span>30 Yrs</span></div>
                </div>

                <div className={styles.emiResultCard}>
                  <div className={styles.emiLabel}>Monthly EMI</div>
                  <div className={styles.emiMonthly}>₹{isNaN(emi) ? '0' : Math.round(emi).toLocaleString('en-IN')}</div>
                  
                  <div className={styles.emiBar}>
                     <div className={styles.emiBarPrincipal} style={{ width: `${(p / totalPayment) * 100}%` }}></div>
                     <div className={styles.emiBarInterest} style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
                  </div>

                  <div className={styles.emiBreakdown}>
                     <div>
                       <div className={styles.emiLabel}><span className={styles.emiDot} style={{ background: 'var(--primary)' }}></span>Principal</div>
                       <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '4px' }}>{formatPrice(p)}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <div className={styles.emiLabel}><span className={styles.emiDot} style={{ background: 'var(--gold)' }}></span>Total Interest</div>
                       <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '4px' }}>{formatPrice(totalInterest)}</div>
                     </div>
                  </div>

                  <div className={styles.emiTotalRow}>
                    <span>Total Payment</span>
                    <span>{formatPrice(totalPayment)}</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Right Sidebar */}
          <div>
            <div className={styles.contactCard}>
               <div className={styles.ownerHeader}>
                 <div className={styles.ownerAvatar}>
                    {property.user_name ? property.user_name.charAt(0).toUpperCase() : 'U'}
                 </div>
                 <div className={styles.ownerInfo}>
                   <h3>{property.user_name || 'Owner'}</h3>
                   <p>{property.posted_by}</p>
                   <span className={styles.ownerResponse}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                     Usually responds within 2 hours
                   </span>
                 </div>
               </div>

               <div className={styles.contactButtons}>
                 <button className={`${styles.contactBtn} ${styles.contactBtnPrimary}`} onClick={() => { setContactType('contact'); setShowContactModal(true); }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                   Contact Owner
                 </button>
                 <button className={`${styles.contactBtn} ${styles.contactBtnOutline}`} onClick={() => { setContactType('email'); setShowContactModal(true); }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                   Send Email
                 </button>
               </div>

               <div className={styles.cardBadges}>
                 {property.is_verified && (
                   <div className={styles.cardBadgeLine}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                     Verified Property
                   </div>
                 )}
                 {property.is_featured && (
                   <div className={`${styles.cardBadgeLine} ${styles.premium}`}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                     Premium Listing
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className={styles.similarSection}>
          <h2 className={styles.similarTitle}>Similar Properties You May Like</h2>
          {similar.length > 0 ? (
            <div className={styles.similarSlider}>
              {similar.map(p => (
                <div key={p.id} className={styles.similarItem}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptySimilar}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <p>No Similar Properties Available in this city.</p>
            </div>
          )}
        </div>

      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal 
          property={property} 
          inquiryType={contactType} 
          onClose={() => setShowContactModal(false)} 
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className={styles.page}><div className="container"><p>Loading...</p></div></div>}>
      <PropertyData />
    </Suspense>
  );
}

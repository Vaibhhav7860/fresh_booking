'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getProperties } from '@/lib/api';
import styles from './page.module.css';

const QUICK_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const PROPERTY_OPTIONS = [
  { label: 'Flat/Apartment', value: 'flat' },
  { label: 'Villa', value: 'villa' },
  { label: 'Independent House', value: 'independent_house' },
  { label: 'Builder Floor', value: 'builder_floor' },
  { label: 'Plot/Land', value: 'plot' },
  { label: 'Commercial', value: 'office' }
];
const AMENITIES = ['Swimming Pool', 'Gym', 'Parking', 'Garden', '24x7 Security', 'Power Backup', 'Lift', 'Clubhouse', 'Playground', 'Intercom', 'Fire Safety', 'Water Supply'];
const FURNISHING = [
  { label: 'Fully Furnished', value: 'fully_furnished' },
  { label: 'Semi Furnished', value: 'semi_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' }
];
const POSTED_BY = ['Owner', 'Agent', 'Builder'];
const AGE_OPTIONS = ['New Construction', '0-5 Years', '5-10 Years', '10+ Years'];

// Accordion helper
function Accordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.filterSection}>
      <div className={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span>{open ? '∧' : '∨'}</span>
      </div>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCities, setSelectedCities] = useState(searchParams.get('city') ? [searchParams.get('city')] : []);
  const [minBudget, setMinBudget] = useState(searchParams.get('min_budget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('max_budget') || '');
  const [budgetSlider, setBudgetSlider] = useState(0);
  
  const [bhkTypes, setBhkTypes] = useState(searchParams.get('bhk_type') ? searchParams.get('bhk_type').split(',') : []);
  const [propertyTypes, setPropertyTypes] = useState(searchParams.get('property_types') ? searchParams.get('property_types').split(',') : []);
  const [amenities, setAmenities] = useState(searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []);
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') ? searchParams.get('furnishing').split(',') : []);
  const [postedBy, setPostedBy] = useState(searchParams.get('posted_by') ? searchParams.get('posted_by').split(',') : []);
  const [ageOfProperty, setAgeOfProperty] = useState(searchParams.get('age_of_property') ? searchParams.get('age_of_property').split(',') : []);

  const [quickFilter, setQuickFilter] = useState(searchParams.get('quick') || '');

  const toggleArrayItem = (setter, array, item) => {
    if (array.includes(item)) setter(array.filter((i) => i !== item));
    else setter([...array, item]);
  };

  const clearAll = () => {
    setSearchQuery('');
    setSelectedCities([]);
    setMinBudget('');
    setMaxBudget('');
    setBudgetSlider(0);
    setBhkTypes([]);
    setPropertyTypes([]);
    setAmenities([]);
    setFurnishing([]);
    setPostedBy([]);
    setAgeOfProperty([]);
    setQuickFilter('');
  };

  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCities.length > 0) params.set('city', selectedCities[0]);
    
    if (minBudget) params.set('min_budget', minBudget);
    if (maxBudget) params.set('max_budget', maxBudget);
    if (bhkTypes.length > 0) params.set('bhk_type', bhkTypes.map(b => b.replace(' ', '').toLowerCase()).join(','));
    if (propertyTypes.length > 0) params.set('property_types', propertyTypes.join(','));
    if (amenities.length > 0) params.set('amenities', amenities.join(','));
    if (furnishing.length > 0) params.set('furnishing', furnishing.join(','));
    if (postedBy.length > 0) params.set('posted_by', postedBy.join(','));
    if (ageOfProperty.length > 0) params.set('age_of_property', ageOfProperty.join(','));

    // Quick filters logic mapping
    if (quickFilter) {
      params.set('quick', quickFilter);
      if (quickFilter === 'buy') params.set('listing_type', 'sell');
      if (quickFilter === 'rent') params.set('listing_type', 'rent');
      if (quickFilter === 'new_launch') {
        params.set('listing_type', 'sell');
        if (!ageOfProperty.includes('New Construction')) {
          params.set('age_of_property', 'New Construction');
        }
      }
      if (quickFilter === 'commercial') params.set('property_types', 'office,shop');
      if (quickFilter === 'plot') params.set('property_types', 'plot');
    }

    // Push to URL for shareability
    router.push(`/properties?${params.toString()}`, { scroll: false });

    getProperties(params.toString())
      .then(setProperties)
      .finally(() => setLoading(false));
  };

  // Debounce effect for auto-fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCities, searchQuery, minBudget, maxBudget, budgetSlider, bhkTypes, propertyTypes, amenities, furnishing, postedBy, ageOfProperty, quickFilter]);


  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Browse Properties</h1>

        <div className={styles.pageGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2>Filters</h2>
              <button className={styles.clearAllBtn} onClick={clearAll}>Clear All</button>
            </div>

            <Accordion title="Location">
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search city, locality, or project name..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className={styles.chipsGrid}>
                {QUICK_CITIES.map(city => (
                  <button 
                    key={city} 
                    className={`${styles.chip} ${searchQuery.toLowerCase() === city.toLowerCase() || selectedCities.includes(city) ? styles.chipActive : ''}`}
                    onClick={() => {
                      if (searchQuery.toLowerCase() === city.toLowerCase() || selectedCities.includes(city)) {
                        setSearchQuery('');
                        setSelectedCities([]);
                      } else {
                        setSearchQuery(city);
                        setSelectedCities([city]);
                      }
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </Accordion>

            <Accordion title="Budget (in Lakhs)">
              <div className={styles.budgetInputs}>
                <input type="number" className={styles.budgetInput} placeholder="Min" value={minBudget} onChange={e => setMinBudget(e.target.value)} />
                <span>to</span>
                <input type="number" className={styles.budgetInput} placeholder="Max" value={maxBudget} onChange={e => { setMaxBudget(e.target.value); if(e.target.value) setBudgetSlider(Math.min(100, Math.max(0, e.target.value / 100))); }} />
              </div>
              <input 
                type="range" 
                className={styles.budgetSlider} 
                min="0" max="100" 
                value={budgetSlider} 
                onChange={e => { setBudgetSlider(e.target.value); setMaxBudget(e.target.value > 0 ? e.target.value * 10 : ''); }} 
              />
              <div className={styles.budgetLabels}>
                <span>₹0</span>
                <span>₹10 Cr+</span>
              </div>
            </Accordion>

            <Accordion title="BHK Type">
              <div className={styles.bhkGrid}>
                {BHK_OPTIONS.map(bhk => (
                  <div 
                    key={bhk} 
                    className={`${styles.bhkChip} ${bhkTypes.includes(bhk) ? styles.chipActive : ''}`}
                    onClick={() => toggleArrayItem(setBhkTypes, bhkTypes, bhk)}
                  >
                    {bhk}
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Property Type">
              {PROPERTY_OPTIONS.map(type => (
                <label key={type.value} className={styles.checkboxItem}>
                  <input type="checkbox" checked={propertyTypes.includes(type.value)} onChange={() => toggleArrayItem(setPropertyTypes, propertyTypes, type.value)} />
                  {type.label}
                </label>
              ))}
            </Accordion>

            <Accordion title="Amenities" defaultOpen={false}>
              <div className={styles.amenitiesGrid}>
                {AMENITIES.map(amenity => (
                  <label key={amenity} className={styles.checkboxItem} style={{ marginBottom: 0 }}>
                    <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleArrayItem(setAmenities, amenities, amenity)} />
                    {amenity}
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion title="Furnishing Status" defaultOpen={false}>
              {FURNISHING.map(fur => (
                <label key={fur.value} className={styles.checkboxItem}>
                  <input type="checkbox" checked={furnishing.includes(fur.value)} onChange={() => toggleArrayItem(setFurnishing, furnishing, fur.value)} />
                  {fur.label}
                </label>
              ))}
            </Accordion>

            <Accordion title="Posted By" defaultOpen={false}>
              {POSTED_BY.map(poster => (
                <label key={poster} className={styles.checkboxItem}>
                  <input type="checkbox" checked={postedBy.includes(poster)} onChange={() => toggleArrayItem(setPostedBy, postedBy, poster)} />
                  {poster}
                </label>
              ))}
            </Accordion>

            <Accordion title="Age of Property" defaultOpen={false}>
              {AGE_OPTIONS.map(age => (
                <label key={age} className={styles.checkboxItem}>
                  <input type="checkbox" checked={ageOfProperty.includes(age)} onChange={() => toggleArrayItem(setAgeOfProperty, ageOfProperty, age)} />
                  {age}
                </label>
              ))}
            </Accordion>

          </aside>

          {/* Results Area */}
          <main>
            <div className={styles.quickFiltersBar}>
              {[
                { label: 'Buy', value: 'buy' },
                { label: 'Rent', value: 'rent' },
                { label: 'New Launch', value: 'new_launch' },
                { label: 'Commercial', value: 'commercial' },
                { label: 'Plots/Land', value: 'plot' }
              ].map(qf => (
                <button 
                  key={qf.value}
                  onClick={() => setQuickFilter(quickFilter === qf.value ? '' : qf.value)}
                  className={`${styles.qfChip} ${quickFilter === qf.value ? styles.qfChipActive : ''}`}
                >
                  {qf.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className={styles.resultsGrid}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }}></div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <p className={styles.resultCount}>{properties.length} properties found</p>
                <div className={styles.resultsGrid}>
                  {properties.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <span style={{ fontSize: '48px' }}>🔍</span>
                <h2>No properties found</h2>
                <p>Try adjusting your search or filters</p>
                <button className="btn btn-outline" onClick={clearAll} style={{ marginTop: '16px' }}>Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className={styles.page}><div className="container"><p>Loading...</p></div></div>}>
      <PropertiesContent />
    </Suspense>
  );
}

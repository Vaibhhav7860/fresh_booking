'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProperty, uploadImage, CITIES, PROPERTY_TYPES, formatPrice, formatArea } from '@/lib/api';
import AuthModal from '@/components/AuthModal';
import Select from 'react-select';
import styles from './page.module.css';

const STEPS = ['Basic Info', 'Property Details', 'Photos & Price', 'Review & Post'];

const AMENITIES = ['Swimming Pool', 'Gym', 'Parking', 'Garden', '24x7 Security', 'Power Backup', 'Lift', 'Clubhouse', 'Playground', 'Intercom', 'Fire Safety', 'Water Supply'];
const POSTED_BY = ['Owner', 'Agent', 'Builder'];
const AGE_OPTIONS = ['New Construction', '0-5 Years', '5-10 Years', '10+ Years'];
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function PostPropertyPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showAuth, setShowAuth] = useState(false);

  const [form, setForm] = useState({
    listing_type: 'sell',
    property_type: 'flat',
    city: '',
    locality: '',
    project_name: '',
    bhk_type: '2bhk',
    built_up_area: '',
    carpet_area: '',
    bathrooms: 2,
    balconies: 1,
    floor_no: '',
    total_floors: '',
    furnishing: 'semi_furnished',
    description: '',
    expected_price: '',
    maintenance: '',
    amenities: [],
    age_of_property: 'New Construction',
    posted_by: 'Owner',
    facing: '',
    contact_email: '',
    contact_phone: '',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  
  const toggleArrayItem = (key, item) => {
    setForm(prev => {
      const arr = prev[key];
      if (arr.includes(item)) return { ...prev, [key]: arr.filter(i => i !== item) };
      return { ...prev, [key]: [...arr, item] };
    });
  };

  if (!user) {
    return (
      <div className={styles.authPrompt}>
        <div className={styles.authCard}>
          <span style={{ fontSize: '48px' }}>🔐</span>
          <h2>Login Required</h2>
          <p>Please login or create an account to post your property.</p>
          <button className="btn btn-primary btn-large" onClick={() => setShowAuth(true)}>Go to Login</button>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 20 - imageFiles.length;
    const toAdd = files.slice(0, remaining);

    setImageFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Upload images
      const imageIds = [];
      for (const file of imageFiles) {
        const res = await uploadImage(file);
        imageIds.push(res.image_id);
      }

      // Create property
      const propertyData = {
        ...form,
        image_ids: imageIds,
        built_up_area: form.built_up_area ? parseFloat(form.built_up_area) : null,
        carpet_area: form.carpet_area ? parseFloat(form.carpet_area) : null,
        floor_no: form.floor_no ? parseInt(form.floor_no) : null,
        total_floors: form.total_floors ? parseInt(form.total_floors) : null,
        expected_price: form.expected_price ? parseFloat(form.expected_price) : null,
        maintenance: form.maintenance ? parseFloat(form.maintenance) : null,
      };

      await createProperty(propertyData);
      router.push('/my-properties?posted=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.city.length > 0;
    if (step === 1) return form.description.length > 0;
    return true;
  };

  return (
    <div className={styles.page}>
      {/* Progress */}
      <div className={styles.progress}>
        {STEPS.map((s, i) => (
          <div key={i} className={`${styles.step} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
            <div className={styles.stepCircle}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div className={styles.formCard}>
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Basic Information</h2>

            <div className={styles.row}>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>I want to</label>
                <div className={styles.radioGroup}>
                  {[['sell', 'Sell'], ['rent', 'Rent / Lease'], ['pg', 'PG']].map(([val, label]) => (
                    <label key={val} className={`${styles.radio} ${form.listing_type === val ? styles.radioActive : ''}`}>
                      <input type="radio" name="listing_type" value={val} checked={form.listing_type === val} onChange={() => update('listing_type', val)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Posted By</label>
                <div className={styles.radioGroup}>
                  {POSTED_BY.map(val => (
                    <label key={val} className={`${styles.radio} ${form.posted_by === val ? styles.radioActive : ''}`}>
                      <input type="radio" name="posted_by" value={val} checked={form.posted_by === val} onChange={() => update('posted_by', val)} />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {form.posted_by && (
              <div className={styles.row} style={{ marginTop: '4px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact Email</label>
                  <input className="form-input" type="email" placeholder="Enter email address" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact Mobile Number</label>
                  <input className="form-input" type="tel" placeholder="Enter 10-digit mobile number" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} maxLength={10} />
                </div>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Property Type</label>
              <div className={styles.typeGrid}>
                {PROPERTY_TYPES.map(pt => (
                  <button
                    key={pt.value}
                    type="button"
                    className={`${styles.typeCard} ${form.property_type === pt.value ? styles.typeActive : ''}`}
                    onClick={() => update('property_type', pt.value)}
                  >
                    <span className={styles.typeIcon}>{pt.icon}</span>
                    <span className={styles.typeLabel}>{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h3 className={styles.subTitle}>Property Location</h3>

            <div className="form-group">
              <label className="form-label">City</label>
              <Select
                options={CITIES.map(c => ({ value: c, label: c }))}
                value={form.city ? { value: form.city, label: form.city } : null}
                onChange={(selected) => update('city', selected ? selected.value : '')}
                placeholder="Type or select a city..."
                isSearchable={true}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    padding: '6px',
                    borderRadius: '10px',
                    border: state.isFocused ? '1.5px solid var(--primary)' : '1.5px solid var(--border-light)',
                    boxShadow: state.isFocused ? '0 0 0 4px rgba(27, 58, 107, 0.08)' : 'none',
                    '&:hover': { border: '1.5px solid var(--primary)' }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--primary-bg)' : 'white',
                    color: state.isSelected ? 'white' : 'var(--text-dark)',
                    '&:active': { backgroundColor: 'var(--primary)' }
                  })
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Locality / Area</label>
              <input className="form-input" type="text" placeholder="Enter locality" value={form.locality} onChange={(e) => update('locality', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Project / Society Name</label>
              <input className="form-input" type="text" placeholder="Enter project name" value={form.project_name} onChange={(e) => update('project_name', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Property Details</h2>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>BHK Type</label>
              <div className={styles.chipGroup}>
                {['1bhk', '2bhk', '3bhk', '4bhk', '5+bhk'].map(b => (
                  <button key={b} type="button" className={`${styles.chip} ${form.bhk_type === b ? styles.chipActive : ''}`} onClick={() => update('bhk_type', b)}>
                    {b.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Built-up Area</label>
                <div className={styles.inputWithUnit}>
                  <input className="form-input" type="number" placeholder="Enter area" value={form.built_up_area} onChange={(e) => update('built_up_area', e.target.value)} />
                  <span className={styles.unit}>sq.ft</span>
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Carpet Area</label>
                <div className={styles.inputWithUnit}>
                  <input className="form-input" type="number" placeholder="Enter area" value={form.carpet_area} onChange={(e) => update('carpet_area', e.target.value)} />
                  <span className={styles.unit}>sq.ft</span>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Bathrooms</label>
                <div className={styles.chipGroup}>
                  {[1, 2, 3, 4, '5+'].map(b => (
                    <button key={b} type="button" className={`${styles.chip} ${form.bathrooms == b ? styles.chipActive : ''}`} onClick={() => update('bathrooms', b)}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Balconies</label>
                <div className={styles.chipGroup}>
                  {[0, 1, 2, 3, '4+'].map(b => (
                    <button key={b} type="button" className={`${styles.chip} ${form.balconies == b ? styles.chipActive : ''}`} onClick={() => update('balconies', b)}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Floor No.</label>
                <input className="form-input" type="number" placeholder="e.g. 5" value={form.floor_no} onChange={(e) => update('floor_no', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Total Floors</label>
                <input className="form-input" type="number" placeholder="e.g. 20" value={form.total_floors} onChange={(e) => update('total_floors', e.target.value)} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Furnishing</label>
                <div className={styles.chipGroup}>
                  {[['fully_furnished', 'Fully Furnished'], ['semi_furnished', 'Semi-Furnished'], ['unfurnished', 'Unfurnished']].map(([val, label]) => (
                    <button key={val} type="button" className={`${styles.chip} ${form.furnishing === val ? styles.chipActive : ''}`} onClick={() => update('furnishing', val)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Age of Property</label>
                <div className={styles.chipGroup}>
                  {AGE_OPTIONS.map(age => (
                    <button key={age} type="button" className={`${styles.chip} ${form.age_of_property === age ? styles.chipActive : ''}`} onClick={() => update('age_of_property', age)}>
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Facing</label>
              <div className={styles.chipGroup}>
                {FACING_OPTIONS.map(dir => (
                  <button key={dir} type="button" className={`${styles.chip} ${form.facing === dir ? styles.chipActive : ''}`} onClick={() => update('facing', form.facing === dir ? '' : dir)}>
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Amenities</label>
              <div className={styles.typeGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    className={`${styles.typeCard} ${form.amenities.includes(amenity) ? styles.typeActive : ''}`}
                    onClick={() => toggleArrayItem('amenities', amenity)}
                    style={{ padding: '8px 12px' }}
                  >
                    <span className={styles.typeLabel}>{amenity}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Property Description</label>
              <textarea className="form-textarea" placeholder="Describe your property (minimum 30 words)" value={form.description} onChange={(e) => update('description', e.target.value)} rows={5} />
            </div>
          </div>
        )}

        {/* Step 3: Photos & Price */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Photos & Pricing</h2>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Upload Photos</label>
              <div className={styles.uploadZone}>
                <input type="file" accept="image/*" multiple onChange={handleImageAdd} className={styles.fileInput} id="fileInput" />
                <label htmlFor="fileInput" className={styles.uploadLabel}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <p><strong>Drag & drop photos here</strong></p>
                  <p>or click to browse</p>
                  <button type="button" className={styles.chooseBtn}>Choose Files</button>
                  <p className={styles.uploadHint}>Upload up to 20 photos (max 5MB each)</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className={styles.previewGrid}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} className={styles.previewItem}>
                      <img src={src} alt={`Preview ${i + 1}`} />
                      <button className={styles.removeBtn} onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className={styles.subTitle}>Pricing Details</h3>

            <div className="form-group">
              <label className="form-label">Expected Price</label>
              <div className={styles.inputWithUnit}>
                <span className={styles.unitLeft}>₹</span>
                <input className="form-input" style={{ paddingLeft: '36px' }} type="number" placeholder="Enter amount" value={form.expected_price} onChange={(e) => update('expected_price', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Maintenance (Monthly)</label>
              <div className={styles.inputWithUnit}>
                <span className={styles.unitLeft}>₹</span>
                <input className="form-input" style={{ paddingLeft: '36px' }} type="number" placeholder="Enter amount" value={form.maintenance} onChange={(e) => update('maintenance', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewIcon}>✓</div>
              <h2 className={styles.reviewTitle}>Almost Done!</h2>
              <p className={styles.reviewSubtitle}>Review your property details and submit to post your listing.</p>
            </div>

            <div className={styles.reviewCard}>
              <h3 className={styles.reviewCardTitle}>Property Summary</h3>
              <div className={styles.reviewRow}>
                <span>Property Type</span>
                <strong>{PROPERTY_TYPES.find(pt => pt.value === form.property_type)?.label}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Location</span>
                <strong>{[form.locality, form.city].filter(Boolean).join(', ')}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Configuration</span>
                <strong>{form.bhk_type?.toUpperCase()}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Area</span>
                <strong>{form.built_up_area ? formatArea(parseFloat(form.built_up_area)) : 'N/A'}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Price</span>
                <strong>{formatPrice(form.expected_price ? parseFloat(form.expected_price) : 0)}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span>Photos</span>
                <strong>{imageFiles.length} uploaded</strong>
              </div>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {/* Navigation */}
        <div className={styles.navButtons}>
          {step > 0 && (
            <button className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(step - 1)}>Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn btn-primary btn-large" onClick={() => setStep(step + 1)} disabled={!canProceed()}>Continue</button>
          ) : (
            <button className={`btn btn-primary btn-large ${styles.submitFinal}`} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Posting...' : 'Post Property FREE'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

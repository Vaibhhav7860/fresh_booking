'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProperty, uploadImage, CITIES, PROPERTY_TYPES, formatPrice, formatArea } from '@/lib/api';
import AuthModal from '@/components/AuthModal';
import Select from 'react-select';
import styles from './page.module.css';

const STEPS = ['Basic Info', 'Property Details', 'Photos & Price', 'Add / Review', 'Submit All'];

const AMENITIES = ['Swimming Pool', 'Gym', 'Parking', 'Garden', '24x7 Security', 'Power Backup', 'Lift', 'Clubhouse', 'Playground', 'Intercom', 'Fire Safety', 'Water Supply'];
const POSTED_BY = ['Owner', 'Agent', 'Builder'];
const AGE_OPTIONS = ['New Construction', '0-5 Years', '5-10 Years', '10+ Years'];
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];

const INITIAL_FORM = {
  listing_type: 'sell', property_type: 'flat', city: '', locality: '', project_name: '',
  bhk_type: '2bhk', built_up_area: '', carpet_area: '', bathrooms: 2, balconies: 1,
  floor_no: '', total_floors: '', furnishing: 'semi_furnished', description: '',
  expected_price: '', maintenance: '', amenities: [], age_of_property: 'New Construction',
  posted_by: 'Owner', facing: '', contact_email: '', contact_phone: '',
};

export default function PostPropertyPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [postingIndex, setPostingIndex] = useState(-1);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Batch: list of completed properties
  const [propertiesList, setPropertiesList] = useState([]);
  const [propertiesImages, setPropertiesImages] = useState([]);

  const [form, setForm] = useState({ ...INITIAL_FORM });

  const update = (key, val) => { setForm(prev => ({ ...prev, [key]: val })); setFieldErrors(prev => { const n = { ...prev }; delete n[key]; return n; }); };
  
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
    setFieldErrors(prev => { const n = { ...prev }; delete n.images; return n; });
  };

  const removeImage = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // --- Validation ---
  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.city) errs.city = 'City is required';
      if (!form.locality.trim()) errs.locality = 'Locality is required';
      if (!form.project_name.trim()) errs.project_name = 'Project name is required';
      if (!form.contact_email.trim()) errs.contact_email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.contact_email)) errs.contact_email = 'Enter a valid email';
      if (!form.contact_phone.trim()) errs.contact_phone = 'Phone number is required';
      else if (form.contact_phone.trim().length !== 10) errs.contact_phone = 'Enter a valid 10-digit number';
    } else if (s === 1) {
      if (!form.built_up_area) errs.built_up_area = 'Built-up area is required';
      if (!form.carpet_area) errs.carpet_area = 'Carpet area is required';
      if (!form.floor_no) errs.floor_no = 'Floor number is required';
      if (!form.total_floors) errs.total_floors = 'Total floors is required';
      if (!form.description.trim()) errs.description = 'Description is required';
      else if (form.description.trim().split(/\s+/).length < 10) errs.description = 'Description must be at least 10 words';
    } else if (s === 2) {
      if (!form.expected_price) errs.expected_price = 'Expected price is required';
      if (imageFiles.length === 0) errs.images = 'Please upload at least 1 photo';
    }
    return errs;
  };

  const tryProceed = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please fill in all required fields');
      return;
    }
    setFieldErrors({});
    setError('');
    setStep(step + 1);
  };

  // --- Batch: Add another property ---
  const addAnotherProperty = () => {
    setPropertiesList(prev => [...prev, { ...form }]);
    setPropertiesImages(prev => [...prev, { files: [...imageFiles], previews: [...imagePreviews] }]);
    setForm({ ...INITIAL_FORM });
    setImageFiles([]);
    setImagePreviews([]);
    setFieldErrors({});
    setError('');
    setStep(0);
  };

  const removeFromBatch = (idx) => {
    setPropertiesList(prev => prev.filter((_, i) => i !== idx));
    setPropertiesImages(prev => prev.filter((_, i) => i !== idx));
  };

  // --- Submit all ---
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    // Combine current form as the last property
    const allProps = [...propertiesList, { ...form }];
    const allImages = [...propertiesImages, { files: [...imageFiles], previews: [...imagePreviews] }];
    try {
      for (let i = 0; i < allProps.length; i++) {
        setPostingIndex(i);
        const prop = allProps[i];
        const imgs = allImages[i];
        const imageIds = [];
        for (const file of imgs.files) {
          const res = await uploadImage(file);
          imageIds.push(res.image_id);
        }
        const propertyData = {
          ...prop, image_ids: imageIds,
          built_up_area: prop.built_up_area ? parseFloat(prop.built_up_area) : null,
          carpet_area: prop.carpet_area ? parseFloat(prop.carpet_area) : null,
          floor_no: prop.floor_no ? parseInt(prop.floor_no) : null,
          total_floors: prop.total_floors ? parseInt(prop.total_floors) : null,
          expected_price: prop.expected_price ? parseFloat(prop.expected_price) : null,
          maintenance: prop.maintenance ? parseFloat(prop.maintenance) : null,
          bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
          balconies: prop.balconies !== undefined ? parseInt(prop.balconies) : null,
        };
        await createProperty(propertyData);
      }
      router.push('/my-properties?posted=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPostingIndex(-1);
    }
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
                  <label className="form-label">Contact Email *</label>
                  <input className={`form-input ${fieldErrors.contact_email ? styles.inputError : ''}`} type="email" placeholder="Enter email address" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)} />
                  {fieldErrors.contact_email && <span className={styles.fieldError}>{fieldErrors.contact_email}</span>}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact Mobile Number *</label>
                  <input className={`form-input ${fieldErrors.contact_phone ? styles.inputError : ''}`} type="tel" placeholder="Enter 10-digit mobile number" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} maxLength={10} />
                  {fieldErrors.contact_phone && <span className={styles.fieldError}>{fieldErrors.contact_phone}</span>}
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
                instanceId="city-select"
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
              {fieldErrors.city && <span className={styles.fieldError}>{fieldErrors.city}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Locality / Area *</label>
              <input className={`form-input ${fieldErrors.locality ? styles.inputError : ''}`} type="text" placeholder="Enter locality" value={form.locality} onChange={(e) => update('locality', e.target.value)} />
              {fieldErrors.locality && <span className={styles.fieldError}>{fieldErrors.locality}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Project / Society Name *</label>
              <input className={`form-input ${fieldErrors.project_name ? styles.inputError : ''}`} type="text" placeholder="Enter project name" value={form.project_name} onChange={(e) => update('project_name', e.target.value)} />
              {fieldErrors.project_name && <span className={styles.fieldError}>{fieldErrors.project_name}</span>}
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
                <label className="form-label">Built-up Area *</label>
                <div className={styles.inputWithUnit}>
                  <input className={`form-input ${fieldErrors.built_up_area ? styles.inputError : ''}`} type="number" placeholder="Enter area" value={form.built_up_area} onChange={(e) => update('built_up_area', e.target.value)} />
                  <span className={styles.unit}>sq.ft</span>
                </div>
                {fieldErrors.built_up_area && <span className={styles.fieldError}>{fieldErrors.built_up_area}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Carpet Area *</label>
                <div className={styles.inputWithUnit}>
                  <input className={`form-input ${fieldErrors.carpet_area ? styles.inputError : ''}`} type="number" placeholder="Enter area" value={form.carpet_area} onChange={(e) => update('carpet_area', e.target.value)} />
                  <span className={styles.unit}>sq.ft</span>
                </div>
                {fieldErrors.carpet_area && <span className={styles.fieldError}>{fieldErrors.carpet_area}</span>}
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
                <label className="form-label">Floor No. *</label>
                <input className={`form-input ${fieldErrors.floor_no ? styles.inputError : ''}`} type="number" placeholder="e.g. 5" value={form.floor_no} onChange={(e) => update('floor_no', e.target.value)} />
                {fieldErrors.floor_no && <span className={styles.fieldError}>{fieldErrors.floor_no}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Total Floors *</label>
                <input className={`form-input ${fieldErrors.total_floors ? styles.inputError : ''}`} type="number" placeholder="e.g. 20" value={form.total_floors} onChange={(e) => update('total_floors', e.target.value)} />
                {fieldErrors.total_floors && <span className={styles.fieldError}>{fieldErrors.total_floors}</span>}
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
              <label className="form-label">Property Description *</label>
              <textarea className={`form-textarea ${fieldErrors.description ? styles.inputError : ''}`} placeholder="Describe your property (minimum 10 words)" value={form.description} onChange={(e) => update('description', e.target.value)} rows={5} />
              {fieldErrors.description && <span className={styles.fieldError}>{fieldErrors.description}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Photos & Price */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Photos & Pricing</h2>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Upload Photos *</label>
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
              {fieldErrors.images && <span className={styles.fieldError}>{fieldErrors.images}</span>}

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
              <label className="form-label">Expected Price *</label>
              <div className={styles.inputWithUnit}>
                <span className={styles.unitLeft}>₹</span>
                <input className={`form-input ${fieldErrors.expected_price ? styles.inputError : ''}`} style={{ paddingLeft: '36px' }} type="number" placeholder="Enter amount" value={form.expected_price} onChange={(e) => update('expected_price', e.target.value)} />
              </div>
              {fieldErrors.expected_price && <span className={styles.fieldError}>{fieldErrors.expected_price}</span>}
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

        {/* Step 4: Add Another or Continue */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewIcon}>✓</div>
              <h2 className={styles.reviewTitle}>Property Added!</h2>
              <p className={styles.reviewSubtitle}>Would you like to add another property or review and submit?</p>
            </div>

            <div className={styles.reviewCard}>
              <h3 className={styles.reviewCardTitle}>Current Property Summary</h3>
              <div className={styles.reviewRow}><span>Property Type</span><strong>{PROPERTY_TYPES.find(pt => pt.value === form.property_type)?.label}</strong></div>
              <div className={styles.reviewRow}><span>Location</span><strong>{[form.locality, form.city].filter(Boolean).join(', ')}</strong></div>
              <div className={styles.reviewRow}><span>Configuration</span><strong>{form.bhk_type?.toUpperCase()}</strong></div>
              <div className={styles.reviewRow}><span>Area</span><strong>{form.built_up_area ? formatArea(parseFloat(form.built_up_area)) : 'N/A'}</strong></div>
              <div className={styles.reviewRow}><span>Price</span><strong>{formatPrice(form.expected_price ? parseFloat(form.expected_price) : 0)}</strong></div>
              <div className={styles.reviewRow}><span>Photos</span><strong>{imageFiles.length} uploaded</strong></div>
            </div>

            {propertiesList.length > 0 && (
              <p className={styles.batchCount}>📦 {propertiesList.length} other {propertiesList.length === 1 ? 'property' : 'properties'} already in batch</p>
            )}

            <div className={styles.addAnotherActions}>
              <button className={styles.addAnotherBtn} onClick={addAnotherProperty}>
                <span className={styles.addIcon}>＋</span>
                Add Another Property
              </button>
              <button className="btn btn-primary btn-large" onClick={() => setStep(4)}>
                Continue to Review All →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review All & Submit */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewIcon}>📋</div>
              <h2 className={styles.reviewTitle}>Review All Properties</h2>
              <p className={styles.reviewSubtitle}>
                {propertiesList.length + 1} {propertiesList.length + 1 === 1 ? 'property' : 'properties'} ready to post
              </p>
            </div>

            {[...propertiesList, form].map((prop, idx) => {
              const imgs = idx < propertiesImages.length ? propertiesImages[idx] : { files: imageFiles, previews: imagePreviews };
              return (
                <div key={idx} className={styles.reviewCard} style={{ marginBottom: '16px' }}>
                  <div className={styles.batchCardHeader}>
                    <h3 className={styles.reviewCardTitle}>
                      <span className={styles.batchBadge}>{idx + 1}</span>
                      {prop.project_name || 'Property'} — {prop.city}
                    </h3>
                    {(propertiesList.length > 0 && idx < propertiesList.length) && (
                      <button className={styles.removePropertyBtn} onClick={() => removeFromBatch(idx)}>Remove</button>
                    )}
                  </div>
                  <div className={styles.reviewRow}><span>Type</span><strong>{PROPERTY_TYPES.find(pt => pt.value === prop.property_type)?.label}</strong></div>
                  <div className={styles.reviewRow}><span>Location</span><strong>{[prop.locality, prop.city].filter(Boolean).join(', ')}</strong></div>
                  <div className={styles.reviewRow}><span>Config</span><strong>{prop.bhk_type?.toUpperCase()}</strong></div>
                  <div className={styles.reviewRow}><span>Area</span><strong>{prop.built_up_area ? formatArea(parseFloat(prop.built_up_area)) : 'N/A'}</strong></div>
                  <div className={styles.reviewRow}><span>Price</span><strong>{formatPrice(prop.expected_price ? parseFloat(prop.expected_price) : 0)}</strong></div>
                  <div className={styles.reviewRow}><span>Photos</span><strong>{imgs.files.length} uploaded</strong></div>
                </div>
              );
            })}

            {loading && (
              <div className={styles.postingProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${((postingIndex + 1) / (propertiesList.length + 1)) * 100}%` }}></div>
                </div>
                <p>Posting property {postingIndex + 1} of {propertiesList.length + 1}...</p>
              </div>
            )}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {/* Navigation */}
        <div className={styles.navButtons}>
          {step > 0 && step !== 4 && (
            <button className={`btn btn-outline ${styles.backBtn}`} onClick={() => { setStep(step - 1); setFieldErrors({}); setError(''); }}>Back</button>
          )}
          {step === 4 && (
            <button className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(3)}>Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 && (
            <button className="btn btn-primary btn-large" onClick={tryProceed}>Continue</button>
          )}
          {step === 4 && (
            <button className={`btn btn-primary btn-large ${styles.submitFinal}`} onClick={handleSubmit} disabled={loading}>
              {loading ? `Posting ${postingIndex + 1} of ${propertiesList.length + 1}...` : `Post ${propertiesList.length + 1 === 1 ? 'Property' : `All ${propertiesList.length + 1} Properties`} FREE`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

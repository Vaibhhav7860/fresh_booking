'use client';
import { useState } from 'react';
import { apiFetch, formatPrice } from '@/lib/api';
import { X, CheckCircle2 } from 'lucide-react';
import styles from './ContactModal.module.css';

export default function ContactModal({ property, inquiryType, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // Derived property title
  const config = property.bhk_type ? property.bhk_type.toUpperCase() : '';
  const ptMap = { flat: 'Apartment', independent_house: 'Independent House', villa: 'Villa', plot: 'Plot/Land', office: 'Office', shop: 'Shop' };
  const pTypeStr = ptMap[property.property_type] || 'Property';
  let titleStr = property.project_name ? property.project_name : `${config} ${pTypeStr}`;
  if (property.locality) titleStr += ` in ${property.locality}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('All fields are required.');
      return;
    }
    if (form.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          property_id: property.id,
          inquiry_type: inquiryType,
        }),
      });
      setOwnerDetails({
        email: res.owner_contact_email,
        phone: res.owner_contact_phone,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

        {!submitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.headerIcon}>
                {inquiryType === 'email' ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                )}
              </div>
              <h2 className={styles.title}>
                {inquiryType === 'email' ? 'Request Owner Email ' : 'Contact Owner'}
              </h2>
              <p className={styles.subtitle}>Fill in your details to get the owner&apos;s contact info</p>
            </div>

            {/* Property Summary */}
            <div className={styles.propertySummary}>
              <div className={styles.propertyBadge}>Interested In</div>
              <h3 className={styles.propertyName}>{titleStr}</h3>
              <div className={styles.propertyMeta}>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {[property.locality, property.city].filter(Boolean).join(', ')}
                </span>
                <span className={styles.propertyPrice}>{formatPrice(property.expected_price)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Mobile Number</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit & View Contact Details'}
              </button>

              <p className={styles.privacyNote}>
                By submitting, you agree to our Terms of Use and Privacy Policy.
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}><CheckCircle2 size={48} /></div>
            <h2 className={styles.successTitle}>Inquiry Submitted!</h2>
            <p className={styles.successSub}>Your request has been sent to the admin. Here are the owner&apos;s contact details:</p>

            <div className={styles.ownerCard}>
              <h3 className={styles.ownerCardTitle}>Owner Contact Details</h3>
              {ownerDetails?.phone && (
                <div className={styles.ownerRow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  <span>{ownerDetails.phone}</span>
                </div>
              )}
              {ownerDetails?.email && (
                <div className={styles.ownerRow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>{ownerDetails.email}</span>
                </div>
              )}
              {!ownerDetails?.phone && !ownerDetails?.email && (
                <p className={styles.noContact}>Contact details are not available yet. The admin will get back to you shortly.</p>
              )}
            </div>

            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

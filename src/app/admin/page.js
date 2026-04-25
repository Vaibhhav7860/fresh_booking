'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsers, deleteUser, getAdminProperties, toggleFeature, toggleVerify, toggleNewLaunch, toggleTrending, deleteProperty as adminDeleteProp, getInquiries, formatPrice, getAdminBanners, createBanner, deleteBanner, uploadImage, getImageUrl } from '@/lib/api';
import { Lock, Star, BadgeCheck, Construction, TrendingUp, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('properties');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Banner form state
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [bannerPropertyId, setBannerPropertyId] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerOrder, setBannerOrder] = useState(0);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([getUsers(), getAdminProperties(), getInquiries(), getAdminBanners()])
        .then(([u, p, i, b]) => { setUsers(u); setProperties(p); setInquiries(i || []); setBanners(b || []); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user and all their properties?')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setProperties(prev => prev.filter(p => p.user_id !== id));
    showToast('User deleted');
  };

  const handleToggleFeature = async (id) => {
    const res = await toggleFeature(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_featured: res.is_featured } : p));
    showToast(res.is_featured ? 'Property featured' : 'Feature removed');
  };

  const handleToggleVerify = async (id) => {
    const res = await toggleVerify(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_verified: res.is_verified } : p));
    showToast(res.is_verified ? 'Property verified' : 'Verification removed');
  };

  const handleToggleNewLaunch = async (id) => {
    const res = await toggleNewLaunch(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_new_launch: res.is_new_launch } : p));
    showToast(res.is_new_launch ? 'Marked as New Launch' : 'New Launch removed');
  };

  const handleToggleTrending = async (id) => {
    const res = await toggleTrending(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_trending: res.is_trending } : p));
    showToast(res.is_trending ? 'Marked as Trending' : 'Trending removed');
  };

  const handleDeleteProperty = async (id) => {
    if (!confirm('Delete this property?')) return;
    await adminDeleteProp(id);
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Property deleted');
  };

  // Banner handlers
  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!bannerFile) return showToast('Please select a banner image');
    if (!bannerPropertyId) return showToast('Please select a property');

    setBannerUploading(true);
    try {
      // Upload the image first
      const imgRes = await uploadImage(bannerFile);
      // Create the banner
      const banner = await createBanner({
        image_id: imgRes.image_id,
        property_id: bannerPropertyId,
        title: bannerTitle,
        order: parseInt(bannerOrder) || 0,
        is_active: true,
      });
      setBanners(prev => [...prev, banner].sort((a, b) => a.order - b.order));
      // Reset form
      setBannerFile(null);
      setBannerPreview('');
      setBannerPropertyId('');
      setBannerTitle('');
      setBannerOrder(0);
      setBannerFormOpen(false);
      showToast('Banner created successfully');
    } catch (err) {
      showToast('Failed to create banner: ' + err.message);
    } finally {
      setBannerUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
      showToast('Banner deleted');
    } catch (err) {
      showToast('Failed to delete banner');
    }
  };

  // Filter properties for dropdown search
  const filteredProperties = propertySearch.trim()
    ? properties.filter(p =>
        (p.project_name || '').toLowerCase().includes(propertySearch.toLowerCase()) ||
        (p.city || '').toLowerCase().includes(propertySearch.toLowerCase()) ||
        (p.property_type || '').toLowerCase().includes(propertySearch.toLowerCase())
      )
    : properties;

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.denied}>
        <Lock size={48} strokeWidth={1.5} />
        <h2>Admin Access Required</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Admin Dashboard</h1>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{properties.length}</span>
            <span className={styles.statLabel}>Total Properties</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{properties.filter(p => p.is_featured).length}</span>
            <span className={styles.statLabel}>Featured</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{properties.filter(p => p.is_verified).length}</span>
            <span className={styles.statLabel}>Verified</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{properties.filter(p => p.is_new_launch).length}</span>
            <span className={styles.statLabel}>New Launches</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{banners.length}</span>
            <span className={styles.statLabel}>Banners</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'properties' ? styles.tabActive : ''}`} onClick={() => setTab('properties')}>Properties ({properties.length})</button>
          <button className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
          <button className={`${styles.tab} ${tab === 'inquiries' ? styles.tabActive : ''}`} onClick={() => setTab('inquiries')}>Enquiries ({inquiries.length})</button>
          <button className={`${styles.tab} ${tab === 'banners' ? styles.tabActive : ''}`} onClick={() => setTab('banners')}>Banners ({banners.length})</button>
        </div>

        {tab === 'properties' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Property</span>
              <span>City</span>
              <span>Price</span>
              <span>Owner</span>
              <span className={styles.actionHeaders}>
                <span className={styles.actionHeaderItem}>Featured</span>
                <span className={styles.actionHeaderItem}>Verify</span>
                <span className={styles.actionHeaderItem}>New Launch</span>
                <span className={styles.actionHeaderItem}>Trending</span>
                <span className={styles.actionHeaderItem}>Delete</span>
              </span>
            </div>
            {properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => (
              <div key={p.id} className={styles.tableRow}>
                <span className={styles.propName}>{p.project_name || p.property_type}</span>
                <span>{p.city}</span>
                <span>{formatPrice(p.expected_price)}</span>
                <span>{p.user_name}</span>
                <span className={styles.actions}>
                  <button className={`${styles.actionBtn} ${p.is_featured ? styles.activeAction : ''}`} onClick={() => handleToggleFeature(p.id)} title="Toggle Featured"><Star size={16} /></button>
                  <button className={`${styles.actionBtn} ${p.is_verified ? styles.activeAction : ''}`} onClick={() => handleToggleVerify(p.id)} title="Toggle Verified"><BadgeCheck size={16} /></button>
                  <button className={`${styles.actionBtn} ${p.is_new_launch ? styles.activeAction : ''}`} onClick={() => handleToggleNewLaunch(p.id)} title="Toggle New Launch"><Construction size={16} /></button>
                  <button className={`${styles.actionBtn} ${p.is_trending ? styles.activeAction : ''}`} onClick={() => handleToggleTrending(p.id)} title="Toggle Trending"><TrendingUp size={16} /></button>
                  <button className={styles.actionBtnDanger} onClick={() => handleDeleteProperty(p.id)} title="Delete"><Trash2 size={16} /></button>
                </span>
              </div>
            ))}
            {properties.length > itemsPerPage && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {Math.ceil(properties.length / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(properties.length / itemsPerPage), p + 1))} 
                  disabled={currentPage === Math.ceil(properties.length / itemsPerPage)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Role</span>
              <span>Actions</span>
            </div>
            {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(u => (
              <div key={u.id} className={styles.tableRow}>
                <span className={styles.propName}>{u.name}</span>
                <span>{u.email}</span>
                <span>{u.phone}</span>
                <span><span className={u.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadge}>{u.role}</span></span>
                <span>
                  {u.id !== user.id && (
                    <button className={styles.actionBtnDanger} onClick={() => handleDeleteUser(u.id)}>Delete</button>
                  )}
                </span>
              </div>
            ))}
            {users.length > itemsPerPage && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {Math.ceil(users.length / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(users.length / itemsPerPage), p + 1))} 
                  disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'inquiries' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Date</span>
              <span>Lead Name</span>
              <span>Contact</span>
              <span>Property Interest</span>
              <span>Type</span>
            </div>
            {inquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(inq => (
              <div key={inq.id} className={styles.tableRow}>
                <span className={styles.propName}>
                  {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span>{inq.name}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {inq.phone && <span style={{ fontSize: '13px', fontWeight: '600' }}><Phone size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{inq.phone}</span>}
                  {inq.email && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}><Mail size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{inq.email}</span>}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{inq.property_title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />{inq.property_city}</span>
                </span>
                <span>
                  <span className={styles.roleBadge} style={{ backgroundColor: inq.inquiry_type === 'email' ? '#EBF5FF' : '#F3E8FF', color: inq.inquiry_type === 'email' ? '#1E40AF' : '#6B21A8' }}>
                    {inq.inquiry_type === 'email' ? 'Email Request' : 'Contact Reveal'}
                  </span>
                </span>
              </div>
            ))}
            {inquiries.length > itemsPerPage && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {Math.ceil(inquiries.length / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(inquiries.length / itemsPerPage), p + 1))} 
                  disabled={currentPage === Math.ceil(inquiries.length / itemsPerPage)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'banners' && (
          <div className={styles.bannersSection}>
            <div className={styles.bannerHeader}>
              <h2 className={styles.bannerSectionTitle}>Hero Carousel Banners</h2>
              <button className={styles.addBannerBtn} onClick={() => setBannerFormOpen(!bannerFormOpen)}>
                {bannerFormOpen ? '✕ Cancel' : '+ Add Banner'}
              </button>
            </div>

            {/* Add Banner Form */}
            {bannerFormOpen && (
              <form className={styles.bannerForm} onSubmit={handleCreateBanner}>
                <div className={styles.bannerFormGrid}>
                  {/* Image Upload */}
                  <div className={styles.bannerUploadArea}>
                    <label className={styles.bannerUploadLabel}>
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Preview" className={styles.bannerPreviewImg} />
                      ) : (
                        <div className={styles.bannerUploadPlaceholder}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>Click to upload banner image</span>
                          <span className={styles.bannerUploadHint}>Recommended: 1920×500px, Max 5MB</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleBannerFileChange} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className={styles.bannerFormFields}>
                    <div className={styles.bannerField}>
                      <label className={styles.bannerFieldLabel}>Link to Property *</label>
                      <input
                        type="text"
                        className={styles.bannerFieldInput}
                        placeholder="Search properties by name, city..."
                        value={propertySearch}
                        onChange={(e) => setPropertySearch(e.target.value)}
                      />
                      <div className={styles.propertyDropdown}>
                        {filteredProperties.map(p => (
                          <button
                            type="button"
                            key={p.id}
                            className={`${styles.propertyOption} ${bannerPropertyId === p.id ? styles.propertyOptionSelected : ''}`}
                            onClick={() => { setBannerPropertyId(p.id); setPropertySearch(p.project_name || p.property_type + ' - ' + p.city); }}
                          >
                            <span className={styles.propertyOptionName}>{p.project_name || p.property_type}</span>
                            <span className={styles.propertyOptionMeta}>{p.city} · {formatPrice(p.expected_price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.bannerFieldRow}>
                      <div className={styles.bannerField}>
                        <label className={styles.bannerFieldLabel}>Banner Title (optional)</label>
                        <input
                          type="text"
                          className={styles.bannerFieldInput}
                          placeholder="e.g. Premium Villas in Pune"
                          value={bannerTitle}
                          onChange={(e) => setBannerTitle(e.target.value)}
                        />
                      </div>
                      <div className={styles.bannerField} style={{ maxWidth: '120px' }}>
                        <label className={styles.bannerFieldLabel}>Order</label>
                        <input
                          type="number"
                          className={styles.bannerFieldInput}
                          value={bannerOrder}
                          onChange={(e) => setBannerOrder(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.bannerSubmitBtn} disabled={bannerUploading}>
                      {bannerUploading ? (
                        <>
                          <span className={styles.spinner}></span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Create Banner
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Banner List */}
            {banners.length === 0 ? (
              <div className={styles.emptyBanners}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <h3>No Banners Yet</h3>
                <p>Add your first hero carousel banner to showcase featured properties.</p>
              </div>
            ) : (
              <div className={styles.bannerGrid}>
                {banners.map((banner, idx) => (
                  <div key={banner.id} className={styles.bannerCard}>
                    <div className={styles.bannerCardImg}>
                      <img src={getImageUrl(banner.image_id)} alt={banner.title || 'Banner'} />
                      <div className={styles.bannerCardOrder}>#{banner.order}</div>
                    </div>
                    <div className={styles.bannerCardInfo}>
                      <div className={styles.bannerCardTitle}>{banner.title || 'Untitled Banner'}</div>
                      <div className={styles.bannerCardMeta}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {banner.property_title} · {banner.property_city}
                      </div>
                      {banner.property_price && (
                        <div className={styles.bannerCardPrice}>{formatPrice(banner.property_price)}</div>
                      )}
                    </div>
                    <button className={styles.bannerDeleteBtn} onClick={() => handleDeleteBanner(banner.id)} title="Delete banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

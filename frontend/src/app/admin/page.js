'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsers, deleteUser, getAdminProperties, toggleFeature, toggleVerify, toggleNewLaunch, toggleTrending, deleteProperty as adminDeleteProp, getInquiries, formatPrice } from '@/lib/api';
import styles from './page.module.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('properties');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([getUsers(), getAdminProperties(), getInquiries()])
        .then(([u, p, i]) => { setUsers(u); setProperties(p); setInquiries(i || []); })
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

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.denied}>
        <span style={{ fontSize: '48px' }}>🔒</span>
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
            <span className={styles.statNum}>{properties.filter(p => p.is_trending).length}</span>
            <span className={styles.statLabel}>Trending</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'properties' ? styles.tabActive : ''}`} onClick={() => setTab('properties')}>Properties ({properties.length})</button>
          <button className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
          <button className={`${styles.tab} ${tab === 'inquiries' ? styles.tabActive : ''}`} onClick={() => setTab('inquiries')}>Enquiries ({inquiries.length})</button>
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
                  <button className={`${styles.actionBtn} ${p.is_featured ? styles.activeAction : ''}`} onClick={() => handleToggleFeature(p.id)} title="Toggle Featured">⭐</button>
                  <button className={`${styles.actionBtn} ${p.is_verified ? styles.activeAction : ''}`} onClick={() => handleToggleVerify(p.id)} title="Toggle Verified">✓</button>
                  <button className={`${styles.actionBtn} ${p.is_new_launch ? styles.activeAction : ''}`} onClick={() => handleToggleNewLaunch(p.id)} title="Toggle New Launch">🏗️</button>
                  <button className={`${styles.actionBtn} ${p.is_trending ? styles.activeAction : ''}`} onClick={() => handleToggleTrending(p.id)} title="Toggle Trending">📈</button>
                  <button className={styles.actionBtnDanger} onClick={() => handleDeleteProperty(p.id)} title="Delete">🗑</button>
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
                  {inq.phone && <span style={{ fontSize: '13px', fontWeight: '600' }}>📞 {inq.phone}</span>}
                  {inq.email && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>✉️ {inq.email}</span>}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{inq.property_title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 {inq.property_city}</span>
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
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

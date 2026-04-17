'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsers, deleteUser, getProperties, toggleFeature, toggleVerify, deleteProperty as adminDeleteProp, formatPrice } from '@/lib/api';
import styles from './page.module.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('properties');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([getUsers(), getProperties()])
        .then(([u, p]) => { setUsers(u); setProperties(p); })
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
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'properties' ? styles.tabActive : ''}`} onClick={() => setTab('properties')}>Properties ({properties.length})</button>
          <button className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
        </div>

        {tab === 'properties' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Property</span>
              <span>City</span>
              <span>Price</span>
              <span>Owner</span>
              <span>Actions</span>
            </div>
            {properties.map(p => (
              <div key={p.id} className={styles.tableRow}>
                <span className={styles.propName}>{p.project_name || p.property_type}</span>
                <span>{p.city}</span>
                <span>{formatPrice(p.expected_price)}</span>
                <span>{p.user_name}</span>
                <span className={styles.actions}>
                  <button className={`${styles.actionBtn} ${p.is_featured ? styles.activeAction : ''}`} onClick={() => handleToggleFeature(p.id)} title="Toggle Featured">⭐</button>
                  <button className={`${styles.actionBtn} ${p.is_verified ? styles.activeAction : ''}`} onClick={() => handleToggleVerify(p.id)} title="Toggle Verified">✓</button>
                  <button className={styles.actionBtnDanger} onClick={() => handleDeleteProperty(p.id)} title="Delete">🗑</button>
                </span>
              </div>
            ))}
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
            {users.map(u => (
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
          </div>
        )}
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

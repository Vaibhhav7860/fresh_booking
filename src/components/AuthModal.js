'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';
import styles from './AuthModal.module.css';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(form.name, form.email, form.phone, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`} onClick={() => { setTab('login'); setError(''); }}>Login</button>
          <button className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {tab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>

          {tab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                required minLength={6} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7394', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  className="form-input" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Confirm your password" 
                  value={form.confirmPassword} 
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})} 
                  required minLength={6} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7394', display: 'flex', alignItems: 'center' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={`btn btn-primary btn-large ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className={styles.switchBtn} onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}>
            {tab === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

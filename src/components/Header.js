'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoFresh}>Fresh</span>
            <span className={styles.logoBooking}>Booking</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            <Link href="/properties?quick=buy" className={styles.navLink}>Buy</Link>
            <Link href="/properties?quick=rent" className={styles.navLink}>Rent</Link>
            <Link href="/properties/new-launches" className={styles.navLink}>
              New Launch <span className={styles.newDot}></span>
            </Link>
            <Link href="/properties?quick=commercial" className={styles.navLink}>Commercial</Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/post-property" className={styles.postBtn}>
              Post Property <span className={styles.freeBadge}>FREE</span>
            </Link>

            {user ? (
              <div className={styles.profileWrap} ref={profileRef}>
                <button className={styles.profileBtn} onClick={() => setProfileMenu(!profileMenu)}>
                  <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                </button>
                {profileMenu && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <Link href="/my-properties" className={styles.dropdownItem} onClick={() => setProfileMenu(false)}>
                      My Properties
                    </Link>
                    <Link href="/post-property" className={styles.dropdownItem} onClick={() => setProfileMenu(false)}>
                      Post Property
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className={styles.dropdownItem} onClick={() => setProfileMenu(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <div className={styles.dropdownDivider}></div>
                    <button className={styles.dropdownItem} onClick={() => { logout(); setProfileMenu(false); }}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setShowAuth(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Login
              </button>
            )}

            {/* Mobile Hamburger */}
            <button className={styles.hamburger} onClick={() => setMobileMenu(!mobileMenu)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className={styles.mobileMenu}>
            <Link href="/properties?quick=buy" onClick={() => setMobileMenu(false)}>Buy Property</Link>
            <Link href="/properties?quick=rent" onClick={() => setMobileMenu(false)}>Rent Property</Link>
            <Link href="/properties/new-launches" onClick={() => setMobileMenu(false)}>New Launch</Link>
            <Link href="/properties?quick=commercial" onClick={() => setMobileMenu(false)}>Commercial</Link>
            <Link href="/post-property" onClick={() => setMobileMenu(false)}>Post Property</Link>
            {user && <Link href="/my-properties" onClick={() => setMobileMenu(false)}>My Properties</Link>}
            {user?.role === 'admin' && <Link href="/admin" onClick={() => setMobileMenu(false)}>Admin Dashboard</Link>}
            {user ? (
              <button onClick={() => { logout(); setMobileMenu(false); }}>Logout</button>
            ) : (
              <button onClick={() => { setShowAuth(true); setMobileMenu(false); }}>Login / Sign Up</button>
            )}
          </div>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

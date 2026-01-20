import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiCamera, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Berhasil logout')
      navigate('/')
    } catch (error) {
      toast.error('Gagal logout')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to={currentUser ? "/beranda" : "/"} className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src="/gambar/LOGO.png" alt="GO TANY Logo" />
          </div>
          <div className={styles.logoText}>
            <span className={styles.brandName}>GO TANY</span>
            <span className={styles.tagline}>Organic Solutions</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <button 
            className={styles.closeMenuBtn}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX />
          </button>
          <ul className={styles.navMenu}>
            <li>
              <Link 
                to="/beranda" 
                className={isActive('/beranda') ? styles.active : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link 
                to="/database" 
                className={isActive('/database') ? styles.active : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Database Penyakit
              </Link>
            </li>
            <li>
              <Link 
                to="/scan" 
                className={isActive('/scan') ? styles.active : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Scan Tanaman
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <button 
            type="button" 
            className={styles.scanButton}
            onClick={() => navigate('/scan')}
          >
            <FiCamera />
            <span>Scan</span>
          </button>

          {currentUser ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button 
                className={styles.userButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userAvatar}>
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <span className={styles.userName}>
                  {currentUser.displayName || 'User'}
                </span>
                <FiChevronDown className={`${styles.chevron} ${userMenuOpen ? styles.open : ''}`} />
              </button>
              
              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{currentUser.displayName || 'User'}</p>
                    <p className={styles.dropdownEmail}>{currentUser.email}</p>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Masuk
            </Link>
          )}

          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Header

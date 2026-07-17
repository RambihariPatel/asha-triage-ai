import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Home, Settings, LogOut, Activity, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offlineMode, setOfflineMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const checkOfflineStatus = () => {
    setOfflineMode(localStorage.getItem('triage_offline_mode') === 'true');
  };

  useEffect(() => {
    checkOfflineStatus();
    // Listen to local changes or storage configuration updates
    window.addEventListener('storage', checkOfflineStatus);
    return () => {
      window.removeEventListener('storage', checkOfflineStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear speech synthesis if playing
    window.speechSynthesis.cancel();
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <header className="navbar-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        
        {/* Brand Name & Icon */}
        <Link to="/" className="navbar-brand" aria-label="Go to AshaTriage home" onClick={() => setIsMenuOpen(false)}>
          <Activity size={24} className="brand-icon" />
          <span className="brand-name">AshaTriage AI</span>
        </Link>
        
        {/* Navigation & Connection Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Switcher */}
          <div className="navbar-lang-switcher" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.3rem 0.6rem', borderRadius: '50px', border: '1px solid var(--border-light)' }}>
            <Globe size={16} style={{ color: 'var(--primary-solid)' }} />
            <select 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setIsMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '0.2rem'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* Status Badge */}
          <div className={`navbar-status-badge ${offlineMode ? 'offline' : 'online'}`}>
            <span className={`status-dot ${!offlineMode ? 'pulsing' : ''}`}></span>
            <span className="status-badge-text-desktop">{offlineMode ? t('Offline Mode', {hi: 'ऑफ़लाइन', te: 'ఆఫ్‌లైన్'}) : t('Online', {hi: 'ऑनलाइन', te: 'ఆన్‌లైన్'})}</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="navbar-desktop-nav" aria-label="Primary navigation menu">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={18} />
              <span className="navbar-nav-label-desktop">{t('Dashboard', {hi: 'डैशबोर्ड', te: 'డాష్బోర్డ్'})}</span>
            </Link>

            <Link 
              to="/analytics" 
              className={`navbar-link ${location.pathname === '/analytics' ? 'active' : ''}`}
            >
              <Activity size={18} />
              <span className="navbar-nav-label-desktop">{t('Analytics', {hi: 'विश्लेषण', te: 'విశ్లేషణ'})}</span>
            </Link>

            <Link 
              to="/settings" 
              className={`navbar-link ${location.pathname === '/settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span className="navbar-nav-label-desktop">{t('Settings', {hi: 'सेटिंग्स', te: 'సెట్టింగులు'})}</span>
            </Link>

            <button 
              type="button" 
              onClick={handleLogout} 
              className="navbar-logout-btn"
            >
              <LogOut size={16} />
              <span>{t('Logout', {hi: 'लॉगआउट', te: 'లాగ్అవుట్'})}</span>
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="navbar-hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isMenuOpen && (
        <div 
          className="navbar-mobile-drawer"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-surface-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            zIndex: 999,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
          >
            <Home size={18} />
            <span>{t('Dashboard', {hi: 'डैशबोर्ड', te: 'డాష్బోర్డ్'})}</span>
          </Link>

          <Link 
            to="/analytics" 
            className={`navbar-link ${location.pathname === '/analytics' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
          >
            <Activity size={18} />
            <span>{t('Analytics', {hi: 'विश्लेषण', te: 'విశ్లేషణ'})}</span>
          </Link>

          <Link 
            to="/settings" 
            className={`navbar-link ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
          >
            <Settings size={18} />
            <span>{t('Settings', {hi: 'सेटिंग्स', te: 'సెట్టింగులు'})}</span>
          </Link>

          <button 
            type="button" 
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }} 
            className="navbar-logout-btn"
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', width: '100%' }}
          >
            <LogOut size={16} />
            <span>{t('Logout', {hi: 'लॉगआउट', te: 'లాగ్అవుట్'})}</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

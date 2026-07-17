import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-layout">
      <div className="footer-container">
        <div className="footer-info">
          <span className="footer-brand">AshaTriage AI</span>
          <span className="footer-copyright">© 2026 Idea2Impact Hackathon</span>
        </div>
        <nav className="footer-links-nav" aria-label="Footer Navigation Links">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Theme 3: Crisis Management & HealthTech
          </span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

'use client';
import { useState, useCallback } from 'react';
import AdminPanel from './AdminPanel';

export default function Footer() {
  const [showLogin, setShowLogin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = useCallback(() => {
    setClickCount(c => {
      const next = c + 1;
      if (next >= 5) { setShowLogin(true); return 0; }
      return next;
    });
  }, []);

  return (
    <>
      <AdminPanel showLogin={showLogin} onCloseLogin={() => setShowLogin(false)} />
      <footer>
        <div className="footer-inner">
          <a href="#hero" className="logo">Pandit Interior</a>
          <p className="footer-tagline">Refined Living, Thoughtfully Designed.</p>
          <div className="footer-links">
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="social-links">
            <a href="https://instagram.com/pandit_interior_designer" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              📸 Instagram
            </a>
          </div>
          <p className="footer-copy">
            <span onClick={handleCopyrightClick} style={{ cursor: 'default', userSelect: 'none' }}>
              &copy; 2026 Pandit Interior. All rights reserved.
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="logo">Pandit Interior</a>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfolio</a></li>
        <li><a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Get in Touch</a></li>
      </ul>
      <button className="hamburger" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
        &#9776;
      </button>
    </nav>
  );
}

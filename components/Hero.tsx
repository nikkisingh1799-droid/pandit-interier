'use client';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // trigger reveal on mount
    const el = contentRef.current;
    if (el) {
      setTimeout(() => el.classList.add('visible'), 100);
    }
  }, []);

  return (
    <section id="hero">
      <div className="hero-overlay" />
      <div className="hero-content reveal" ref={contentRef}>
        <span className="eyebrow">Interior Design Studio</span>
        <h1>Spaces That<br /><em>Tell Your Story</em></h1>
        <p>We craft interiors that balance beauty, function, and the quiet luxury of everyday living.</p>
        <div className="hero-actions">
          <a href="#portfolio" className="btn btn-primary">View Our Work</a>
          <a href="#contact" className="btn btn-ghost">Start a Project</a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

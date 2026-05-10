'use client';
import { useEffect, useRef, useState } from 'react';

type PortfolioItem = { id: string; title: string; category: string; img: string; large: boolean };

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data); });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal') ?? []);
          const idx = siblings.indexOf(entry.target as Element);
          (entry.target as HTMLElement).style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">Our Work</span>
          <h2>Portfolio</h2>
          <p className="section-sub">A curated selection of spaces we&apos;ve had the privilege to transform.</p>
        </div>
        <div className="portfolio-grid">
          {items.map((item) => (
            <div key={item.id} className={`portfolio-item reveal${item.large ? ' large' : ''}`}>
              <div className="portfolio-img" style={{ backgroundImage: `url('${item.img}')` }} />
              <div className="portfolio-overlay">
                <span>{item.title}</span>
                <em>{item.category}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { top: '100%', bottom: 'CUSTOMIZED', featured: false },
  { top: 'PREMIUM', bottom: 'QUALITY', featured: true },
  { top: 'ON-TIME', bottom: 'DELIVERY', featured: false },
  { top: 'LIFE-TIME', bottom: 'SERVICES', featured: false },
];

export default function FeaturesStrip() {
  return (
    <section className="features-strip">
      <div className="features-inner">
        {features.map((f) => (
          <div key={f.bottom} className={`feature-bubble${f.featured ? ' featured' : ''}`}>
            <span className="feature-top">{f.top}</span>
            <span className="feature-bottom">{f.bottom}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

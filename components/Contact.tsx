'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';

const TELEGRAM_TOKEN   = '8742121932:AAF0Y2N6A7SjhtVJY74qLdm4dWnQJNiRAoY';
const TELEGRAM_CHAT_ID = '8735695116';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name    = (data.get('fname') as string).trim();
    const mobile  = (data.get('mobile') as string).trim();
    const service = (data.get('project') as string) || 'Not specified';
    const message = (data.get('message') as string).trim();

    if (!name || !mobile || !message) return;

    setSending(true);
    const text = `📩 *New Enquiry — Pandit Interior*\n\n👤 *Name:* ${name}\n📞 *Mobile:* ${mobile}\n🛋 *Service:* ${service}\n💬 *Message:* ${message}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
      });
    } catch (err) {
      console.warn('Telegram error:', err);
    }

    form.reset();
    setSending(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  }

  return (
    <section id="contact" ref={sectionRef}>
      <div className="container contact-container">
        <div className="contact-info reveal">
          <span className="eyebrow">Let&apos;s Connect</span>
          <h2>Start Your Project</h2>
          <p>Ready to transform your space? Tell us about your vision and we&apos;ll be in touch within 24 hours.</p>
          <ul className="contact-details">
            <li><span className="contact-icon">✉</span> info@panditinterior.com</li>
            <li><span className="contact-icon">✆</span> +91 82081 30945</li>
            <li><span className="contact-icon">●</span> Pune, Maharashtra</li>
          </ul>
        </div>
        <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fname">Name</label>
            <input type="text" id="fname" name="fname" placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input type="tel" id="mobile" name="mobile" placeholder="+91 00000 00000" required />
          </div>
          <div className="form-group">
            <label htmlFor="project">Service Needed</label>
            <select id="project" name="project">
              <option value="">Select a service...</option>
              <option>Residential Design</option>
              <option>Commercial Spaces</option>
              <option>Space Planning</option>
              <option>Furniture Curation</option>
              <option>Lighting Design</option>
              <option>Renovation Consulting</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} placeholder="Describe your space, style preferences, timeline..." required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {success && <p className="form-success show">Thank you — we&apos;ll be in touch soon.</p>}
        </form>
      </div>
    </section>
  );
}

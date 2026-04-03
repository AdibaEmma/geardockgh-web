'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const metadata = {
  title: 'The Ultimate Remote Work Setup Guide for Ghana | GearDockGH',
  description:
    'Download our free guide to building the perfect remote work setup in Ghana. Covers equipment, internet solutions, ergonomics, and power backup strategies.',
  alternates: {
    canonical: 'https://geardockgh.com/guides/remote-work-setup',
  },
  openGraph: {
    title: 'The Ultimate Remote Work Setup Guide for Ghana',
    description:
      'Free PDF guide covering everything you need for a productive remote work setup in Ghana.',
    type: 'website',
    url: 'https://geardockgh.com/guides/remote-work-setup',
  },
};

export default function RemoteWorkSetupGuidePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Placeholder: integrate with email service (e.g. Mailchimp, ConvertKit)
    setSubmitted(true);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge}>Free Guide</span>
        <h1 style={styles.heading}>
          The Ultimate Remote Work Setup Guide for Ghana
        </h1>
        <p style={styles.subheading}>
          Everything you need to build a productive, reliable, and comfortable
          home office — tailored for working professionals in Ghana.
        </p>
      </section>

      <section style={styles.contentCard}>
        <h2 style={styles.cardHeading}>What&apos;s Inside</h2>
        <ul style={styles.benefitsList}>
          <li style={styles.benefitItem}>
            <span style={styles.checkIcon}>&#10003;</span>
            <span>
              <strong>Equipment Essentials</strong> — Laptop, monitor, keyboard,
              and accessory recommendations with Ghana-specific pricing and
              where to buy.
            </span>
          </li>
          <li style={styles.benefitItem}>
            <span style={styles.checkIcon}>&#10003;</span>
            <span>
              <strong>Internet &amp; Power Solutions</strong> — How to stay
              online during outages with the best ISPs, backup internet options,
              and UPS/inverter setups.
            </span>
          </li>
          <li style={styles.benefitItem}>
            <span style={styles.checkIcon}>&#10003;</span>
            <span>
              <strong>Ergonomics on a Budget</strong> — Desk and chair
              recommendations that protect your health without breaking the
              bank.
            </span>
          </li>
          <li style={styles.benefitItem}>
            <span style={styles.checkIcon}>&#10003;</span>
            <span>
              <strong>Productivity Software Stack</strong> — The tools and apps
              that top remote workers in Ghana use to stay focused and
              collaborative.
            </span>
          </li>
        </ul>

        {submitted ? (
          <div style={styles.successMessage}>
            <p style={styles.successText}>
              Check your inbox! The guide is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="email" style={styles.label}>
              Get your free copy — enter your email below:
            </label>
            <div style={styles.inputGroup}>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Download Free Guide
              </button>
            </div>
            <p style={styles.disclaimer}>
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        )}
      </section>

      <section style={styles.socialProof}>
        <p style={styles.socialProofText}>
          Trusted by <strong>500+</strong> remote workers across Accra, Kumasi,
          and Takoradi.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 1.5rem',
    fontFamily: 'var(--font-outfit)',
    backgroundColor: 'var(--deep)',
    color: 'var(--white)',
  },
  hero: {
    maxWidth: '640px',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '9999px',
    backgroundColor: 'var(--gold)',
    color: 'var(--deep)',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: 'var(--muted)',
  },
  contentCard: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  cardHeading: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    color: 'var(--white)',
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 2rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: 'var(--muted)',
  },
  checkIcon: {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--gold)',
    color: 'var(--deep)',
    fontSize: '0.7rem',
    fontWeight: 700,
    marginTop: '2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--white)',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  input: {
    flex: '1 1 240px',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--deep)',
    color: 'var(--white)',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--gold)',
    color: 'var(--deep)',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: 'var(--muted)',
    margin: 0,
  },
  successMessage: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: 'var(--deep)',
    border: '1px solid var(--gold)',
    textAlign: 'center',
  },
  successText: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--gold)',
    margin: 0,
  },
  socialProof: {
    maxWidth: '600px',
    textAlign: 'center',
  },
  socialProofText: {
    fontSize: '0.85rem',
    color: 'var(--muted)',
  },
};

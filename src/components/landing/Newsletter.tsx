'use client';

import { useRef, useState } from 'react';

export function Newsletter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.includes('@')) {
      input.value = '';
      input.placeholder = '\u2713 You\u2019re subscribed!';
      input.style.borderColor = 'var(--teal)';
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div className="newsletter-incentive">
          <span className="incentive-badge">10% OFF</span>
          Subscribe &amp; get 10% off your first order
        </div>
        <h2>
          Stay in <span>the loop.</span>
        </h2>
        <p>
          Get notified about new arrivals, exclusive deals, and bundle
          discounts straight to your inbox. No spam &mdash; just great gear drops.
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
            ref={inputRef}
            aria-label="Email address for newsletter"
          />
          <button className="newsletter-btn" onClick={handleSubmit}>
            {submitted ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>
        <p className="newsletter-note">
          // <span>1,200+</span> SUBSCRIBERS &middot; 0 SPAM &middot; 100% GEAR &middot; UNSUBSCRIBE ANYTIME
        </p>
      </div>
    </section>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export function Newsletter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  useEffect(() => {
    apiClient
      .get<{ count: number }>('/newsletter/count')
      .then((res) => setSubscriberCount(res.data.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    const input = inputRef.current;
    if (!input || !input.value.includes('@')) return;

    setLoading(true);
    setError('');

    try {
      await apiClient.post('/newsletter/subscribe', {
        email: input.value,
        source: 'website',
      });

      input.value = '';
      input.placeholder = '\u2713 You\u2019re subscribed!';
      input.style.borderColor = 'var(--teal)';
      setSubmitted(true);
      if (subscriberCount !== null) setSubscriberCount(subscriberCount + 1);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const displayCount =
    subscriberCount !== null && subscriberCount >= 50
      ? `${subscriberCount.toLocaleString()}+`
      : null;

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div className="newsletter-incentive">
          <span className="incentive-badge">EARLY ACCESS</span>
          Get first dibs on every new batch + 10% off your first order
        </div>
        <h2>
          Don&apos;t miss <span>the next drop.</span>
        </h2>
        <p>
          Join the list. Be the first to know when new gear lands &mdash;
          bundles, restocks, and exclusive pre-order windows. No spam, just drops.
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
            ref={inputRef}
            aria-label="Email address for newsletter"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            className="newsletter-btn"
            onClick={handleSubmit}
            disabled={loading || submitted}
          >
            {loading ? 'Joining...' : submitted ? 'Subscribed!' : 'Join the List'}
          </button>
        </div>
        {error && (
          <p className="newsletter-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '8px' }}>
            {error}
          </p>
        )}
        <p className="newsletter-note">
          {displayCount && <>// <span>{displayCount}</span> SUBSCRIBERS &middot; </>}NO SPAM &middot; 100% GEAR DROPS &middot; UNSUBSCRIBE ANYTIME
        </p>
      </div>
    </section>
  );
}

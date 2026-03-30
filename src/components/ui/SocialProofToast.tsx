'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, X } from 'lucide-react';

interface PurchaseNotification {
  name: string;
  location: string;
  product: string;
  timeAgo: string;
}

const NOTIFICATIONS: PurchaseNotification[] = [
  { name: 'Ama', location: 'Bolgatanga', product: 'Sony WH-1000XM5', timeAgo: '5 mins ago' },
  { name: 'Kwesi', location: 'Tamale', product: 'Logitech C920 Webcam', timeAgo: '12 mins ago' },
  { name: 'Akosua', location: 'Accra', product: 'Mechanical Keyboard', timeAgo: '18 mins ago' },
  { name: 'Kofi', location: 'Kumasi', product: 'USB-C Hub', timeAgo: '25 mins ago' },
  { name: 'Abena', location: 'Sunyani', product: 'Ring Light 18"', timeAgo: '32 mins ago' },
  { name: 'Yaw', location: 'Bolgatanga', product: 'Laptop Stand', timeAgo: '41 mins ago' },
  { name: 'Adwoa', location: 'Wa', product: 'Gaming Mouse', timeAgo: '48 mins ago' },
  { name: 'Mensah', location: 'Takoradi', product: 'Desk Pad XXL', timeAgo: '55 mins ago' },
];

export function SocialProofToast() {
  const [current, setCurrent] = useState<PurchaseNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const showNext = useCallback(() => {
    if (dismissed) return;
    const randomIndex = Math.floor(Math.random() * NOTIFICATIONS.length);
    setCurrent(NOTIFICATIONS[randomIndex]);
    setVisible(true);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setVisible(false);
    }, 4000);
  }, [dismissed]);

  useEffect(() => {
    // Show first one after 8 seconds
    const initialTimer = setTimeout(showNext, 8000);

    // Then every 15–25 seconds randomly
    const interval = setInterval(() => {
      const delay = 15000 + Math.random() * 10000;
      setTimeout(showNext, delay);
    }, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNext]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
  };

  if (!current || dismissed) return null;

  return (
    <div
      className={`social-proof-toast ${visible ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="social-proof-icon">
        <ShoppingBag size={16} />
      </div>
      <div className="social-proof-content">
        <p className="social-proof-text">
          <strong>{current.name}</strong> from <strong>{current.location}</strong> bought{' '}
          <span className="social-proof-product">{current.product}</span>
        </p>
        <p className="social-proof-meta">
          ✓ Verified Purchase · {current.timeAgo}
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="social-proof-close"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

export function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after a minimum display time
    const minDisplay = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    // Remove from DOM after animation completes
    const remove = setTimeout(() => {
      setHidden(true);
    }, 1800);

    return () => {
      clearTimeout(minDisplay);
      clearTimeout(remove);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`page-loader ${fadeOut ? 'page-loader-exit' : ''}`}
      aria-hidden="true"
    >
      <div className="page-loader-content">
        {/* Logo icon */}
        <div className="page-loader-logo">
          <img
            src="/images/branding/geardockgh-logo-nobg.png"
            alt=""
            width={48}
            height={48}
            className="page-loader-icon"
          />
        </div>

        {/* Brand name */}
        <div className="page-loader-brand">
          <span className="page-loader-brand-teal">GearDock</span>
          <span className="page-loader-brand-gold">GH</span>
        </div>

        {/* Loading bar */}
        <div className="page-loader-bar-track">
          <div className="page-loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}

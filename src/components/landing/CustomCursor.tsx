'use client';

import { useEffect, useRef, useCallback } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const animateRing = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;

    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
    ring.style.left = `${ringPos.current.x - 18}px`;
    ring.style.top = `${ringPos.current.y - 18}px`;

    rafRef.current = requestAnimationFrame(animateRing);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      cursor.style.left = `${e.clientX - 5}px`;
      cursor.style.top = `${e.clientY - 5}px`;
    };

    const handleMouseEnter = () => {
      if (cursor) cursor.style.transform = 'scale(2.5)';
      if (ring) {
        ring.style.transform = 'scale(1.4)';
        ring.style.borderColor = 'var(--gold)';
      }
    };

    const handleMouseLeave = () => {
      if (cursor) cursor.style.transform = 'scale(1)';
      if (ring) {
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'var(--gold)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const interactiveSelectors = 'button, a, .category-card, .product-card, .why-item';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, [animateRing]);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

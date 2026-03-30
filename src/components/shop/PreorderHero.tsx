'use client';

import Link from 'next/link';
import { Clock, Shield, CreditCard, Ship, Plane } from 'lucide-react';

export function PreorderHero() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: 'linear-gradient(135deg, var(--card) 0%, var(--deep) 100%)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <span
          className="mb-4 inline-block rounded-full border px-3 py-1 font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-wider"
          style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
        >
          Pre-Order from GearDockGH
        </span>

        <h1
          className="font-[family-name:var(--font-outfit)] text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
          style={{ color: 'var(--white)' }}
        >
          Reserve your gear.
          <br />
          <span style={{ color: 'var(--gold)' }}>We handle the rest.</span>
        </h1>

        <p
          className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--muted)' }}
        >
          Pay a deposit to lock in your price, and we source, import, and deliver
          to your door &mdash; no customs stress, no surprises. You pay the
          balance + shipping when it arrives.
        </p>

        {/* Shipping timeline badges */}
        <div
          className="mt-6 inline-flex flex-wrap gap-3 rounded-lg border p-3"
          style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
        >
          <div className="flex items-center gap-2">
            <Plane size={14} style={{ color: 'var(--teal)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--white)' }}>
              Air: 1–3 weeks
            </span>
          </div>
          <div
            className="w-px self-stretch"
            style={{ background: 'var(--border)' }}
          />
          <div className="flex items-center gap-2">
            <Ship size={14} style={{ color: 'var(--teal)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--white)' }}>
              Sea: 6–10 weeks
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CreditCard size={18} style={{ color: 'var(--teal)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--white)' }}>
              Low deposit via MoMo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} style={{ color: 'var(--teal)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--white)' }}>
              WhatsApp tracking updates
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={18} style={{ color: 'var(--teal)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--white)' }}>
              100% refundable deposit
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="#preorder-products"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--black)' }}
          >
            Browse Pre-Order Gear &darr;
          </Link>
          <Link
            href="/returns"
            className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-2 transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--muted)' }}
          >
            Returns & Terms &rarr;
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10"
        style={{ background: 'var(--gold)' }}
      />
      <div
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-5"
        style={{ background: 'var(--teal)' }}
      />
    </section>
  );
}

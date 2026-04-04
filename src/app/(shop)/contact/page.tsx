import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, Clock, MapPin } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export const metadata: Metadata = {
  title: 'Contact Us — GearDockGH',
  description:
    'Get in touch with GearDockGH. Reach us on WhatsApp, phone, or email. We respond fast — Mon-Sat, 8am-8pm.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    subtitle: 'Fastest way to reach us',
    value: '0200011849',
    href: 'https://wa.me/233200011849?text=Hi%20GearDockGH!%20I%20have%20a%20question.',
    cta: 'Chat on WhatsApp',
    accent: 'var(--gold)',
    isPrimary: true,
  },
  {
    icon: Phone,
    title: 'Phone Call',
    subtitle: 'Talk to us directly',
    value: '0556137400',
    href: 'tel:+233556137400',
    cta: 'Call Now',
    accent: 'var(--teal)',
    isPrimary: false,
  },
  {
    icon: Mail,
    title: 'Email',
    subtitle: 'For detailed inquiries',
    value: 'geardockgh@gmail.com',
    href: 'mailto:geardockgh@gmail.com',
    cta: 'Send Email',
    accent: 'var(--muted)',
    isPrimary: false,
  },
];

const INFO_ITEMS = [
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat, 8:00 AM – 8:00 PM',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bolgatanga, Upper East Region, Ghana',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Contact Us
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Have a question about a product, your order, or anything else? We&apos;re
        here to help.
      </p>

      {/* Contact Methods */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CONTACT_METHODS.map((method) => (
          <a
            key={method.title}
            href={method.href}
            target={method.title === 'WhatsApp' ? '_blank' : undefined}
            rel={method.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
            className="group rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: method.isPrimary ? method.accent : 'var(--card)',
              borderColor: method.isPrimary ? method.accent : 'var(--border)',
              color: method.isPrimary ? 'var(--black)' : 'var(--white)',
            }}
          >
            <method.icon size={24} />
            <h2 className="mt-3 text-sm font-semibold">{method.title}</h2>
            <p
              className="mt-0.5 text-xs"
              style={{
                color: method.isPrimary ? 'rgba(0,0,0,0.6)' : 'var(--muted)',
              }}
            >
              {method.subtitle}
            </p>
            <p
              className="mt-3 font-[family-name:var(--font-space-mono)] text-sm font-medium"
              style={{
                color: method.isPrimary ? 'var(--black)' : method.accent,
              }}
            >
              {method.value}
            </p>
            <span
              className="mt-3 inline-block text-xs font-semibold"
              style={{
                color: method.isPrimary ? 'rgba(0,0,0,0.7)' : method.accent,
              }}
            >
              {method.cta} &rarr;
            </span>
          </a>
        ))}
      </div>

      {/* Business Info */}
      <div className="mt-8 space-y-4">
        {INFO_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <item.icon size={20} style={{ color: 'var(--gold)' }} />
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                {item.label}
              </p>
              <p className="text-sm" style={{ color: 'var(--white)' }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div
        className="mt-8 rounded-xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2
          className="font-[family-name:var(--font-outfit)] text-lg font-semibold"
          style={{ color: 'var(--white)' }}
        >
          Common Questions?
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Check these pages first — you might find your answer faster.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { href: '/faq', label: 'FAQ' },
            { href: '/shipping', label: 'Shipping & Delivery' },
            { href: '/returns', label: 'Returns & Terms' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

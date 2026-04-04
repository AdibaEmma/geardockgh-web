import type { Metadata } from 'next';
import { FAQPageJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer:
      'We deliver within 24-48 hours in Bolgatanga and 3-5 business days nationwide across Ghana.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept MTN MoMo, Vodafone Cash, AirtelTigo Money, Visa, and Mastercard.',
  },
  {
    question: 'Are your products genuine?',
    answer:
      'Yes — every product is sourced directly from authorized distributors and verified before listing. We never sell refurbished items as new.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 7-day return window for products that arrive damaged or defective. Items must be in original packaging.',
  },
  {
    question: 'Do you offer warranty?',
    answer:
      'All products come with the manufacturer warranty. We also provide direct support if anything goes wrong.',
  },
  {
    question: 'Can I pre-order items that are out of stock?',
    answer:
      'Yes — visit our pre-order page to reserve items. You pay a deposit and we notify you when the product arrives.',
  },
  {
    question: 'Do you deliver outside Bolgatanga?',
    answer:
      'Yes, we deliver nationwide across Ghana. Shipping costs and timelines vary by location.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'After placing your order, you can track it from your account dashboard or reach out to us on WhatsApp for updates.',
  },
  {
    question: 'Can I pay in installments?',
    answer:
      'Currently we accept full payment or deposit-based pre-orders. Installment plans may be available in the future.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'The fastest way is via WhatsApp — tap the green button on any page. You can also email us or DM on social media.',
  },
];

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — GearDockGH',
  description:
    'Find answers to common questions about delivery, payments, returns, warranties, and pre-orders at GearDockGH.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <FAQPageJsonLd questions={faqs} />
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Everything you need to know about shopping with GearDockGH.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-xl border p-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-semibold" style={{ color: 'var(--white)' }}>
              {faq.question}
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

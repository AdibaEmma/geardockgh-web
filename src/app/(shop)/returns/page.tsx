import type { Metadata } from 'next';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Camera,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Truck,
  RefreshCw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Terms — GearDockGH',
  description:
    'Returns policy, terms and conditions for GearDockGH. 7-day return window, MoMo refunds within 24 hours, and pre-order deposit protection.',
};

const ACCEPTABLE_REASONS = [
  'Wrong item delivered',
  'Item damaged during shipping',
  'Product not functioning on arrival',
  'Item not as described or missing parts',
];

const NOT_ACCEPTABLE = [
  'Change of mind or buyer\'s remorse',
  'Products damaged due to mishandling by the customer',
  'Items reported more than 7 days after delivery',
  'Used items or items not in original condition',
];

const RETURN_CONDITIONS = [
  { icon: Clock, text: 'Returns must be initiated within 7 days of delivery' },
  { icon: Package, text: 'Product must be unused and in its original packaging' },
  { icon: ShieldCheck, text: 'Proof of purchase (order confirmation or receipt) is required' },
  { icon: Camera, text: 'A clear photo or video of the issue must be provided' },
  { icon: CheckCircle2, text: 'GearDockGH may inspect the item before approving the return' },
];

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Contact Us',
    description: 'Reach out via WhatsApp at 0200011849 or through our website chat.',
  },
  {
    step: '02',
    title: 'Share Details',
    description: 'Provide your order number, reason for return, and photos/videos of the issue.',
  },
  {
    step: '03',
    title: 'Await Instructions',
    description: 'Our team will review and send return or pickup instructions within 24 hours.',
  },
  {
    step: '04',
    title: 'Get Resolved',
    description: 'Once approved, choose a replacement, store credit, or MoMo refund within 24 hours.',
  },
];

export default function ReturnsPage() {
  return (
    <div className="animate-[fadeUp_400ms_ease-out] pb-16">
      {/* Hero */}
      <div className="mb-10">
        <h1
          className="font-[family-name:var(--font-outfit)] text-3xl font-bold sm:text-4xl"
          style={{ color: 'var(--white)' }}
        >
          Returns & Terms
        </h1>
        <p
          className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--muted)' }}
        >
          At GearDockGH, we stand behind every product we sell. If something
          isn&apos;t right, we&apos;ll make it right &mdash; fast.
        </p>
      </div>

      {/* Section 1: Returns for Physical Products */}
      <section
        className="mb-8 rounded-xl border p-6 sm:p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: 'var(--gold)', color: 'var(--black)' }}
          >
            <RefreshCw size={20} />
          </span>
          <div>
            <h2
              className="font-[family-name:var(--font-outfit)] text-xl font-bold"
              style={{ color: 'var(--white)' }}
            >
              Returns for Physical Products
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Gadgets, electronics, accessories & furniture
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Acceptable */}
          <div>
            <h3
              className="mb-3 flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--teal)' }}
            >
              <CheckCircle2 size={16} />
              Acceptable Return Reasons
            </h3>
            <ul className="space-y-2">
              {ACCEPTABLE_REASONS.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--white)' }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="var(--teal)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Not Acceptable */}
          <div>
            <h3
              className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400"
            >
              <XCircle size={16} />
              Not Acceptable for Return
            </h3>
            <ul className="space-y-2">
              {NOT_ACCEPTABLE.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4l6 6M10 4l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Return Conditions */}
      <section
        className="mb-8 rounded-xl border p-6 sm:p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2
          className="mb-6 font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Return Conditions
        </h2>

        <div className="space-y-4">
          {RETURN_CONDITIONS.map((condition) => {
            const Icon = condition.icon;
            return (
              <div
                key={condition.text}
                className="flex items-start gap-3 rounded-lg border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
              >
                <Icon
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--gold)' }}
                />
                <span className="text-sm" style={{ color: 'var(--white)' }}>
                  {condition.text}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Return Process */}
      <section
        className="mb-8 rounded-xl border p-6 sm:p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2
          className="mb-6 font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Return Process
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {RETURN_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative rounded-lg border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
            >
              <span
                className="absolute right-4 top-4 font-[family-name:var(--font-space-mono)] text-2xl font-bold"
                style={{ color: 'var(--border)' }}
              >
                {step.step}
              </span>
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--gold)' }}
              >
                {step.title}
              </h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex items-center gap-3 rounded-lg p-4"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          <MessageCircle size={20} />
          <div>
            <p className="text-sm font-semibold">Need help? Contact us on WhatsApp</p>
            <p className="text-xs opacity-80">0200011849 &middot; Available Mon–Sat, 8am–8pm</p>
          </div>
        </div>
      </section>

      {/* Section 4: Pre-Orders */}
      <section
        className="mb-8 rounded-xl border p-6 sm:p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: 'var(--teal)', color: 'var(--black)' }}
          >
            <Truck size={20} />
          </span>
          <h2
            className="font-[family-name:var(--font-outfit)] text-xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Pre-Order Terms
          </h2>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Deposit Policy
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Pre-orders require a deposit to secure your item. The remaining balance
              is due upon arrival. Deposits are <strong style={{ color: 'var(--teal)' }}>100% refundable</strong> if
              GearDockGH is unable to fulfill your order.
            </p>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Cancellation
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              You may cancel a pre-order at any time before the item ships from our
              supplier. Once shipped, the order cannot be cancelled. Your deposit will
              be refunded to your MoMo within 24 hours of approved cancellation.
            </p>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              ETA & Delays
            </h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Estimated arrival dates are provided at the time of order. GearDockGH is
              not responsible for supplier-side delays, but we will keep you updated
              via WhatsApp at every stage and assist in resolving any issues.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: General Terms */}
      <section
        className="rounded-xl border p-6 sm:p-8"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: 'var(--deep)', color: 'var(--gold)' }}
          >
            <AlertTriangle size={20} />
          </span>
          <h2
            className="font-[family-name:var(--font-outfit)] text-xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            General Terms
          </h2>
        </div>

        <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <p>
            All products sold by GearDockGH are sourced from verified international
            suppliers and inspected before delivery. Prices are listed in Ghana Cedis
            (GH₵) and include applicable fees unless stated otherwise.
          </p>
          <p>
            By placing an order, you agree to these terms and conditions. GearDockGH
            reserves the right to update these terms at any time. Changes will be
            posted on this page.
          </p>
          <p>
            For questions, disputes, or support, contact us on WhatsApp at{' '}
            <strong style={{ color: 'var(--gold)' }}>0200011849</strong> or email{' '}
            <strong style={{ color: 'var(--gold)' }}>geardockgh@gmail.com</strong>.
          </p>
        </div>

        <div
          className="mt-6 rounded-lg p-4 text-center text-xs"
          style={{ background: 'var(--deep)', color: 'var(--muted)' }}
        >
          &copy; 2026 GearDockGH &middot; All rights reserved
        </div>
      </section>
    </div>
  );
}

'use client';

import { Check } from 'lucide-react';

type Step = 'address' | 'payment' | 'review';

const steps: { key: Step; label: string }[] = [
  { key: 'address', label: 'Address' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

interface CheckoutStepperProps {
  currentStep: Step;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
                style={{
                  background: isCompleted || isCurrent ? 'var(--gold)' : 'var(--card)',
                  color: isCompleted || isCurrent ? 'var(--deep)' : 'var(--muted)',
                  border: `1px solid ${isCompleted || isCurrent ? 'var(--gold)' : 'var(--border)'}`,
                }}
              >
                {isCompleted ? <Check size={14} /> : index + 1}
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: isCurrent ? 'var(--white)' : 'var(--muted)',
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="mx-2 h-px w-12"
                style={{
                  background: isCompleted ? 'var(--gold)' : 'var(--border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

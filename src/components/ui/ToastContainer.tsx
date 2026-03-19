'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type ToastType } from '@/stores/toast-store';

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: '#00C9A7',
  error: '#ef4444',
  warning: '#F0A500',
  info: '#3b82f6',
};

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
}

function ToastItem({ id, type, message }: ToastItemProps) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(id), 200);
  };

  const Icon = icons[type];
  const color = colors[type];

  return (
    <div
      className="flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-200"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <p className="flex-1 text-sm" style={{ color: 'var(--white)' }}>
        {message}
      </p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-[var(--hover-bg)]"
        style={{ color: 'var(--muted)' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

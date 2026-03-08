import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (toast: { type: ToastType; message: string; duration?: number }) => void;
  removeToast: (id: string) => void;
}

type ToastStore = ToastState & ToastActions;

let toastCounter = 0;

export const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],

  addToast: ({ type, message, duration = 5000 }) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const toast: Toast = { id, type, message, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

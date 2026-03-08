import { create } from 'zustand';

type CheckoutStep = 'address' | 'payment' | 'review';
type PaymentMethod = 'PAYSTACK' | 'MOMO' | 'BANK_TRANSFER';

interface NewAddress {
  label?: string;
  street: string;
  city: string;
  region: string;
}

interface CheckoutState {
  step: CheckoutStep;
  selectedAddressId: string | null;
  newAddress: NewAddress | null;
  paymentMethod: PaymentMethod;
  notes: string;
}

interface CheckoutActions {
  setStep: (step: CheckoutStep) => void;
  setSelectedAddressId: (id: string | null) => void;
  setNewAddress: (address: NewAddress | null) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

type CheckoutStore = CheckoutState & CheckoutActions;

const initialState: CheckoutState = {
  step: 'address',
  selectedAddressId: null,
  newAddress: null,
  paymentMethod: 'PAYSTACK',
  notes: '',
};

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId, newAddress: null }),
  setNewAddress: (newAddress) => set({ newAddress, selectedAddressId: null }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setNotes: (notes) => set({ notes }),
  reset: () => set(initialState),
}));

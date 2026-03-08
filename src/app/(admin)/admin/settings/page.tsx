'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, CreditCard, Truck, Bell, Shield, Building2, Plus, Check, X as XIcon } from 'lucide-react';
import { getAdminTenants, createAdminTenant, updateAdminTenant, type Tenant } from '@/lib/api/admin';
import { formatDate } from '@/lib/utils/formatters';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
          {title}
        </h3>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function Field({ label, value, onChange, type = 'text', placeholder, disabled }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--gold)] disabled:opacity-50"
        style={{
          background: 'var(--deep)',
          borderColor: 'var(--border)',
          color: 'var(--white)',
        }}
      />
    </label>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
          {label}
        </p>
        {description && (
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? 'var(--gold)' : 'var(--border)' }}
      >
        <span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

const tabs = [
  { id: 'general', label: 'General', Icon: Store },
  { id: 'tenants', label: 'Tenants', Icon: Building2 },
  { id: 'payments', label: 'Payments', Icon: CreditCard },
  { id: 'shipping', label: 'Shipping', Icon: Truck },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
] as const;

type TabId = (typeof tabs)[number]['id'];

function TenantsTab() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: () => getAdminTenants(),
  });

  const tenants = (data?.data ?? []) as Tenant[];

  const createMutation = useMutation({
    mutationFn: () => createAdminTenant({ id: newId.trim(), name: newName.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      setShowCreate(false);
      setNewId('');
      setNewName('');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminTenant(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Tenant Management"
        description="Manage tenants for multi-store isolation. Tenant IDs are resolved server-side via JWT (authenticated) or DEFAULT_TENANT_ID config (public routes)."
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
              style={{ color: 'var(--gold)' }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {tenants.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: 'var(--deep)' }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      {t.name}
                    </p>
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                      style={{ background: 'var(--border)', color: 'var(--muted)' }}
                    >
                      {t.id}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                    Created {formatDate(t.createdAt)}
                  </p>
                </div>
                <Toggle
                  label=""
                  checked={t.isActive}
                  onChange={(v) => toggleMutation.mutate({ id: t.id, isActive: v })}
                />
              </div>
            ))}

            {tenants.length === 0 && (
              <p className="py-4 text-center text-sm" style={{ color: 'var(--muted)' }}>
                No tenants configured
              </p>
            )}
          </div>
        )}
      </SettingsSection>

      {/* Create tenant */}
      {showCreate ? (
        <SettingsSection title="New Tenant" description="Create a new tenant for multi-store setup">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tenant ID"
              value={newId}
              onChange={setNewId}
              placeholder="e.g. geardockgh, store-2"
            />
            <Field
              label="Tenant Name"
              value={newName}
              onChange={setNewName}
              placeholder="e.g. GearDockGH"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => createMutation.mutate()}
              disabled={!newId.trim() || !newName.trim() || createMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: 'var(--gold)', color: 'var(--black)' }}
            >
              <Check size={14} />
              Create
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewId(''); setNewName(''); }}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              <XIcon size={14} />
              Cancel
            </button>
          </div>
        </SettingsSection>
      ) : (
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.03]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)', width: '100%' }}
        >
          <Plus size={16} />
          Add Tenant
        </button>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  // Local form state (not persisted — placeholder for future API integration)
  const [storeName, setStoreName] = useState('GearDockGH');
  const [storeEmail, setStoreEmail] = useState('hello@geardockgh.com');
  const [storePhone, setStorePhone] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const [paystackLive, setPaystackLive] = useState(false);
  const [momoEnabled, setMomoEnabled] = useState(false);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(false);
  const [flatRate, setFlatRate] = useState('1500');
  const [freeShippingMin, setFreeShippingMin] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(true);
  const [shippingUpdates, setShippingUpdates] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  return (
    <div className="space-y-6">
      {/* Tab nav */}
      <div
        className="flex gap-1 overflow-x-auto rounded-lg border p-1"
        style={{ background: 'var(--deep)', borderColor: 'var(--border)' }}
      >
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: activeTab === id ? 'var(--card)' : 'transparent',
              color: activeTab === id ? 'var(--gold)' : 'var(--muted)',
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SettingsSection
            title="Store Information"
            description="Basic details about your store"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Store Name" value={storeName} onChange={setStoreName} />
              <Field label="Contact Email" value={storeEmail} onChange={setStoreEmail} type="email" />
              <Field label="Phone Number" value={storePhone} onChange={setStorePhone} placeholder="+233 XX XXX XXXX" />
              <Field label="Currency" value={currency} onChange={setCurrency} disabled />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Security"
            description="Account and access settings"
          >
            <div className="flex items-center gap-3 rounded-lg px-3 py-3" style={{ background: 'var(--deep)' }}>
              <Shield size={18} style={{ color: 'var(--gold)' }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Admin Password
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Change your admin account password
                </p>
              </div>
              <button
                className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
              >
                Change
              </button>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Tenants */}
      {activeTab === 'tenants' && <TenantsTab />}

      {/* Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <SettingsSection
            title="Paystack"
            description="Configure your Paystack payment gateway"
          >
            <Toggle
              label="Live Mode"
              description="Switch between test and live Paystack keys"
              checked={paystackLive}
              onChange={setPaystackLive}
            />
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field
                label={paystackLive ? 'Live Public Key' : 'Test Public Key'}
                value=""
                onChange={() => {}}
                placeholder="pk_test_..."
              />
              <Field
                label={paystackLive ? 'Live Secret Key' : 'Test Secret Key'}
                value=""
                onChange={() => {}}
                placeholder="sk_test_..."
                type="password"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Payment Methods"
            description="Enable or disable payment methods"
          >
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              <Toggle
                label="Mobile Money (MoMo)"
                description="Accept payments via MTN MoMo, Vodafone Cash, AirtelTigo Money"
                checked={momoEnabled}
                onChange={setMomoEnabled}
              />
              <Toggle
                label="Bank Transfer"
                description="Allow customers to pay via direct bank transfer"
                checked={bankTransferEnabled}
                onChange={setBankTransferEnabled}
              />
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Shipping */}
      {activeTab === 'shipping' && (
        <SettingsSection
          title="Delivery Fees"
          description="Configure shipping rates for Ghana"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Flat Rate (pesewas)"
              value={flatRate}
              onChange={setFlatRate}
              placeholder="1500"
            />
            <Field
              label="Free Shipping Minimum (pesewas)"
              value={freeShippingMin}
              onChange={setFreeShippingMin}
              placeholder="Leave empty to disable"
            />
          </div>
          <p className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
            Flat rate of GH&#x20B5;{(Number(flatRate) / 100).toFixed(2)} will be applied to all orders.
            {freeShippingMin && ` Free shipping for orders above GH₵${(Number(freeShippingMin) / 100).toFixed(2)}.`}
          </p>
        </SettingsSection>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <SettingsSection
          title="Email Notifications"
          description="Choose which notifications to receive"
        >
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            <Toggle
              label="Order Confirmation"
              description="Send confirmation email when a new order is placed"
              checked={orderConfirmation}
              onChange={setOrderConfirmation}
            />
            <Toggle
              label="Shipping Updates"
              description="Notify customers when their order status changes"
              checked={shippingUpdates}
              onChange={setShippingUpdates}
            />
            <Toggle
              label="Low Stock Alerts"
              description="Get notified when product stock falls below 5 units"
              checked={lowStockAlerts}
              onChange={setLowStockAlerts}
            />
          </div>
        </SettingsSection>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

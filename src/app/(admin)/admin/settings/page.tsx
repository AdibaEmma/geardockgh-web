'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Store, CreditCard, Truck, Bell, Shield, Building2, Plus, Check, X as XIcon,
  Plug, Loader2, CheckCircle2, XCircle, Unplug,
} from 'lucide-react';
import {
  getAdminTenants, createAdminTenant, updateAdminTenant, type Tenant,
  getImportBrainStatus, connectImportBrain, disconnectImportBrain, saveImportBrainPlatformKey,
  deleteImportBrainConnection, updateImportBrainPlatformKey,
} from '@/lib/api/admin';
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
  { id: 'integrations', label: 'Integrations', Icon: Plug },
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

function IntegrationsTab() {
  const queryClient = useQueryClient();
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [platformKeyInput, setPlatformKeyInput] = useState('');
  const [editingKey, setEditingKey] = useState(false);
  const [updateKeyInput, setUpdateKeyInput] = useState('');
  const [changingKeyNotConnected, setChangingKeyNotConnected] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['importbrain-status'],
    queryFn: () => getImportBrainStatus(),
  });

  const status = data?.data;
  const isConnected = status?.connected === true;

  const saveKeyMutation = useMutation({
    mutationFn: (key: string) => saveImportBrainPlatformKey(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importbrain-status'] });
      setPlatformKeyInput('');
      setChangingKeyNotConnected(false);
    },
  });

  const connectMutation = useMutation({
    mutationFn: () => connectImportBrain(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importbrain-status'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectImportBrain(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importbrain-status'] });
      setConfirmDisconnect(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteImportBrainConnection(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importbrain-status'] });
      setConfirmDelete(false);
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: (key: string) => updateImportBrainPlatformKey(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importbrain-status'] });
      setEditingKey(false);
      setUpdateKeyInput('');
    },
  });

  return (
    <div className="space-y-6">
      <SettingsSection
        title="ImportBrain"
        description="Connect to ImportBrain to sync products, inventory, orders, and customers between your store and your operations hub."
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: 'var(--gold)' }}
            />
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            {/* Connected status */}
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{ background: 'var(--deep)' }}
            >
              <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Connected to ImportBrain
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                  {status?.connectedAt
                    ? `Since ${formatDate(status.connectedAt)}`
                    : 'Active connection'}
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
              >
                Active
              </span>
            </div>

            {/* Connection details */}
            <div className="grid gap-3 sm:grid-cols-2">
              {status?.integrationId && (
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: 'var(--deep)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Integration ID</p>
                  <p
                    className="mt-0.5 font-mono text-xs break-all"
                    style={{ color: 'var(--white)' }}
                  >
                    {status.integrationId}
                  </p>
                </div>
              )}
              {status?.importbrainTenantId && (
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: 'var(--deep)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>ImportBrain Tenant</p>
                  <p
                    className="mt-0.5 font-mono text-xs break-all"
                    style={{ color: 'var(--white)' }}
                  >
                    {status.importbrainTenantId}
                  </p>
                </div>
              )}
            </div>

            {/* What syncs */}
            <div
              className="rounded-lg px-4 py-3"
              style={{ background: 'var(--deep)' }}
            >
              <p className="mb-2 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                What syncs automatically
              </p>
              <ul className="space-y-1.5 text-xs" style={{ color: 'var(--white)' }}>
                {[
                  'Orders placed here are pushed to ImportBrain',
                  'Product updates from ImportBrain arrive via webhooks',
                  'Stock changes in ImportBrain sync to your store',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: '#22c55e' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Update Platform Key */}
            {editingKey ? (
              <div
                className="rounded-lg border px-4 py-3"
                style={{ borderColor: 'var(--gold)', background: 'var(--deep)' }}
              >
                <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--white)' }}>
                  Update Platform Key
                </p>
                <p className="mb-2 text-xs" style={{ color: 'var(--muted)' }}>
                  Paste the new platform key from ImportBrain. This will take effect on the next sync.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={updateKeyInput}
                    onChange={(e) => setUpdateKeyInput(e.target.value)}
                    placeholder="pk_..."
                    className="flex-1 rounded-lg border px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-[var(--gold)]"
                    style={{
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--white)',
                    }}
                  />
                  <button
                    onClick={() => updateKeyMutation.mutate(updateKeyInput)}
                    disabled={!updateKeyInput.trim() || updateKeyMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                    style={{ background: 'var(--gold)', color: 'var(--black)' }}
                  >
                    {updateKeyMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Update
                  </button>
                  <button
                    onClick={() => { setEditingKey(false); setUpdateKeyInput(''); }}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    Cancel
                  </button>
                </div>
                {updateKeyMutation.isError && (
                  <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>
                    Failed to update platform key.
                  </p>
                )}
              </div>
            ) : null}

            {/* Disconnect / Delete / Update Key actions */}
            {confirmDisconnect ? (
              <div
                className="rounded-lg border px-4 py-3"
                style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
              >
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                  Are you sure you want to disconnect?
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                  Orders and product syncing will stop immediately. The platform key will be preserved for reconnection.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    style={{ background: '#ef4444' }}
                  >
                    {disconnectMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Unplug size={14} />
                    )}
                    Disconnect
                  </button>
                  <button
                    onClick={() => setConfirmDisconnect(false)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : confirmDelete ? (
              <div
                className="rounded-lg border px-4 py-3"
                style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
              >
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                  Delete this connection entirely?
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                  This will disconnect from ImportBrain and remove all connection data including the platform key. You will need to reconfigure from scratch.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    style={{ background: '#ef4444' }}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <XIcon size={14} />
                    )}
                    Delete Connection
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {!editingKey && (
                  <button
                    onClick={() => setEditingKey(true)}
                    className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}
                  >
                    <Shield size={14} />
                    Update Key
                  </button>
                )}
                <button
                  onClick={() => setConfirmDisconnect(true)}
                  className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: '#ef4444' }}
                >
                  <Unplug size={14} />
                  Disconnect
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: '#ef4444' }}
                >
                  <XIcon size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Not connected */}
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{ background: 'var(--deep)' }}
            >
              <XCircle size={20} style={{ color: 'var(--muted)' }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Not connected
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                  Connect to start syncing products and orders with ImportBrain
                </p>
              </div>
            </div>

            {/* What you get */}
            <div
              className="rounded-lg px-4 py-3"
              style={{ background: 'var(--deep)' }}
            >
              <p className="mb-2 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                What connecting enables
              </p>
              <ul className="space-y-1.5 text-xs" style={{ color: 'var(--white)' }}>
                {[
                  'Automatic order sync — sales here appear in ImportBrain instantly',
                  'Product catalog pull — import products from ImportBrain',
                  'Real-time stock updates — inventory stays in sync',
                  'Webhook notifications — product changes push to your store',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 1: Platform Key */}
            <div
              className="rounded-lg border px-4 py-3"
              style={{
                borderColor: status?.hasPlatformKey ? '#22c55e' : 'var(--gold)',
                background: 'var(--deep)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: status?.hasPlatformKey ? 'rgba(34,197,94,0.15)' : 'rgba(240,165,0,0.15)',
                    color: status?.hasPlatformKey ? '#22c55e' : 'var(--gold)',
                  }}
                >
                  {status?.hasPlatformKey ? '✓' : '1'}
                </span>
                <p className="text-xs font-semibold" style={{ color: 'var(--white)' }}>
                  {status?.hasPlatformKey ? 'Platform key saved' : 'Paste platform key from ImportBrain'}
                </p>
              </div>

              {status?.hasPlatformKey && !changingKeyNotConnected ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Platform key is configured. You can proceed to connect.
                  </p>
                  <button
                    onClick={() => setChangingKeyNotConnected(true)}
                    className="ml-3 flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}
                  >
                    <Shield size={12} />
                    Change Key
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
                    Go to ImportBrain &rarr; Integrations &rarr; Setup Guide, generate a platform key, and paste it here.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={platformKeyInput}
                      onChange={(e) => setPlatformKeyInput(e.target.value)}
                      placeholder="pk_..."
                      className="flex-1 rounded-lg border px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-[var(--gold)]"
                      style={{
                        background: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--white)',
                      }}
                    />
                    <button
                      onClick={() => saveKeyMutation.mutate(platformKeyInput)}
                      disabled={!platformKeyInput.trim() || saveKeyMutation.isPending}
                      className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ background: 'var(--gold)', color: 'var(--black)' }}
                    >
                      {saveKeyMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      Save
                    </button>
                  </div>
                  {saveKeyMutation.isError && (
                    <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>
                      Failed to save platform key.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Step 2: Connect */}
            <div
              className="rounded-lg border px-4 py-3"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--deep)',
                opacity: status?.hasPlatformKey ? 1 : 0.5,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: 'rgba(240,165,0,0.15)',
                    color: 'var(--gold)',
                  }}
                >
                  2
                </span>
                <p className="text-xs font-semibold" style={{ color: 'var(--white)' }}>
                  Connect to ImportBrain
                </p>
              </div>
              <button
                onClick={() => connectMutation.mutate()}
                disabled={connectMutation.isPending || !status?.hasPlatformKey}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: 'var(--gold)', color: 'var(--black)' }}
              >
                {connectMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plug size={16} />
                )}
                Connect to ImportBrain
              </button>
            </div>

            {connectMutation.isError && (
              <p className="text-xs" style={{ color: '#ef4444' }}>
                Failed to connect. Ensure ImportBrain is reachable and the platform key is valid.
              </p>
            )}
          </div>
        )}
      </SettingsSection>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const [saving, setSaving] = useState(false);

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

      {/* Integrations */}
      {activeTab === 'integrations' && <IntegrationsTab />}

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
          onClick={() => {
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              // TODO: wire to real save API
            }, 800);
          }}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          {saving && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { BudgetEntry, Product, Vendor } from '../../types';

interface BudgetFormProps {
  editingEntry: BudgetEntry | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
}

const CATEGORIES = ['hardware', 'software', 'services'];
const STATUSES = ['planned', 'approved', 'ordered', 'delivered'];

// initial form state - reset to this after submit or cancel
const emptyForm = {
  productId: '',
  vendorId: '',
  category: 'hardware',
  amount: '',
  quantity: '1',
  description: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  status: 'planned',
};

// shared input styling
const inputClass =
  'w-full rounded-2xl border border-white/85 bg-white/84 px-4 py-2.5 text-sm text-gray-800 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-all duration-200 placeholder-gray-400 hover:border-slate-300 focus:border-transparent focus:ring-2 focus:ring-blue-500';

const labelClass = 'block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5';

export const BudgetForm = ({ editingEntry, onSuccess, onCancelEdit }: BudgetFormProps) => {
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products and vendors for dropdowns
  useEffect(() => {
    api.get<Product[]>('/products').then((r) => setProducts(r.data)).catch(() => {});
    api.get<Vendor[]>('/vendors').then((r) => setVendors(r.data)).catch(() => {});
  }, []);

  // Populate form when editing an existing entry
  useEffect(() => {
    if (editingEntry) {
      setForm({
        productId: editingEntry.productId ?? '',
        vendorId: editingEntry.vendorId ?? '',
        category: editingEntry.category,
        amount: String(editingEntry.amount),
        quantity: String(editingEntry.quantity),
        description: editingEntry.description,
        purchaseDate: editingEntry.purchaseDate.split('T')[0],
        status: editingEntry.status,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [editingEntry]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        quantity: parseInt(form.quantity, 10),
        productId: form.productId || undefined,
        vendorId: form.vendorId || undefined,
      };
      if (editingEntry) {
        await api.put(`/budget/${editingEntry.id}`, payload);
      } else {
        await api.post('/budget', payload);
      }
      setForm(emptyForm);
      onSuccess();
    } catch {
      setError('Fehler beim Speichern. Bitte überprüfe die Eingaben.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in-soft animate-in-soft-delay-1 relative overflow-hidden rounded-[30px] border border-white/80 bg-white/88 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(191,219,254,0.1),transparent_24%)]" />
      <div className="relative">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          {editingEntry ? 'Eintrag bearbeiten' : 'Neue Ausgabe'}
        </h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Beschreibung *</label>
          <input
            type="text"
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="z.B. 5x Dell Latitude 5540"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Kategorie *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Betrag (€) *</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Menge</label>
            <input
              type="number"
              required
              min="1"
              step="1"
              value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Datum *</label>
          <input
            type="date"
            required
            value={form.purchaseDate}
            onChange={(e) => set('purchaseDate', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Produkt</label>
          <select
            value={form.productId}
            onChange={(e) => set('productId', e.target.value)}
            className={inputClass}
          >
            <option value="">— Kein Produkt —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Lieferant</label>
          <select
            value={form.vendorId}
            onChange={(e) => set('vendorId', e.target.value)}
            className={inputClass}
          >
            <option value="">— Kein Lieferant —</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* buttons are a lil louder here because this is the action area */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-2xl bg-blue-500 px-6 py-2.5 font-medium text-white shadow-[0_12px_24px_rgba(59,130,246,0.24)] transition-all duration-200 hover:bg-blue-600 hover:shadow-[0_16px_30px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Speichert…' : editingEntry ? 'Aktualisieren' : 'Speichern'}
          </button>
          {editingEntry && (
            <button
              type="button"
              onClick={() => { setForm(emptyForm); onCancelEdit(); }}
              className="rounded-2xl border border-white/85 bg-white/78 px-6 py-2.5 font-medium text-gray-700 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Abbrechen
            </button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

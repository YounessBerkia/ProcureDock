import { CircleDollarSign, LayoutGrid, ReceiptText, WalletCards } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { BudgetForm } from '../components/budget/BudgetForm';
import { BudgetPieChart } from '../components/budget/BudgetPieChart';
import { BudgetBarChart } from '../components/budget/BudgetBarChart';
import { BudgetTable } from '../components/budget/BudgetTable';
import { LoadingStateCard } from '../components/ui/LoadingSpinner';
import { PageIntro, StatCard, SurfaceCard } from '../components/ui/DashboardPrimitives';
import type { BudgetEntry, BudgetStats } from '../types';

export const BudgetTracker = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [stats, setStats] = useState<BudgetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<BudgetEntry | null>(null);

  // fetch budget entries and stats together
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [entriesRes, statsRes] = await Promise.all([
        api.get<BudgetEntry[]>('/budget'),
        api.get<BudgetStats>('/budget/stats'),
      ]);
      setEntries(entriesRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch {
      setError('Daten konnten nicht geladen werden. Ist das Backend gestartet?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // delete handler - refresh data after successful delete
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/budget/${id}`);
      await fetchData();
    } catch {
      alert('Fehler beim Löschen des Eintrags.');
    }
  };

  const spentPct = stats ? Math.min((stats.totalSpent / stats.totalBudget) * 100, 100) : 0;
  const approvedEntries = entries.filter((entry) => ['approved', 'ordered', 'delivered'].includes(entry.status)).length;
  const categoriesTracked = new Set(entries.map((entry) => entry.category)).size;

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Finanzsteuerung"
        title="Budgetverwaltung"
        description="Geplante und tatsächliche Beschaffungsausgaben mit den Quartalsvorgaben abgleichen und Handlungsbedarf bei der nächsten Budgetentscheidung frühzeitig erkennen."
        meta="Quartalsplanung"
      />

      {loading && (
        <LoadingStateCard label="Budgetdaten werden geladen..." />
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && stats && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={CircleDollarSign}
              label="Gesamtausgaben"
              value={`€${stats.totalSpent.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
              hint={`€${stats.remaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })} verbleiben in diesem Quartal.`}
              accent="blue"
            />
            <StatCard
              icon={WalletCards}
              label="Geplantes Budget"
              value={`€${stats.totalBudget.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
              hint="Gesamtes Planbudget für das laufende Quartal."
              accent="slate"
            />
            <StatCard
              icon={ReceiptText}
              label="Freigegebene Einträge"
              value={String(approvedEntries)}
              hint="Genehmigte, bestellte oder bereits gelieferte Beschaffungen."
              accent="green"
            />
            <StatCard
              icon={LayoutGrid}
              label="Erfasste Kategorien"
              value={String(categoriesTracked)}
              hint="Budgetverteilung über die erfassten Beschaffungskategorien."
              accent="orange"
            />
          </div>

          <SurfaceCard className="overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Gesamtbudget Q1 2026</p>
                <p className="text-2xl font-semibold text-gray-800">
                  €{stats.totalSpent.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    von €{stats.totalBudget.toLocaleString('de-DE')}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Verbleibend</p>
                <p className="text-xl font-semibold text-green-600">
                  €{stats.remaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{spentPct.toFixed(1)}% verbraucht</p>
          </SurfaceCard>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <BudgetForm
              editingEntry={editingEntry}
              onSuccess={() => { setEditingEntry(null); fetchData(); }}
              onCancelEdit={() => setEditingEntry(null)}
            />
            <div className="grid grid-cols-1 gap-6">
              <BudgetPieChart stats={stats} />
              <BudgetBarChart stats={stats} />
            </div>
          </div>

          <BudgetTable
            entries={entries}
            onEdit={(entry) => setEditingEntry(entry)}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

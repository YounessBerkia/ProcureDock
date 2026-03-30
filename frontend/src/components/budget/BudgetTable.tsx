import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import type { BudgetEntry } from '../../types';

interface BudgetTableProps {
  entries: BudgetEntry[];
  onEdit: (entry: BudgetEntry) => void;
  onDelete: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  planned:   'bg-gray-100 text-gray-600',
  approved:  'bg-blue-100 text-blue-700',
  ordered:   'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  planned:   'Geplant',
  approved:  'Genehmigt',
  ordered:   'Bestellt',
  delivered: 'Geliefert',
};

export const BudgetTable = ({ entries, onEdit, onDelete }: BudgetTableProps) => {
  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`"${description}" wirklich löschen?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Alle Ausgaben</h2>
        <span className="text-sm text-blue-500 font-medium">{entries.length} Einträge</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beschreibung
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Betrag
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="transition-colors duration-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800 font-medium max-w-xs">
                  <p className="truncate">{entry.description}</p>
                  {entry.product && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.product.name}</p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 capitalize">{entry.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    €{(entry.amount * entry.quantity).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </p>
                  {entry.quantity > 1 && (
                    <p className="text-xs text-gray-400">
                      {entry.quantity}× €{entry.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(entry.purchaseDate), 'dd.MM.yyyy', { locale: de })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[entry.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Bearbeiten"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id, entry.description)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                  Noch keine Ausgaben erfasst
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

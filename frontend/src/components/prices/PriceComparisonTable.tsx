import { useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Price } from '../../types';

interface PriceComparisonTableProps {
  prices: Price[];
}

type SortField = 'price' | 'scrapedAt';
type SortDir = 'asc' | 'desc';

export const PriceComparisonTable = ({ prices }: PriceComparisonTableProps) => {
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...prices].sort((a, b) => {
    const val = sortField === 'price'
      ? a.price - b.price
      : new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime();
    return sortDir === 'asc' ? val : -val;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300 inline ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-500 inline ml-1" />
      : <ChevronDown className="w-3 h-3 text-blue-500 inline ml-1" />;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Table Header Bar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Preisvergleich</h2>
        <span className="text-sm text-blue-500 font-medium">{prices.length} Einträge</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produkt
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lieferant
              </th>
              <th
                className="cursor-pointer select-none px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors duration-200 hover:text-gray-700"
                onClick={() => handleSort('price')}
              >
                Preis <SortIcon field="price" />
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
              <th
                className="cursor-pointer select-none px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors duration-200 hover:text-gray-700"
                onClick={() => handleSort('scrapedAt')}
              >
                Datum <SortIcon field="scrapedAt" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((price) => (
              <tr key={price.id} className="transition-colors duration-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800 font-medium whitespace-nowrap">
                  {price.product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {price.vendor.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-semibold text-right whitespace-nowrap">
                  €{price.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {price.inStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Lagernd
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Nicht lagernd
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg p-1 text-blue-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {format(new Date(price.scrapedAt), 'dd.MM.yyyy', { locale: de })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

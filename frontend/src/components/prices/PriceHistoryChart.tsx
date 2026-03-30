import { useState, useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Price } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface PriceHistoryChartProps {
  prices: Price[];
}

// Plugin that injects a gradient fill before each draw
const gradientPlugin: Plugin<'line'> = {
  id: 'gradientFill',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = gradient;
    });
  },
};

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderColor: '#3B82F6',
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      backgroundColor: '#3B82F6',
      borderColor: '#fff',
      borderWidth: 2,
      radius: 5,
      hoverRadius: 7,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1F2937',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx) => `€${(ctx.parsed.y ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9CA3AF', font: { size: 11 } },
    },
    y: {
      beginAtZero: false,
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
      ticks: {
        color: '#9CA3AF',
        font: { size: 11 },
        callback: (val) => `€${Number(val).toLocaleString('de-DE')}`,
      },
    },
  },
};

export const PriceHistoryChart = ({ prices }: PriceHistoryChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Unique products from price list
  const products = useMemo(() => {
    const seen = new Set<string>();
    return prices
      .map((p) => p.product)
      .filter((p) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
  }, [prices]);

  const [selectedProductId, setSelectedProductId] = useState(() => products[0]?.id ?? '');

  // Prices for selected product, sorted by date
  const filtered = useMemo(
    () => prices
      .filter((p) => p.productId === selectedProductId)
      .sort((a, b) => new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime()),
    [prices, selectedProductId]
  );

  const labels = filtered.map((p) =>
    format(new Date(p.scrapedAt), 'dd.MM.yy', { locale: de })
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: filtered.map((p) => p.price),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.15)', // overridden by plugin
        borderColor: '#3B82F6',
        tension: 0.4,
      },
    ],
  };

  const lowestPrice = filtered.length > 0 ? Math.min(...filtered.map((p) => p.price)) : null;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Preisverlauf</h2>
          {lowestPrice !== null && (
            <p className="text-sm text-gray-500 mt-0.5">
              Bestes Angebot: <span className="text-green-600 font-medium">€{lowestPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
            </p>
          )}
        </div>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {filtered.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
          Keine Preisdaten für dieses Produkt
        </div>
      ) : (
        <div className="h-80">
          <Line
            ref={chartRef}
            data={chartData}
            options={chartOptions}
            plugins={[gradientPlugin]}
          />
        </div>
      )}

      {/* Legend — vendors */}
      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {[...new Set(filtered.map((p) => p.vendor.name))].map((name) => (
            <span key={name} className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

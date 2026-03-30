import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { BudgetStats } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
  hardware: '#60A5FA',
  software: '#10B981',
  services: '#F59E0B',
};
const FALLBACK_COLORS = ['#93C5FD', '#BFDBFE', '#6EE7B7', '#FCD34D', '#FDA4AF'];

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
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
      displayColors: true,
      callbacks: {
        label: (ctx) => {
          const total = (ctx.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
          return ` €${ctx.parsed.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (${pct}%)`;
        },
      },
    },
  },
};

interface BudgetPieChartProps {
  stats: BudgetStats;
}

export const BudgetPieChart = ({ stats }: BudgetPieChartProps) => {
  const categories = Object.keys(stats.byCategory);
  const amounts = categories.map((c) => stats.byCategory[c]);
  const colors = categories.map((c, i) => CATEGORY_COLORS[c] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]);

  const total = amounts.reduce((a, b) => a + b, 0);

  const data = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{ data: amounts, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }],
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Ausgaben nach Kategorie</h2>
        <span className="text-sm text-blue-500 font-medium">
          €{total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Chart */}
        <div className="relative" style={{ width: 160, height: 160, flexShrink: 0 }}>
          <Doughnut data={data} options={chartOptions} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-gray-400 leading-none">Gesamt</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              €{(total / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex flex-col gap-2 flex-1">
          {categories.map((cat, i) => (
            <li key={cat} className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
                <span className="text-sm text-gray-600 capitalize">{cat}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                €{stats.byCategory[cat].toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { BudgetStats } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Bar chart colors from Design.md
const barColors = [
  '#60A5FA', // Light Blue
  '#93C5FD', // Lighter Blue
  '#BFDBFE', // Very Light Blue
];

// Global chart options from Design.md
const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
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
      border: { display: false },
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
      ticks: {
        color: '#9CA3AF',
        font: { size: 11 },
        callback: (val) => `€${Number(val).toLocaleString('de-DE')}`,
      },
    },
  },
};

interface BudgetBarChartProps {
  stats: BudgetStats;
}

export const BudgetBarChart = ({ stats }: BudgetBarChartProps) => {
  const quarters = Object.keys(stats.byQuarter).sort();
  const amounts = quarters.map((q) => stats.byQuarter[q]);

  const data = {
    labels: quarters,
    datasets: [
      {
        data: amounts,
        backgroundColor: quarters.map((_, i) => barColors[i % barColors.length]),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Ausgaben pro Quartal</h2>
        <span className="text-sm text-blue-500 font-medium">{quarters.length} Quartale</span>
      </div>
      <div className="h-64">
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
};

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CircleDollarSign, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { PageIntro, SectionHeading, StatCard, SurfaceCard } from '../components/ui/DashboardPrimitives';

const budgetData = [
  { name: '1', value: 3500 },
  { name: '2', value: 4200 },
  { name: '3', value: 3800 },
  { name: '4', value: 5100 },
  { name: '5', value: 4800 },
  { name: '6', value: 6200 },
  { name: '7', value: 5900 },
];

const vendorData = [
  { name: '1', value: 2 },
  { name: '2', value: 3 },
  { name: '3', value: 4 },
  { name: '4', value: 5 },
  { name: '5', value: 6 },
  { name: '6', value: 7 },
  { name: '7', value: 8 },
];

const ordersData = [
  { name: '1', value: 8 },
  { name: '2', value: 10 },
  { name: '3', value: 9 },
  { name: '4', value: 11 },
  { name: '5', value: 12 },
  { name: '6', value: 14 },
  { name: '7', value: 12 },
];

const overviewTrend = [
  { month: 'Jan', spend: 8400, savings: 1100 },
  { month: 'Feb', spend: 11600, savings: 1600 },
  { month: 'Mar', spend: 10250, savings: 1450 },
  { month: 'Apr', spend: 13400, savings: 1920 },
  { month: 'May', spend: 12300, savings: 1740 },
  { month: 'Jun', spend: 14950, savings: 2140 },
];

export const Dashboard = () => {
  const recentOrders = [
    { product: 'Dell Latitude 5540', vendor: 'Alternate', amount: 1299.0, date: '28.03.2026' },
    { product: 'HP ProDesk 400', vendor: 'Notebooksbilliger', amount: 849.5, date: '25.03.2026' },
    { product: 'Logitech MX Master 3', vendor: 'Amazon Business', amount: 99.9, date: '24.03.2026' },
    { product: 'Samsung T7 SSD 1TB', vendor: 'Alternate', amount: 89.99, date: '22.03.2026' },
    { product: 'Philips 27" Monitor', vendor: 'Cyberport', amount: 249.0, date: '20.03.2026' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Control Center"
        title="Procurement dashboard"
        description="A cleaner overview of price movement, supplier health, and budget usage so the most important signals are visible at a glance."
        meta="Operations snapshot"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label="Spend this quarter"
          value="€18.850"
          hint="€31.150 remaining from the planned budget."
          accent="blue"
        />
        <StatCard
          icon={ShieldCheck}
          label="Vendor reliability"
          value="91%"
          hint="Top vendors are performing above the target reliability band."
          accent="green"
        />
        <StatCard
          icon={Truck}
          label="Average delivery"
          value="2.6 days"
          hint="Fast shipping across active hardware suppliers."
          accent="orange"
        />
        <StatCard
          icon={PackageCheck}
          label="Open orders"
          value="12"
          hint="Most recent orders are already approved or delivered."
          accent="slate"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Gesamtbudget"
          value="€18.850"
          suffix="von €50.000"
          data={budgetData}
          color="#60A5FA"
        />
        <MetricCard
          title="Aktive Lieferanten"
          value="8"
          data={vendorData}
          color="#93C5FD"
        />
        <MetricCard
          title="Neueste Bestellungen"
          value="12"
          data={ordersData}
          color="#3B82F6"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <SurfaceCard padding="lg">
          <SectionHeading
            title="Spending momentum"
            description="Monthly spend and negotiated savings across the current planning window."
            action={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">6 months tracked</span>}
          />

          <div className="h-80 rounded-[24px] bg-gradient-to-b from-slate-50 to-white p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `€${(Number(value) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`€${Number(value ?? 0).toLocaleString('de-DE')}`, 'Spend']}
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Area type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2.5} fill="url(#spendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SurfaceCard>

        <div className="flex flex-col gap-6">
          <SurfaceCard>
            <SectionHeading
              title="Procurement pulse"
              description="Where the current cycle is strongest."
            />
            <div className="space-y-4">
              {[
                { label: 'Savings realized', value: '€2.140', width: '78%' },
                { label: 'Orders approved', value: '86%', width: '86%' },
                { label: 'Vendors above SLA', value: '91%', width: '91%' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-gray-50 px-4 py-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <SectionHeading
              title="Priority actions"
              description="Tasks worth attention before the next order wave."
            />
            <div className="space-y-3">
              {[
                'Review Dell Latitude price dip from Alternate.',
                'Approve Q2 monitor refresh budget allocation.',
                'Re-rate Cyberport after recent delivery improvement.',
              ].map((item) => (
                <div key={item} className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recent orders</h2>
            <p className="mt-1 text-sm text-gray-500">Latest procurement activity across hardware and peripherals.</p>
          </div>
          <span className="text-sm font-medium text-blue-500">5 entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order, index) => (
                <tr key={index} className="transition-colors duration-200 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800">
                    €{order.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

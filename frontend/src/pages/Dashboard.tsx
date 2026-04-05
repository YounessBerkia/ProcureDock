import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CircleDollarSign, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { BloomCard, Chip, PageIntro, SectionHeading, StatCard, SurfaceCard } from '../components/ui/DashboardPrimitives';

// TODO: replace with real data from api endpoint
const budgetData = [
  { name: '1', value: 3500 },
  { name: '2', value: 4200 },
  { name: '3', value: 3800 },
  { name: '4', value: 5100 },
  { name: '5', value: 4800 },
  { name: '6', value: 6200 },
  { name: '7', value: 5900 },
];

// todo: fetch vendor count from backend
const vendorData = [
  { name: '1', value: 2 },
  { name: '2', value: 3 },
  { name: '3', value: 4 },
  { name: '4', value: 5 },
  { name: '5', value: 6 },
  { name: '6', value: 7 },
  { name: '7', value: 8 },
];

// FIXME: calculate dynamically from orders endpoint
const ordersData = [
  { name: '1', value: 8 },
  { name: '2', value: 10 },
  { name: '3', value: 9 },
  { name: '4', value: 11 },
  { name: '5', value: 12 },
  { name: '6', value: 14 },
  { name: '7', value: 12 },
];

// hardcoded for demo - need to fetch from /api/budget endpoint
const overviewTrend = [
  { month: 'Jan', spend: 8400, savings: 1100 },
  { month: 'Feb', spend: 11600, savings: 1600 },
  { month: 'Mar', spend: 10250, savings: 1450 },
  { month: 'Apr', spend: 13400, savings: 1920 },
  { month: 'May', spend: 12300, savings: 1740 },
  { month: 'Jun', spend: 14950, savings: 2140 },
];

export const Dashboard = () => {
  // todo: move this to backend and fetch properly
  const recentOrders = [
    { product: 'Dell Latitude 5540', vendor: 'Alternate', amount: 1299.0, date: '28.03.2026', abteilung: 'IT-Abteilung' },
    { product: 'HP ProDesk 400 G9', vendor: 'Notebooksbilliger', amount: 849.5, date: '25.03.2026', abteilung: 'Buchhaltung' },
    { product: 'Logitech MX Master 3', vendor: 'Bechtle', amount: 99.9, date: '24.03.2026', abteilung: 'Verwaltung' },
    { product: 'Samsung T7 SSD 1TB', vendor: 'Alternate', amount: 89.99, date: '22.03.2026', abteilung: 'IT-Abteilung' },
    { product: 'Philips 27" Monitor 272B1G', vendor: 'Cyberport', amount: 249.0, date: '20.03.2026', abteilung: 'Geschäftsführung' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Beschaffungszentrale"
        title="IT-Beschaffung Q1 2026"
        description="Zentrales Steuerungsinstrument für die IT-Beschaffung der IHK Wiesbaden. Übersicht über Preise, Lieferanten und Budgetstatus."
        meta="Betriebsübersicht"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label="Ausgaben dieses Quartals"
          value="€18.850"
          hint="€31.150 verbleiben vom geplanten Jahresbudget."
          accent="blue"
        />
        <StatCard
          icon={ShieldCheck}
          label="Lieferantenzuverlässigkeit"
          value="91%"
          hint="Hauptlieferanten erfüllen die Zielwerte der Leistungsvereinbarung."
          accent="green"
        />
        <StatCard
          icon={Truck}
          label="Ø Lieferzeit"
          value="2,6 Tage"
          hint="Schnelle Lieferung durch aktive Hardware-Lieferanten sichergestellt."
          accent="orange"
        />
        <StatCard
          icon={PackageCheck}
          label="Offene Bestellungen"
          value="12"
          hint="Die meisten Bestellungen sind bereits genehmigt oder geliefert."
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
        <BloomCard className="min-w-0 p-8">
          <SectionHeading
            title="Ausgabenentwicklung 2026"
            description="Monatliche Ausgaben und erzielte Einsparungen im laufenden Planungszeitraum."
            action={<Chip>6 Monate erfasst</Chip>}
          />

          <div className="h-80 rounded-[26px] border border-white/70 bg-gradient-to-b from-slate-50/95 via-white to-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
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
                    border: '1px solid rgba(255,255,255,0.9)',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Area type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2.5} fill="url(#spendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BloomCard>

        <div className="min-w-0 flex flex-col gap-6">
          <SurfaceCard>
            <SectionHeading
              title="Beschaffungsstatus"
              description="Aktuelle Kennzahlen des laufenden Beschaffungszyklus."
            />
            <div className="space-y-4">
              {[
                { label: 'Erzielte Einsparungen', value: '€2.140', width: '78%' },
                { label: 'Bestellungen genehmigt', value: '86%', width: '86%' },
                { label: 'Lieferanten über SLA', value: '91%', width: '91%' },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/75 bg-white/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <SectionHeading
              title="Offene Aufgaben"
              description="Handlungsbedarf vor der nächsten Bestellrunde."
            />
            <div className="space-y-3">
              {[
                'Preisrückgang Dell Latitude bei Alternate prüfen.',
                'Budgetfreigabe für Q2-Monitorerneuerung beantragen.',
                'Cyberport nach verbesserter Lieferleistung neu bewerten.',
              ].map((item) => (
                <div key={item} className="rounded-[20px] border border-white/75 bg-white/72 px-4 py-3 text-sm text-gray-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/88 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)]">
        <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/65 px-6 py-4 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Letzte Beschaffungsvorgänge</h2>
            <p className="mt-1 text-sm text-gray-500">Aktuelle Bestellaktivitäten über Hardware und Peripheriegeräte.</p>
          </div>
          <span className="text-sm font-medium text-blue-500">5 Einträge</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200/70 bg-slate-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieferant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abteilung
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Betrag
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.abteilung}
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

# 🎨 ProcureDock Design-System

## 📸 Design-Referenz

**Inspiration:** Modernes, minimalistisches Dashboard mit viel Whitespace und cleaner Struktur.

**Design-Philosophie:**
- **Luftig & Clean:** Großzügige Abstände, kein visuelles Clutter
- **Soft & Freundlich:** Abgerundete Ecken, sanfte Schatten, keine harten Kanten
- **Datenvisualisierung im Fokus:** Charts als zentrale Elemente, nicht nur Dekoration
- **Professionell aber zugänglich:** Nicht zu steril, nicht zu verspielt

---

## 🎨 Farbpalette

### Primary Colors
```css
Primary Blue:    #3B82F6  (Tailwind: bg-blue-500)
Light Blue:      #60A5FA  (Tailwind: bg-blue-400)
Pale Blue:       #DBEAFE  (Tailwind: bg-blue-100)
```

### Accent Colors
```css
Success Green:   #10B981  (Tailwind: bg-green-500)
Warning Orange:  #F59E0B  (Tailwind: bg-orange-500)
Danger Red:      #EF4444  (Tailwind: bg-red-500)
```

### Neutrals
```css
Pure White:      #FFFFFF  (bg-white)
Light Gray:      #F9FAFB  (bg-gray-50)  - Card backgrounds
Medium Gray:     #E5E7EB  (bg-gray-200) - Borders
Text Gray:       #6B7280  (text-gray-500) - Secondary text
Dark Gray:       #1F2937  (text-gray-800) - Primary text
```

### Chart Colors
```css
Chart Bar 1:     #60A5FA  (Light Blue)
Chart Bar 2:     #93C5FD  (Lighter Blue)
Chart Area:      linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.05))
```

---

## 📐 Layout-Struktur

### Grid-System
```jsx
// Main Container
<div className="flex h-screen bg-gray-50">
  {/* Sidebar - Fixed Width */}
  <aside className="w-64 bg-white border-r border-gray-200" />
  
  {/* Main Content - Flex Grow */}
  <main className="flex-1 overflow-y-auto p-8">
    {/* Content hier */}
  </main>
</div>
```

### Responsive Breakpoints
- **Mobile (default):** Sidebar collapsible (Burger-Menu)
- **Tablet (md: 768px+):** Sidebar visible aber schmaler (w-20, nur Icons)
- **Desktop (lg: 1024px+):** Sidebar full width (w-64, Icons + Text)

---

## 🧩 Komponenten-Styles

### 1. Sidebar Navigation

**Design:**
- Hellgrauer Hintergrund für aktiven Link
- Icon + Text nebeneinander
- Soft Hover-Effekt

```jsx
// Sidebar-Link-Komponente
<a 
  href="/dashboard"
  className={`
    flex items-center gap-3 px-4 py-3 rounded-lg
    text-gray-600 hover:bg-gray-100 hover:text-gray-900
    transition-colors duration-200
    ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : ''}
  `}
>
  <Icon className="w-5 h-5" />
  <span>Dashboard</span>
</a>
```

### 2. Metric Cards (Top Row)

**Design:**
- Weiße Cards mit soft shadow
- Chart + Value + Label
- Hover: Shadow intensiviert sich

```jsx
<div className="
  bg-white rounded-2xl p-6 
  shadow-sm hover:shadow-md 
  transition-shadow duration-300
  border border-gray-100
">
  {/* Label */}
  <p className="text-sm text-gray-500 mb-2">Daily Stats</p>
  
  {/* Chart Mini */}
  <div className="h-24 mb-3">
    <BarChart data={...} />
  </div>
  
  {/* Value */}
  <p className="text-2xl font-semibold text-gray-800">
    €3,782
  </p>
</div>
```

**Spacing:**
```jsx
// Grid für 3 Metric Cards
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <MetricCard />
  <MetricCard />
  <MetricCard />
</div>
```

### 3. Chart-Container (Large)

**Design:**
- Größere weiße Card
- Padding großzügig
- Chart nimmt vollen Platz ein

```jsx
<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
  {/* Header mit Titel */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold text-gray-800">
      Quick Overview
    </h2>
    <span className="text-sm text-blue-500 font-medium">
      2,562 Items
    </span>
  </div>
  
  {/* Chart */}
  <div className="h-80">
    <BarChart data={...} options={{...}} />
  </div>
</div>
```

### 4. Area Chart (Gradient)

**Chart.js Config für Area-Chart:**
```javascript
const chartOptions = {
  // ... andere Options
  elements: {
    line: {
      borderColor: '#3B82F6',
      borderWidth: 2,
      tension: 0.4, // Smooth curves
      fill: true,
    },
  },
  plugins: {
    filler: {
      propagate: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

// Gradient Fill
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
```

### 5. Tabellen

**Design:**
- Keine Borders zwischen Zeilen (nur Hover-Effekt)
- Zebra-Striping optional
- Sticky Header bei Scroll

```jsx
<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Product
        </th>
        {/* ... mehr Spalten */}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-800">
          Dell Latitude 5540
        </td>
        {/* ... mehr Zellen */}
      </tr>
    </tbody>
  </table>
</div>
```

### 6. Buttons

**Primary Button:**
```jsx
<button className="
  px-6 py-2.5 
  bg-blue-500 hover:bg-blue-600 
  text-white font-medium 
  rounded-lg 
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
">
  Save Changes
</button>
```

**Secondary Button:**
```jsx
<button className="
  px-6 py-2.5 
  bg-white hover:bg-gray-50 
  text-gray-700 font-medium 
  border border-gray-300 
  rounded-lg 
  shadow-sm
  transition-all duration-200
">
  Cancel
</button>
```

### 7. Input Fields

```jsx
<input 
  type="text"
  className="
    w-full px-4 py-2.5
    border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    placeholder-gray-400
    transition-all duration-200
  "
  placeholder="Enter product name..."
/>
```

---

## 🎯 Spacing-System

### Container Padding
```css
Page Container:     p-8     (2rem)
Card Padding:       p-6     (1.5rem)
Large Card:         p-8     (2rem)
```

### Grid Gaps
```css
Metric Cards:       gap-6   (1.5rem)
Content Sections:   gap-8   (2rem)
Table Cells:        px-6 py-4
```

### Vertical Rhythm
```css
Section Margin:     mb-8    (2rem)
Card Margin:        mb-6    (1.5rem)
Element Margin:     mb-4    (1rem)
```

---

## 🔤 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Headings
```jsx
// Page Title (H1)
<h1 className="text-3xl font-bold text-gray-900 mb-8">
  Dashboard
</h1>

// Section Title (H2)
<h2 className="text-xl font-semibold text-gray-800 mb-4">
  Price Comparison
</h2>

// Card Title (H3)
<h3 className="text-lg font-medium text-gray-800 mb-3">
  Quick Overview
</h3>
```

### Body Text
```jsx
// Primary Text
<p className="text-base text-gray-800">...</p>

// Secondary Text
<p className="text-sm text-gray-500">...</p>

// Small Text (Labels)
<span className="text-xs text-gray-400 uppercase tracking-wide">...</span>
```

---

## 📊 Chart-Styling (Chart.js)

### Global Chart Options
```javascript
const globalChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Meist ausgeblendet für cleanen Look
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1F2937',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Keine vertikale Grid-Lines
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)', // Sehr subtile horizontale Lines
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11,
        },
      },
    },
  },
};
```

### Bar Chart Colors
```javascript
// Für Balkendiagramme: Abwechselnd hell/dunkel
const barColors = [
  '#60A5FA', // Light Blue
  '#93C5FD', // Lighter Blue
  '#BFDBFE', // Very Light Blue
];
```

---

## 🎭 Animations & Transitions

### Hover-Effekte
```css
/* Cards */
hover:shadow-md transition-shadow duration-300

/* Buttons */
hover:bg-blue-600 transition-all duration-200

/* Links */
hover:text-blue-600 transition-colors duration-200

/* Table Rows */
hover:bg-gray-50 transition-colors
```

### Loading States
```jsx
// Skeleton Loader für Cards
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

## 🖼️ Icon-System

**Library:** Lucide React

**Usage:**
```jsx
import { Home, TrendingUp, DollarSign, Users } from 'lucide-react';

<Home className="w-5 h-5 text-gray-600" />
```

**Standard Sizes:**
- Sidebar Icons: `w-5 h-5` (20px)
- Metric Icons: `w-6 h-6` (24px)
- Large Icons: `w-8 h-8` (32px)

---

## 📱 Responsive Design

### Mobile-First Approach

**Sidebar:**
```jsx
// Mobile: Hidden, zeige Burger-Menu
<aside className="
  hidden lg:block
  w-64 bg-white border-r border-gray-200
">
  {/* Sidebar Content */}
</aside>

// Mobile Menu Button (nur auf Mobile sichtbar)
<button className="lg:hidden fixed top-4 left-4 z-50">
  <Menu className="w-6 h-6" />
</button>
```

**Grid-Layouts:**
```jsx
// Metric Cards: 1 Col → 2 Cols → 3 Cols
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Content: 1 Col → 2 Cols
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

---

## ✅ Komponenten-Checkliste

Beim Erstellen von UI-Komponenten IMMER beachten:

- [ ] **Spacing:** Großzügig, luftig (min. p-6 für Cards)
- [ ] **Rounded Corners:** `rounded-lg` oder `rounded-2xl`
- [ ] **Soft Shadows:** `shadow-sm` default, `hover:shadow-md`
- [ ] **Border:** Subtile Borders `border-gray-100` oder `border-gray-200`
- [ ] **Hover-States:** Smooth transitions (`transition-all duration-200`)
- [ ] **Focus-States:** Ring für Accessibility (`focus:ring-2`)
- [ ] **Responsive:** Mobile-first, dann Breakpoints
- [ ] **Loading-State:** Skeleton oder Spinner
- [ ] **Error-State:** Error-Message mit Icon

---

## 🎯 Praktische Beispiele

### Dashboard-Layout komplett
```jsx
<div className="flex h-screen bg-gray-50">
  {/* Sidebar */}
  <Sidebar />
  
  {/* Main Content */}
  <main className="flex-1 overflow-y-auto p-8">
    {/* Page Title */}
    <h1 className="text-3xl font-bold text-gray-900 mb-8">
      Dashboard
    </h1>
    
    {/* Metric Cards Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard title="Total Budget" value="€50,000" />
      <MetricCard title="Active Vendors" value="12" />
      <MetricCard title="Recent Orders" value="34" />
    </div>
    
    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Price History</h2>
        <LineChart />
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Budget Breakdown</h2>
        <PieChart />
      </div>
    </div>
  </main>
</div>
```

---

## 🚀 Quick-Start für Claude Code

**Beim Start jedes UI-Packets:**
1. Diese Design.md öffnen
2. Farben aus Palette kopieren
3. Komponenten-Templates verwenden
4. Spacing-System einhalten
5. Hover-States nicht vergessen!

**Golden Rule:**
> "Wenn es nicht luftig und clean aussieht, ist zu wenig Padding drin!" 🎨

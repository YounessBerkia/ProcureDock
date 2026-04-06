![ProcureDock Banner](assets/banner.png)

# ProcureDock

Webbasiertes IT-Beschaffungs-Dashboard, entwickelt als Portfolioprojekt für die IHK Wiesbaden im Rahmen der Ausbildung zum IT-Kaufmann / IT-System-Management.

**Live:** [procure-dock.vercel.app](https://procure-dock.vercel.app)

---

## Demo

<p align="center">
  <strong>Primary Demo · Desktop</strong><br />
  <sub>Vollansicht des Dashboards mit Preisvergleich, Budgetverwaltung und Lieferantenübersicht.</sub><br /><br />
  <img src="assets/demo.gif" alt="ProcureDock Desktop Demo" width="900" />
</p>

<p align="center">
  <strong>Mobile Preview</strong><br />
  <sub>Kompakte Ansicht, um das Layout und die Nutzung auf kleineren Displays zu zeigen.</sub><br /><br />
  <img src="assets/mobile-demo.gif" alt="ProcureDock Mobile Demo" width="260" />
</p>

---

## Was ist ProcureDock?

ProcureDock ist kein reales Produkt für den produktiven Einsatz, sondern ein persönliches Bewerbungs- und Lernprojekt für die IHK Wiesbaden. Ich wollte besser verstehen, wie solche internen Beschaffungs- oder Verwaltungs-Dashboards aufgebaut sind, welche Bereiche typischerweise dazugehören und wie so etwas technisch umgesetzt werden kann.

Dafür habe ich mich in das Thema eingelesen und auf dieser Grundlage ein eigenes Beispiel-Dashboard gebaut. Dieses hat typische Bausteine wie Preisvergleich, Budgetübersicht und Lieferantenverwaltung in einer Webanwendung zusammenführt. Das Projekt ist also vor allem ein praktischer Versuch, einmal selbst nachzubauen, wie solche Systeme ungefähr aussehen und funktionieren könnten.

---

## Features

- **Preisvergleich** — Aktuelle Angebote von Alternate, Cyberport und Notebooksbilliger im direkten Vergleich, mit Verfügbarkeitsstatus und Preisverlauf
- **Budgetverwaltung** — Ausgaben erfassen, nach Kategorie und Quartal auswerten, Budget-Auslastung auf einen Blick
- **Lieferantenverwaltung** — Lieferanten bewerten, Zuverlässigkeit tracken, Bestellhistorie einsehen
- **Dashboard** — Überblick über KPIs, Ausgabenentwicklung und offene Aufgaben

---

## Tech-Stack

### Frontend
| Technologie | Verwendung |
|---|---|
| React 18 + TypeScript | Komponentenbasierte UI |
| Vite | Build-Tool & Dev-Server |
| Tailwind CSS v4 | Styling |
| React Router v6 | Client-Side-Routing |
| Recharts / Chart.js | Datenvisualisierung |
| Axios | HTTP-Client |
| Lucide React | Icons |

### Backend
| Technologie | Verwendung |
|---|---|
| Node.js + Express | REST API |
| TypeScript | Typsicherheit |
| Prisma ORM | Datenbankzugriff |
| Zod | Validierung |
| Puppeteer | Web-Scraping (Preisdaten) |

### Infrastruktur
| Dienst | Verwendung |
|---|---|
| Supabase (PostgreSQL) | Datenbank |
| Vercel | Frontend-Hosting |
| Render | Backend-Hosting |

---

## Projektstruktur

```
ProcureDock/
├── frontend/               # React-App
│   ├── src/
│   │   ├── components/     # Wiederverwendbare UI-Komponenten
│   │   │   ├── layout/     # Header, Sidebar, Layout
│   │   │   ├── dashboard/  # MetricCard etc.
│   │   │   ├── prices/     # Preisvergleich-Komponenten
│   │   │   ├── budget/     # Budget-Formulare und Charts
│   │   │   ├── vendors/    # Lieferantenkarten und Modal
│   │   │   └── ui/         # Gemeinsame Primitiven (StatCard, SurfaceCard etc.)
│   │   ├── pages/          # Seitenkomponenten (Dashboard, Preisvergleich, Budget, Vendors)
│   │   ├── services/       # Axios API-Client
│   │   └── types/          # TypeScript-Typdefinitionen
│   └── index.html
│
└── backend/                # Express-API
    ├── src/
    │   ├── controllers/    # Request-Handler (Budget, Preise, Vendors)
    │   ├── routes/         # Express-Router
    │   ├── schemas/        # Zod-Validierungsschemas
    │   ├── scrapers/       # Puppeteer-Scraper (Geizhals)
    │   └── lib/            # Prisma-Client
    └── prisma/
        ├── schema.prisma   # Datenbankschema
        └── seed.ts         # Testdaten
```

---

## Datenbankschema

```
Product        Vendor
   │              │
   └──── Price ───┘
   │
   └──── BudgetEntry ── Vendor
```

- **Product** — Produktkatalog (Dell Latitude, HP ProDesk, Philips Monitor etc.)
- **Vendor** — Lieferanten mit Bewertung und Lieferzeit
- **Price** — Preiseinträge pro Produkt und Lieferant mit Zeitstempel
- **BudgetEntry** — Beschaffungsvorgänge mit Status, Kategorie und Quartalszuordnung

---

## Lokale Entwicklung

### Voraussetzungen
- Node.js 20+
- PostgreSQL-Datenbank (oder Supabase-Account)

### Setup

```bash
# Repository klonen
git clone https://github.com/YounessBerkia/ProcureDock.git
cd ProcureDock
```

**Backend starten:**
```bash
cd backend
cp .env.example .env
# .env mit eigenen Datenbankdaten befüllen

npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed    # Testdaten einspielen
npm run dev           # http://localhost:3000
```

**Frontend starten:**
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api

npm install
npm run dev           # http://localhost:5173
```

---

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| GET | `/api/prices` | Alle Preiseinträge mit Produkt- und Lieferantendaten |
| GET | `/api/prices/:id` | Einzelner Preiseintrag |
| PUT | `/api/prices/:id` | Preis aktualisieren |
| GET | `/api/products` | Produktkatalog |
| GET | `/api/vendors` | Alle Lieferanten |
| GET | `/api/budget` | Alle Budgeteinträge |
| GET | `/api/budget/stats` | Aggregierte Budgetstatistiken |
| POST | `/api/budget` | Neuen Budgeteintrag anlegen |
| PUT | `/api/budget/:id` | Budgeteintrag bearbeiten |
| DELETE | `/api/budget/:id` | Budgeteintrag löschen |
| POST | `/api/prices/scrape` | Preis via Puppeteer scrapen |

---

## Umgebungsvariablen

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/postgres
NODE_ENV=development
PORT=3000
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Deployment

Das Projekt ist auf drei kostenlosen Diensten deployed:

1. **Datenbank** → Supabase (PostgreSQL)
2. **Backend** → Render (Node.js Web Service, Root: `backend`)
   - Build: `npm install --include=dev && npx prisma generate && npm run build`
   - Start: `node dist/index.js`
3. **Frontend** → Vercel (Vite Preset, Root: `frontend`)
   - Umgebungsvariable: `VITE_API_URL` auf Render-URL setzen

---

## Autor

**Youness Berkia**
Portfolioprojekt · IHK Wiesbaden · IT-System-Management · 2026

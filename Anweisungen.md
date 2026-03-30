# 🚢 ProcureDock – Anweisungen für Claude Code

## 📋 Projektkontext

**Was ist ProcureDock?**
Ein webbasiertes IT-Beschaffungs-Dashboard für IT-Kaufleute und Einkaufsabteilungen. Kombiniert automatisierten Preisvergleich, Budget-Tracking, Lieferantenmanagement und Compliance-Dokumentation.

**Warum bauen wir das?**
- Portfolio-Projekt für IHK-Bewerbung (IT-System-Management)
- Demonstration von Full-Stack-Entwicklung & IT-Procurement-Kenntnissen
- Realer Business-Value: Kostentransparenz, Zeitersparnis, datengetriebene Entscheidungen

**Zielgruppe:**
- IT-Einkaufsverantwortliche
- Öffentliche Verwaltung / IHK
- Budgetverantwortliche

**Zeitrahmen:** 10-14 Tage für funktionsfähigen MVP

---

## 🛠️ Tech-Stack (bereits installiert)

### Frontend
- **React 18** + **TypeScript** (via Vite)
- **Tailwind CSS** - Utility-First-Styling
- **Chart.js** (+ react-chartjs-2) - Datenvisualisierung
- **Zustand** - State-Management (leichtgewichtig, kein Boilerplate)
- **React Router v6** - Client-Side-Routing
- **Axios** - HTTP-Client für API-Calls
- **Lucide React** - Icon-Bibliothek
- **date-fns** - Datum-Utilities

### Backend
- **Node.js 20** + **Express**
- **TypeScript**
- **Prisma ORM** + **PostgreSQL** (via Supabase)
- **Puppeteer** - Web-Scraping für Preisvergleiche
- **Zod** (geplant) - Runtime-Validierung

### Datenbank (Supabase)
- PostgreSQL 15
- Kostenlos: 500MB Storage
- Automatische Backups

---

## 🗄️ Datenbank-Schema (Prisma)

### **Product** (Produktkatalog)
```prisma
id          String   (cuid)
name        String   // "Dell Latitude 5540"
category    String   // "laptop", "monitor", "server", etc.
description String?
imageUrl    String?
brand       String?  // "Dell"
model       String?  // "Latitude 5540"
```

### **Price** (Preisverlauf)
```prisma
id        String
productId String   (FK → Product)
vendorId  String   (FK → Vendor)
price     Float    // 1299.00
url       String   // Shop-Link
inStock   Boolean
scrapedAt DateTime // Zeitstempel
```

### **Vendor** (Lieferanten)
```prisma
id              String
name            String   // "Geizhals", "Alternate"
website         String
rating          Float    // 0-5 Sterne
reliability     Float    // 0-100 Score
avgDeliveryDays Int?
```

### **BudgetEntry** (Ausgaben)
```prisma
id           String
productId    String?  (FK → Product)
vendorId     String?  (FK → Vendor)
category     String   // "hardware", "software", "services"
amount       Float
quantity     Int
description  String
purchaseDate DateTime
quarter      String   // "Q1-2026"
year         Int
status       String   // "planned", "approved", "ordered", "delivered"
```

### **Relationen**
- Product 1:n Price (ein Produkt hat viele Preise)
- Vendor 1:n Price (ein Vendor hat viele Preise)
- Product 1:n BudgetEntry
- Vendor 1:n BudgetEntry

---

## 🎯 User Stories (aus Projektdokumentation)

### Epic 1: Preisvergleich
- **US-1.1:** Als Einkäufer möchte ich Hardware-Preise mehrerer Shops vergleichen, um den günstigsten Anbieter zu finden.
- **US-1.2:** Als Einkäufer möchte ich den Preisverlauf sehen, um den optimalen Kaufzeitpunkt zu erkennen.
- **US-1.3:** Als Einkäufer möchte ich Preisbenachrichtigungen setzen, um bei Preissenkungen informiert zu werden.

### Epic 2: Budget-Management
- **US-2.1:** Als Budgetverantwortlicher möchte ich Ausgaben visualisieren (geplant vs. tatsächlich), um Budgeteinhaltung zu überwachen.
- **US-2.2:** Als Budgetverantwortlicher möchte ich nach Kategorien filtern, um Ausgabemuster zu erkennen.
- **US-2.3:** Als Budgetverantwortlicher möchte ich Forecasts erstellen, um zukünftige Ausgaben zu planen.

### Epic 3: Vendor-Management
- **US-3.1:** Als Einkaufsverantwortlicher möchte ich Lieferanten bewerten, um Qualität zu steuern.
- **US-3.2:** Als Einkaufsverantwortlicher möchte ich Lieferzeiten tracken, um Verzögerungen zu vermeiden.
- **US-3.3:** Als Einkaufsverantwortlicher möchte ich Bestellhistorien einsehen, um Dokumentation sicherzustellen.

### Epic 4: Dokumentation
- **US-4.1:** Als Einkaufsverantwortlicher möchte ich PDF-Reports exportieren, um Beschaffungsentscheidungen zu dokumentieren.
- **US-4.2:** Als Einkaufsverantwortlicher möchte ich CSV-Daten exportieren, um externe Analysen durchzuführen.

---

## 📦 PACKET-STRUKTUR (Arbeitsweise für Claude Code)

**WICHTIG:** Arbeite IMMER NUR AN EINEM PACKET. Erst wenn ein Packet vollständig fertig ist (alle Acceptance Criteria erfüllt), gehst du zum nächsten!

### **PACKET 1: Basis-Setup & Routing** 🏗️
**Priorität:** KRITISCH (Foundation)  
**Abhängigkeiten:** Keine  
**Geschätzte Dauer:** 2h

**Ziel:** React Router + Navigation + Layout-Grundgerüst

**Tasks:**
1. **Tailwind CSS konfigurieren**
   - `tailwind.config.js` anpassen: content paths hinzufügen
   - `src/index.css` mit Tailwind-Directives (@tailwind base/components/utilities)
   
2. **React Router Setup**
   - `src/App.tsx`: BrowserRouter + Routes definieren
   - Routes: `/`, `/preisvergleich`, `/budget`, `/vendors`
   
3. **Layout-Komponenten erstellen**
   - `src/components/layout/Header.tsx` - Logo + User-Menu (Platzhalter)
   - `src/components/layout/Sidebar.tsx` - Navigation-Links
   - `src/components/layout/Layout.tsx` - Wrapper (Header + Sidebar + Content)
   
4. **Basis-Pages erstellen**
   - `src/pages/Dashboard.tsx` - Platzhalter mit "Dashboard" Heading
   - `src/pages/PriceComparison.tsx` - Platzhalter
   - `src/pages/BudgetTracker.tsx` - Platzhalter
   - `src/pages/VendorManagement.tsx` - Platzhalter

**Acceptance Criteria:**
- ✅ Navigation funktioniert (alle 4 Seiten erreichbar)
- ✅ Layout ist responsiv (Mobile: Sidebar collapsible)
- ✅ Aktiver Link ist visuell hervorgehoben
- ✅ Tailwind-Utilities funktionieren

**Code-Style:**
- Tailwind-Klassen verwenden, KEIN eigenes CSS
- Komponenten in TypeScript mit Props-Interfaces
- Funktionskomponenten mit Arrow-Function-Syntax

---

### **PACKET 2: API-Client & Error Handling** 🔌
**Priorität:** HOCH (Infrastructure)  
**Abhängigkeiten:** Keine  
**Geschätzte Dauer:** 1h

**Ziel:** Axios-Setup + Error-Boundaries + Loading-States

**Tasks:**
1. **Axios-Client erstellen**
   - `src/services/api.ts`:
     - Axios-Instance mit baseURL (`import.meta.env.VITE_API_URL`)
     - Interceptors für Error-Handling
     - Type-Safe-Response-Wrapper
   
2. **Error-Boundary-Komponente**
   - `src/components/ErrorBoundary.tsx`
   - Catch React-Errors, zeige Fallback-UI
   
3. **Loading-Komponente**
   - `src/components/ui/LoadingSpinner.tsx`
   - Tailwind-basierter Spinner

**Acceptance Criteria:**
- ✅ API-Client ist konfiguriert
- ✅ Error-Boundary fängt React-Fehler ab
- ✅ LoadingSpinner ist wiederverwendbar

**Code-Style:**
- Axios-Instanz als Singleton exportieren
- TypeScript-Generics für API-Responses

---

### **PACKET 3: Dashboard-Skeleton** 📊
**Priorität:** HOCH  
**Abhängigkeiten:** Packet 1  
**Geschätzte Dauer:** 2h

**Ziel:** Dashboard-Page mit Metric-Cards + Grid-Layout

**Tasks:**
1. **MetricCard-Komponente**
   - `src/components/dashboard/MetricCard.tsx`
   - Props: title, value, icon, trend (optional)
   - Tailwind: Card mit shadow, rounded corners
   
2. **Dashboard-Layout**
   - `src/pages/Dashboard.tsx` überarbeiten
   - Grid mit 3 Metric-Cards:
     1. "Total Budget" (Platzhalter: €50.000)
     2. "Active Vendors" (Platzhalter: 3)
     3. "Recent Orders" (Platzhalter: 12)
   
3. **Recent-Orders-Tabelle (Mock-Data)**
   - Simple Tabelle mit 5 Mock-Einträgen
   - Spalten: Produkt, Vendor, Betrag, Datum

**Acceptance Criteria:**
- ✅ Dashboard zeigt 3 Metric-Cards
- ✅ Grid ist responsiv (1 Col mobile, 3 Cols desktop)
- ✅ Tabelle ist scrollbar
- ✅ Mock-Daten sind sichtbar

---

### **PACKET 4: Prices API (Backend)** 🔧
**Priorität:** HOCH  
**Abhängigkeiten:** Keine (Backend unabhängig)  
**Geschätzte Dauer:** 2h

**Ziel:** CRUD-Endpoints für Price-Daten

**Tasks:**
1. **Router erstellen**
   - `backend/src/routes/prices.ts`
   - GET /api/prices (alle Preise, optional: ?productId=xxx)
   - GET /api/prices/:id (einzelner Preis)
   - POST /api/prices (neuer Preis - für Scraping)
   
2. **Controller erstellen**
   - `backend/src/controllers/pricesController.ts`
   - Prisma-Queries implementieren
   - Error-Handling (try-catch)
   
3. **Router in Express einbinden**
   - `backend/src/index.ts`: `app.use('/api/prices', pricesRouter)`

**Acceptance Criteria:**
- ✅ GET /api/prices gibt alle Preise zurück (mit Product & Vendor populated)
- ✅ GET /api/prices?productId=xxx filtert korrekt
- ✅ Endpoints sind mit Postman/Thunder Client testbar
- ✅ Fehler werden als JSON zurückgegeben

**Code-Style:**
- Async/Await für Prisma-Queries
- Status-Codes: 200 (OK), 201 (Created), 404 (Not Found), 500 (Error)
- Prisma Include für Relations

**Test-Daten:** Die Seed-Daten enthalten bereits 8 Preise!

---

### **PACKET 5: Price Comparison UI (Frontend)** 💰
**Priorität:** HOCH  
**Abhängigkeiten:** Packet 1, 2, 4  
**Geschätzte Dauer:** 3h

**Ziel:** Preisvergleichs-Tabelle + Preisverlauf-Chart

**Tasks:**
1. **PriceComparisonTable-Komponente**
   - `src/components/prices/PriceComparisonTable.tsx`
   - Fetch Prices via API-Client
   - Tabelle: Produkt | Vendor | Preis | Link | Datum
   - Sortierbar (nach Preis, Datum)
   
2. **PriceHistoryChart-Komponente**
   - `src/components/prices/PriceHistoryChart.tsx`
   - Chart.js Line-Chart
   - X-Achse: Datum, Y-Achse: Preis
   - Filter: Product-Select-Dropdown
   
3. **PriceComparison-Page überarbeiten**
   - Layout: Tabelle oben, Chart unten
   - Loading-State während Fetch
   - Error-Handling (zeige Error-Message)

**Acceptance Criteria:**
- ✅ Tabelle zeigt Live-Daten vom Backend
- ✅ Chart zeigt Preisverlauf eines Produkts
- ✅ Product-Select funktioniert
- ✅ Loading-Spinner während Fetch
- ✅ Responsiv (Tabelle scrollt horizontal auf Mobile)

**Code-Style:**
- React Hooks: useState, useEffect
- Chart.js responsive: `maintainAspectRatio: false`

---

### **PACKET 6: Budget API (Backend)** 💵
**Priorität:** MITTEL  
**Abhängigkeiten:** Packet 4 (Struktur ähnlich)  
**Geschätzte Dauer:** 2h

**Ziel:** CRUD + Statistics für Budget-Daten

**Tasks:**
1. **Router erstellen**
   - `backend/src/routes/budget.ts`
   - GET /api/budget (alle Einträge)
   - GET /api/budget/stats (Aggregierte Daten)
   - POST /api/budget (neuer Eintrag)
   - PUT /api/budget/:id (Update)
   - DELETE /api/budget/:id (Löschen)
   
2. **Controller mit Aggregation**
   - `backend/src/controllers/budgetController.ts`
   - /stats: Berechne Total, Breakdown by Category, Breakdown by Quarter
   
3. **Validierung (Zod)**
   - `backend/src/schemas/budgetSchema.ts`
   - Validiere POST/PUT-Body
   - Required Fields: category, amount, description, purchaseDate

**Acceptance Criteria:**
- ✅ CRUD funktioniert vollständig
- ✅ /stats gibt korrektes JSON zurück
- ✅ Validierung wirft 400 bei fehlenden Feldern
- ✅ Testbar mit Postman

**Stats-Response-Beispiel:**
```json
{
  "totalBudget": 50000,
  "totalSpent": 18850,
  "byCategory": {
    "hardware": 15440,
    "software": 5000,
    "services": 0
  },
  "byQuarter": {
    "Q1-2026": 18850,
    "Q2-2026": 0
  }
}
```

---

### **PACKET 7: Budget Tracker UI (Frontend)** 📈
**Priorität:** MITTEL  
**Abhängigkeiten:** Packet 1, 2, 6  
**Geschätzte Dauer:** 3h

**Ziel:** Budget-Form + Pie/Bar-Charts + Tabelle

**Tasks:**
1. **BudgetForm-Komponente**
   - `src/components/budget/BudgetForm.tsx`
   - Felder: Product (Select), Vendor (Select), Category, Amount, Quantity, Date
   - Submit → POST /api/budget
   
2. **BudgetCharts-Komponenten**
   - `src/components/budget/BudgetPieChart.tsx` (Category Breakdown)
   - `src/components/budget/BudgetBarChart.tsx` (Quarterly Spending)
   
3. **BudgetTable-Komponente**
   - `src/components/budget/BudgetTable.tsx`
   - Alle Entries mit Edit/Delete-Buttons
   
4. **BudgetTracker-Page überarbeiten**
   - Layout: Form links, Charts rechts (Desktop)
   - Tabelle unten
   - Fetch /api/budget + /api/budget/stats

**Acceptance Criteria:**
- ✅ Form erstellt neue Einträge
- ✅ Pie-Chart zeigt Category-Breakdown
- ✅ Bar-Chart zeigt Quarterly-Trend
- ✅ Tabelle ist editierbar
- ✅ Delete funktioniert mit Confirmation-Dialog

---

### **PACKET 8: Vendor Management (Full-Stack)** ⭐
**Priorität:** MITTEL  
**Abhängigkeiten:** Packet 1, 2  
**Geschätzte Dauer:** 3h

**Ziel:** Backend + Frontend für Vendor-Daten

**Tasks (Backend):**
1. **Router**
   - `backend/src/routes/vendors.ts`
   - GET /api/vendors (alle)
   - GET /api/vendors/:id (einzeln mit Orders)
   - POST /api/vendors/:id/rate (Rating updaten)
   
2. **Controller**
   - Include BudgetEntries in GET /:id

**Tasks (Frontend):**
3. **VendorCard-Komponente**
   - `src/components/vendors/VendorCard.tsx`
   - Zeigt: Logo, Name, Rating (Sterne), Lieferzeit
   
4. **VendorList-Page**
   - Grid mit VendorCards
   - Click → Vendor-Detail-Modal
   
5. **VendorDetailModal**
   - Rating-System (1-5 Sterne)
   - Bestellhistorie (aus BudgetEntries)

**Acceptance Criteria:**
- ✅ Vendor-Grid ist responsiv
- ✅ Rating kann geändert werden
- ✅ Bestellhistorie wird angezeigt
- ✅ Modal ist schließbar

---

### **PACKET 9: Web Scraping (Puppeteer)** 🕷️
**Priorität:** NIEDRIG (Advanced)  
**Abhängigkeiten:** Packet 4  
**Geschätzte Dauer:** 4h

**Ziel:** Automatisches Scraping von Geizhals

**Tasks:**
1. **Scraper-Modul**
   - `backend/src/scrapers/geizhals.ts`
   - Puppeteer: Suche nach Produktname
   - Extrahiere: Preis, URL, Verfügbarkeit
   
2. **Scraping-Endpoint**
   - POST /api/prices/scrape
   - Body: `{ productName: string, vendorName: string }`
   - Startet Scraper, speichert Ergebnis in DB
   
3. **Rate-Limiting**
   - Max. 1 Scrape pro 2 Sekunden
   - Queue-System (optional)

**Acceptance Criteria:**
- ✅ Scraper findet Preise auf Geizhals
- ✅ Daten werden in DB gespeichert
- ✅ Fehler werden geloggt
- ✅ Respektiert robots.txt

**Sicherheit:**
- User-Agent setzen
- Stealth-Plugin verwenden (puppeteer-extra)

---

### **PACKET 10: Export & Polish** 📄
**Priorität:** NIEDRIG  
**Abhängigkeiten:** Alle anderen  
**Geschätzte Dauer:** 3h

**Ziel:** PDF/CSV-Export + UI-Verbesserungen

**Tasks:**
1. **CSV-Export**
   - GET /api/budget/export → CSV-Download
   - Library: `json2csv`
   
2. **PDF-Report**
   - GET /api/export/pdf → PDF mit Preisvergleich
   - Library: `pdfkit`
   
3. **UI-Polish**
   - Transitions auf Buttons (hover-Effekte)
   - Toast-Notifications (Success/Error)
   - Loading-Skeletons

**Acceptance Criteria:**
- ✅ CSV-Download funktioniert
- ✅ PDF ist lesbar
- ✅ UI fühlt sich polished an

---

## 🎨 Design-System

### **Farben** (Tailwind-Klassen)
- **Primary:** `bg-blue-600` (#2563eb) - Buttons, Links
- **Success:** `bg-green-500` (#10b981) - Positive Statusanzeigen
- **Danger:** `bg-red-500` (#ef4444) - Fehler, Warnungen
- **Neutral:** `text-gray-600` (#64748b) - Text

### **Typography**
- **Headings:** `font-semibold` (600 weight)
- **Body:** `font-normal` (400 weight)
- **Font-Family:** System-Font-Stack (default)

### **Spacing**
- **Cards:** `p-6` (1.5rem)
- **Grid-Gap:** `gap-6`
- **Sections:** `mb-8` (2rem)

### **Responsive-Breakpoints** (Tailwind)
- Mobile: default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

---

## ✅ Qualitätskriterien (für jedes Packet)

1. **TypeScript:** Keine `any`-Types, alle Props typisiert
2. **Error-Handling:** Try-Catch in Backend, Error-States in Frontend
3. **Loading-States:** Spinner/Skeleton während Fetch
4. **Responsive:** Funktioniert auf Mobile/Tablet/Desktop
5. **Accessibility:** Semantic HTML, Alt-Texte für Icons
6. **Performance:** Lazy-Loading für Charts (React.lazy)
7. **Code-Style:** ESLint-konform, konsistente Formatierung

---

## 🧪 Testing-Approach

**Backend:**
- Manuell mit Postman/Thunder Client
- Endpoints nacheinander testen
- Happy Path + Error Cases

**Frontend:**
- Manuell im Browser
- Chrome DevTools: Console, Network-Tab
- Responsive-Modus testen

**Integration:**
- Backend + Frontend zusammen testen
- Full-User-Journey: Dashboard → Preisvergleich → Budget-Eintrag

---

## 🚀 Deployment (erst nach Packet 10)

**Frontend → Vercel:**
```bash
cd frontend
vercel
```

**Backend → Railway:**
1. GitHub Repo verbinden
2. Environment-Variablen in Railway setzen
3. Auto-Deploy bei Git-Push

---

## 📝 Commit-Nachrichten

**Format:** `<type>(<scope>): <message>`

**Types:**
- `feat`: Neues Feature
- `fix`: Bugfix
- `refactor`: Code-Verbesserung
- `style`: Formatting
- `docs`: Dokumentation

**Beispiele:**
- `feat(dashboard): add metric cards`
- `feat(api): implement prices CRUD endpoints`
- `fix(budget): resolve chart rendering bug`

---

## 🔥 Wichtige Hinweise für Claude Code

1. **IMMER NUR EIN PACKET!** Nicht mehrere Packets parallel!
2. **Test nach jedem Task!** Starte Server, prüfe im Browser
3. **Commit nach jedem Task!** Kleine, atomare Commits
4. **Bei Fehlern:** Debugging-Output in Console, dann Fragen stellen
5. **Prisma-Changes:** Nach Schema-Änderungen `npx prisma migrate dev` ausführen
6. **TypeScript-Errors:** Mit `npx tsc --noEmit` prüfen

---

## 🆘 Hilfe & Ressourcen

**Dokumentation:**
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Prisma: https://prisma.io/docs
- Chart.js: https://chartjs.org

**Bei Problemen:**
1. Console/Terminal-Output lesen
2. Error-Message googeln
3. Fragen im Chat stellen

---

## ✅ Ready to Code!

**Start mit:** PACKET 1 - Basis-Setup & Routing

**Nächster Befehl:**
```bash
cd frontend/src
# Erstelle: components/layout/Header.tsx
```

Viel Erfolg! 🚀

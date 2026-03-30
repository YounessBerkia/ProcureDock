# 🔧 KOMPLETTE SETUP-COMMAND-SEQUENZ
# Führe diese Commands EXAKT in dieser Reihenfolge aus!

## ⚠️ WICHTIG: Voraussetzungen prüfen
# - Node.js Version: node --version (muss >= 20.0.0 sein)
# - npm Version: npm --version (muss >= 9.0.0 sein)
# - Git installiert: git --version

## 📍 Startpunkt: Im ProcureDock-Ordner sein
cd ~/path/to/ProcureDock  # <-- Anpassen!

# ================================================================
# PHASE 1: FRONTEND INITIALISIEREN
# ================================================================

# Schritt 1: Vite-Projekt erstellen (React + TypeScript)
npm create vite@latest frontend -- --template react-ts
# ⏱️ Dauert: ~10 Sekunden
# ✅ Erstellt: frontend/ Ordner mit package.json

# Schritt 2: In Frontend wechseln
cd frontend

# Schritt 3: Basis-Dependencies installieren
npm install
# ⏱️ Dauert: ~30-60 Sekunden
# ✅ Installiert: React, Vite, TypeScript

# Schritt 4: UI & State-Management Libraries installieren
npm install react-router-dom axios zustand chart.js react-chartjs-2 lucide-react date-fns
# ⏱️ Dauert: ~20 Sekunden
# ✅ Installiert:
#    - react-router-dom: Routing
#    - axios: HTTP-Client
#    - zustand: State-Management
#    - chart.js + react-chartjs-2: Diagramme
#    - lucide-react: Icons
#    - date-fns: Datum-Utilities

# Schritt 5: Tailwind CSS installieren
npm install -D tailwindcss postcss autoprefixer
# ⏱️ Dauert: ~10 Sekunden

# Schritt 6: Tailwind initialisieren
npx tailwindcss init -p
# ⏱️ Dauert: ~2 Sekunden
# ✅ Erstellt: tailwind.config.js, postcss.config.js

# Schritt 7: Zurück zum Root
cd ..

# ================================================================
# PHASE 2: BACKEND INITIALISIEREN
# ================================================================

# Schritt 8: In Backend wechseln
cd backend

# Schritt 9: Backend-Dependencies installieren
npm install
# ⏱️ Dauert: ~40-60 Sekunden
# ✅ Installiert: Express, Prisma, Puppeteer, TypeScript, etc.

# Schritt 10: Environment-File kopieren
cp .env.example .env
# ✅ Erstellt: .env (muss noch editiert werden!)

# ================================================================
# PHASE 3: DATENBANK AUFSETZEN (SUPABASE)
# ================================================================

# Schritt 11: Supabase-Projekt erstellen (im Browser!)
# 1. Gehe zu: https://supabase.com
# 2. Account erstellen / Einloggen
# 3. "New Project" → Name: "procuredock"
# 4. Region: Frankfurt (eu-central-1)
# 5. Warte 2-3 Minuten bis Projekt bereit ist
# 6. Gehe zu: Settings → Database
# 7. Kopiere "Connection String" (URI Format)
# 8. Öffne backend/.env und füge ein:
#    DATABASE_URL="postgresql://postgres.xxx:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Schritt 12: Prisma Client generieren
npx prisma generate
# ⏱️ Dauert: ~5 Sekunden
# ✅ Generiert: node_modules/.prisma/client/

# Schritt 13: Datenbank-Migration erstellen
npx prisma migrate dev --name init
# ⏱️ Dauert: ~10 Sekunden
# ✅ Erstellt: Alle Tabellen in Supabase
# ✅ Erstellt: prisma/migrations/ Ordner

# Schritt 14: Demo-Daten einfügen
npm run prisma:seed
# ⏱️ Dauert: ~3 Sekunden
# ✅ Erstellt: 3 Vendors, 3 Products, 8 Prices, 3 BudgetEntries

# Schritt 15: Zurück zum Root
cd ..

# ================================================================
# PHASE 4: ENVIRONMENT-FILES FINALISIEREN
# ================================================================

# Schritt 16: Frontend .env erstellen
cd frontend
cp .env.example .env
# Editiere frontend/.env:
# VITE_API_URL=http://localhost:3000
cd ..

# ================================================================
# PHASE 5: VERIFIZIERUNG
# ================================================================

# Schritt 17: Prisma Studio öffnen (optional - zum Daten checken)
cd backend
npx prisma studio
# ⏱️ Öffnet: http://localhost:5555
# ✅ Du siehst: Alle Tabellen mit Demo-Daten
# Schließen mit: STRG+C

# Schritt 18: Backend-Test-Start
npm run dev
# ⏱️ Läuft auf: http://localhost:3000
# ✅ Testen: Öffne http://localhost:3000/health im Browser
# Erwartung: {"status":"ok","timestamp":"...","environment":"development"}
# Stoppen mit: STRG+C
cd ..

# Schritt 19: Frontend-Test-Start (in neuem Terminal!)
cd frontend
npm run dev
# ⏱️ Läuft auf: http://localhost:5173
# ✅ Testen: Öffne http://localhost:5173 im Browser
# Erwartung: Vite + React Default-Page
# Stoppen mit: STRG+C
cd ..

# ================================================================
# PHASE 6: GIT SETUP
# ================================================================

# Schritt 20: Git initialisieren (falls noch nicht geschehen)
git init

# Schritt 21: .gitignore kopieren (aus den Setup-Files)
# Stelle sicher, dass .gitignore im Root liegt!

# Schritt 22: Initial Commit
git add .
git commit -m "chore: initial project setup with backend and frontend"

# Schritt 23: Remote hinzufügen (GitHub Repo URL anpassen!)
git remote add origin https://github.com/youness/procuredock.git

# Schritt 24: Ersten Push
git branch -M main
git push -u origin main

# ================================================================
# ✅ SETUP KOMPLETT!
# ================================================================

# Nächster Schritt: Claude Code starten
# Im ProcureDock-Root-Ordner:
code .
# oder
claude-code .

# ================================================================
# 🐛 TROUBLESHOOTING
# ================================================================

# Problem: "npm install" schlägt fehl
# Lösung: Node.js Version prüfen (muss >= 20)
node --version
# Falls zu alt: https://nodejs.org/en/download/

# Problem: "Prisma Client not found"
# Lösung: 
cd backend
npx prisma generate
cd ..

# Problem: "Database connection error"
# Lösung: DATABASE_URL in backend/.env prüfen
cat backend/.env | grep DATABASE_URL

# Problem: "Port 3000 already in use"
# Lösung 1: Anderen Port in backend/.env setzen
echo "PORT=3001" >> backend/.env
# Lösung 2: Prozess killen
lsof -ti:3000 | xargs kill -9

# Problem: "Migration failed"
# Lösung: Datenbank resetten
cd backend
npx prisma migrate reset --force
npx prisma migrate dev --name init
npm run prisma:seed
cd ..

# ================================================================
# 📊 VERIFIKATIONS-CHECKLISTE
# ================================================================

# [ ] Node.js >= 20 installiert
# [ ] frontend/node_modules/ existiert
# [ ] backend/node_modules/ existiert
# [ ] backend/.env enthält DATABASE_URL
# [ ] backend/prisma/migrations/ Ordner existiert
# [ ] Backend startet ohne Fehler (Port 3000)
# [ ] Frontend startet ohne Fehler (Port 5173)
# [ ] http://localhost:3000/health gibt Status zurück
# [ ] Prisma Studio zeigt Tabellen mit Daten
# [ ] Git Repo hat Initial Commit

# ================================================================
# 🚀 BEREIT FÜR ENTWICKLUNG!
# ================================================================

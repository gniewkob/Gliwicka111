# Gliwicka 111 — aplikacja WWW (Next.js, Passenger, mydevil.net)

Profesjonalna strona centrum biznesowego Gliwicka 111. Aplikacja oparta o Next.js (App Router) + TypeScript + Tailwind CSS, z rozbudowanymi formularzami, walidacją po stronie serwera, monitoringiem i gotowym pipeline CI/CD do hostingu na mydevil.net (FreeBSD, Passenger).

Live: https://gliwicka111.pl

---

## Spis treści
- Architektura i technologie
- Struktura repozytorium
- Uruchomienie lokalne (dev)
- Zmienne środowiskowe
- Testy i jakość
- Bezpieczeństwo i nagłówki CSP
- CI/CD (GitHub Actions)
- Wdrożenie na mydevil.net (Passenger)
- Rozwiązywanie problemów
- Licencja

---

## Architektura i technologie
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS + shadcn-ui (Radix UI), ikonografia lucide-react
- Formularze: React Hook Form + Zod (walidacja)
- API: trasy serverless w `app/api/*` (np. `/api/forms/*`, `/api/analytics/*`, `/api/health`)
- E-mail: Nodemailer + mechanizm retry i store nieudanych wiadomości
- Baza danych: PostgreSQL (połączenie puli w `lib/database/connection-pool.ts`)
- Monitoring: health-checki + dashboard admina (HTTP Basic lub bearer token)
- Analytics: prosty klient + endpointy kolekcji metryk
- Hosting: mydevil.net (FreeBSD) z Passengerem, start standalone Next.js

## Struktura repozytorium
Poniżej skrócona mapa katalogów (kluczowe elementy):

- `app/` — routing aplikacji (App Router)
  - `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, ...
  - `app/api/` — endpointy serwerowe: health, analytics, forms, admin/metrics
- `components/forms/` — komponenty formularzy (coworking, virtual-office, meeting-room, advertising, special-deals)
- `lib/` — logika wspólna: walidacja, email, monitoring, security, admin metrics
- `scripts/` — skrypty pomocnicze (np. migracje, retry failed emails)
- `e2e/`, `tests/` — Playwright i Vitest (unit/integration)
- `middleware.ts` — nagłówki bezpieczeństwa (w tym CSP)
- `next.config.mjs` — konfiguracja Next.js (output: 'standalone')
- `.github/workflows/ci.yml` — lint + testy + build na push/PR
- `.github/workflows/deploy.yml` — build w CI i wdrożenie na mydevil.net (Passenger)

## Uruchomienie lokalne (dev)
1) Zainstaluj zależności
```
npm ci
```
2) Skonfiguruj środowisko
- Skopiuj plik `.env.example` do `.env` lub `.env.local` i uzupełnij wartości
- Dla developmentu port domyślny to 3000 (fallback 3001 gdy port zajęty)

3) Start dev server
```
npm run dev
```
4) Budowa (lokalnie nie jest wymagana, budujemy w CI)
```
npm run build
```

## Zmienne środowiskowe
Wzór: `.env.example` (nie zawiera sekretów). Kluczowe grupy:
- Serwer: `HOSTNAME`, `PORT`
- Baza: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`, `MOCK_DB`
- E-mail: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`, `MOCK_EMAIL`, `EMAIL_MAX_RETRIES`
- Bezpieczeństwo i limity: `IP_SALT`, `RATE_LIMIT_COUNT`, `RATE_LIMIT_WINDOW_MS`
- Admin i Analytics: `ADMIN_AUTH_TOKEN` lub `ADMIN_USER`/`ADMIN_PASS`, `NEXT_PUBLIC_ANALYTICS_TOKEN`, `ANALYTICS_AUTH_TOKEN`, `ANALYTICS_BASIC_USER`, `ANALYTICS_BASIC_PASS`, `METRICS_WINDOW_HOURS`
- Testy/E2E: `NEXT_PUBLIC_E2E`

Uwaga: nie commitujemy realnych `.env`; sekretami zarządza CI/CD.

## Testy i jakość
- Lint: `npm run lint`
- Unit/Integration (Vitest): `npm test`, `npm run test:integration`
- E2E (Playwright): `npm run test:e2e` (w CI: instalacja przeglądarek `npx playwright install --with-deps`)
- Formatowanie: `npm run format` / `npm run format:check`
- Type-check: `npm run type-check`

W trybie E2E (NEXT_PUBLIC_E2E=true) aplikacja luzuje pewne ograniczenia deweloperskie i zapewnia deterministykę UI.

## Bezpieczeństwo i nagłówki CSP
Nagłówki nadawane są globalnie w `middleware.ts`:
- Content-Security-Policy (CSP) z osobnymi profilami dla dev/E2E i produkcji
- Zezwolenie na domeny analityczne: `https://stats0.mydevil.net`
- Zezwolenie na Google Maps (iframe + zasoby): `https://www.google.com`, `https://maps.googleapis.com`, `https://maps.gstatic.com`
- Dodatkowe: HSTS, X-Frame-Options=DENY, X-Content-Type-Options=nosniff

## CI/CD (GitHub Actions)
Dwa workflowy w `.github/workflows/`:
- `ci.yml` — lint, type-check, unit/integration/E2E testy oraz build na push/PR
- `deploy.yml` — build w CI, spakowanie artefaktów (`.next/standalone`, `.next/static`, `.next/BUILD_ID`, `public`), wysyłka na serwer, rozpakowanie i restart domeny na mydevil.net

Wymagane sekrety repozytorium:
- `DEPLOY_HOST` — host SSH (np. sXX.mydevil.net)
- `DEPLOY_USER` — użytkownik SSH (np. `vetternkraft`)
- `DEPLOY_SSH_KEY` — prywatny klucz SSH z dostępem
- `DEPLOY_URL` — publiczny URL wdrożenia (np. `https://gliwicka111.pl`)
- (opcjonalnie) `DEPLOY_PATH` — katalog docelowy; domyślnie `/home/vetternkraft/apps/nodejs/Gliwicka111`

Przebieg wdrożenia (`deploy.yml`):
1. Budowa w CI: `next build` i przygotowanie trybu `standalone`
2. Archiwizacja artefaktów: `deploy.tgz`
3. Wysyłka na serwer (SCP) do `DEPLOY_PATH` lub ścieżki domyślnej
4. Rozpakowanie na serwerze i utworzenie `app.js` (bootstrap dla Passenger)
5. Restart domeny: `devil www restart gliwicka111.pl`

## Wdrożenie na mydevil.net (Passenger)
Konfiguracja domeny:
- W panelu mydevil ustaw `public_nodejs` na `/home/vetternkraft/apps/nodejs/Gliwicka111/`
- Passenger uruchomi `app.js` w tym katalogu, który startuje `/.next/standalone/server.js`

Lokalizacja artefaktów na serwerze:
- `/home/vetternkraft/apps/nodejs/Gliwicka111/.next/standalone/server.js`
- `/home/vetternkraft/apps/nodejs/Gliwicka111/.next/static/**`
- `/home/vetternkraft/apps/nodejs/Gliwicka111/app.js` (tworzony przez workflow)

Restart usługi (z CI lub ręcznie przez SSH):
```
devil www restart gliwicka111.pl
```

## Rozwiązywanie problemów
- „server.js missing” — upewnij się, że build w CI przesłał `.next/standalone`; sprawdź kroki „Show local BUILD_ID” oraz „Verify build artifacts on server” w pipeline
- „Passenger spawn failed” — sprawdź logi błędów domeny, obecność `app.js` i `server.js`; zweryfikuj uprawnienia plików
- Brak statycznych zasobów — sprawdź, czy `.next/static/**` został spakowany i rozpakowany do katalogu docelowego
- Błędy CSP — potwierdź, że wymagane domeny są dozwolone w `middleware.ts`

## Panel administratora (Admin Dashboard)

- Produkcja: https://gliwicka111.pl/admin/dashboard
- Autoryzacja (jedna z metod, ustaw w pliku /home/vetternkraft/apps/nodejs/Gliwicka111/.env):
  - Basic Auth (dla przeglądarki):

```bash path=null start=null
ADMIN_USER=admin
ADMIN_PASS=super-tajne-haslo
```

  - Bearer Token (dla API/CLI):

```bash path=null start=null
ADMIN_AUTH_TOKEN=twoj-bearer-token
```

- Po zmianach w .env zrestartuj domenę:

```bash path=null start=null
devil www restart gliwicka111.pl
```

- Lokalnie (dev):
  - Skonfiguruj .env i uruchom: `npm ci && npm run dev`
  - Wejdź: http://localhost:3000/admin/dashboard

## Ustawienie GitHub Secrets (gh)

Użyj GitHub CLI w katalogu repo (lub z flagą -R właściciel/repo). Przykład dla mydevil.net:

```bash path=null start=null
# Weryfikacja logowania
gh auth status || gh auth login

# Sekrety wymagane przez deploy.yml
gh secret set DEPLOY_HOST --body "s0.mydevil.net"
gh secret set DEPLOY_USER --body "vetternkraft"
gh secret set DEPLOY_URL  --body "https://gliwicka111.pl"
gh secret set DEPLOY_PATH --body "/home/vetternkraft/apps/nodejs/Gliwicka111"
# prywatny klucz przez stdin (nie wypisuje zawartości)
gh secret set DEPLOY_SSH_KEY < ~/.ssh/gh_actions_deploy

# Podgląd sekretów
gh secret list

# (opcjonalnie) odpalenie deploy
gh workflow run Deploy
# i śledzenie
gh run list --workflow="deploy.yml" --limit 1
```


## Licencja
MIT

---

Wkład i propozycje zmian są mile widziane — prosimy o PR/issue.

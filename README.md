# Gliwicka 111

Modern commercial property management web application built with Next.js (App Router), TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Multi-form contact system** for virtual offices, coworking, meeting rooms, advertising campaigns, and special deals, each wired to dedicated React components and server actions
- **Server-side validation and analytics** using Zod schemas, rate-limited submission handlers, and an authenticated analytics API
- **Robust email delivery with monitoring and retries**, including a mock mode for development and a retry worker for failed messages
- **Built‑in rate limiting** at the database level to protect forms and analytics endpoints
- **Operational health checks and admin-only metrics dashboard**, secured via HTTP Basic Auth

## Quickstart

```bash
git clone https://github.com/your-org/Gliwicka111.git
cd Gliwicka111
cp .env.example .env.local             # configure environment variables
npm install
npm run migrate                        # run database migrations
npm run dev                            # start development server
npm run build                          # create production build
npm test                               # unit tests
npm run test:integration               # integration tests
npm run test:e2e                       # end-to-end tests
```

Scripts for development, build, and testing are defined in `package.json`.  
Migrations are orchestrated by `scripts/migrate.ts` which executes all SQL files in `migrations/`.

## Environment Variables

### Database

`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`, `MOCK_DB`

### Email

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`, `EMAIL_MAX_RETRIES`, `MOCK_EMAIL`

### Security & Rate Limiting

`IP_SALT`, `ADMIN_AUTH_TOKEN`, `RATE_LIMIT_COUNT`, `RATE_LIMIT_WINDOW_MS`

### Analytics

`NEXT_PUBLIC_ANALYTICS_TOKEN`, `ANALYTICS_AUTH_TOKEN`, `ANALYTICS_BASIC_USER`, `ANALYTICS_BASIC_PASS`

### Admin Dashboard

`ADMIN_USER`, `ADMIN_PASS`, `NEXT_PUBLIC_ADMIN_USER`, `NEXT_PUBLIC_ADMIN_PASS`, `METRICS_WINDOW_HOURS`

At least one of `ADMIN_AUTH_TOKEN` or the `ADMIN_USER`/`ADMIN_PASS` pair must be set.

### Misc

`CI`, `NODE_ENV`

## Database Setup & Migration

1. Configure the database variables in `.env.local`.
2. Run `npm run migrate` to apply SQL files in the `migrations/` directory to your PostgreSQL instance.

## Admin Dashboard & Metrics

- Navigate to `/admin/dashboard` to view submission and rate-limit metrics.
- Access requires either a bearer token (`ADMIN_AUTH_TOKEN`) or HTTP Basic credentials (`ADMIN_USER`/`ADMIN_PASS`; `NEXT_PUBLIC_ADMIN_USER`/`NEXT_PUBLIC_ADMIN_PASS` prefill the prompt).
- Metrics are served from `/api/admin/metrics` and include submission processing times, email retry stats, and rate‑limit counts.
- Health checks are available at `/api/health` for infrastructure monitoring.

## Testing & CI/CD

- **Playwright setup**: run `npx playwright install --with-deps` before executing Playwright tests.
- **Unit & Integration Tests**: `npm test`, `npm run test:integration` (Vitest).
- **End-to-End Tests**: `npm run test:e2e` (Playwright).
  - E2E mode: build/run with `NEXT_PUBLIC_E2E=true` or append `?e2e=1` in dev.
    - Auto-accepts consent banner, relaxes error boundaries on forms pages, and enables deterministic form UI hooks.
    - Scripts: `npm run test:e2e`, `npm run dev:e2e`, `npm run test:e2e:existing`.
- **Linting**: `npm run lint` (Next.js ESLint).
- **Continuous Integration**: GitHub Actions workflow `ci.yml` runs lint, tests, and build on every push/PR.
- **End-to-End & Deployment Pipelines**: `e2e.yml` executes Playwright tests, while `deploy.yml` ships builds to MyDevil (FreeBSD) after successful E2E runs.
- For detailed linting, testing, and security audit steps, see [Quality checks](./docs/quality.md).

## Deployment

### Vercel

1. Create a new Vercel project and link this repository.
2. Add the environment variables from `.env.local`.
3. Vercel automatically builds and deploys `main` using `next build`.

### Traditional Node.js Hosting (e.g., MyDevil.net/FreeBSD)

1. Install Node.js 18+ and PostgreSQL.
2. Copy the project to the server (see `deploy.yml` for an SCP-based example).
3. Provide `.env` values on the server, run `npm install`, `npm run build`, and `npm start` (behind a process manager or Phusion Passenger).

## Further Documentation

Additional notes and reviews live in the `docs/` directory, such as `docs/DEVELOPMENT_REVIEW.md`.

## Support

For help or commercial inquiries, email **tech@gliwicka111.pl** or **info@gliwicka111.pl**.

---

**Gliwicka 111 – Business workspace solutions made simple.**

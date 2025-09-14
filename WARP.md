# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Clean build artifacts
npm run clean
```

### Testing Commands

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests with coverage
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests (requires Playwright setup)

# Run tests in watch mode
npm run test:watch

# View test coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Quality & Maintenance

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check

# Security audit
npm run security:audit
npm run security:fix

# Generate documentation
npm run generate:docs
```

### Database Operations

```bash
# Run database migrations
npm run migrate

# Retry failed email sends
npm run retry:failed-emails
```

## Architecture Overview

### Core Application Structure

1. **Next.js App Router Structure**
   - `/app`: Core application routes and layouts
   - `/components`: Reusable React components
   - `/__tests__`: Test suites organized by component/feature

2. **Forms System**
   - Multiple form types (virtual office, coworking, meeting rooms, etc.)
   - Server-side validation with Zod schemas
   - Rate limiting and CSRF protection
   - Email notifications with retry mechanism

3. **Analytics & Monitoring**
   - Admin dashboard at `/admin/dashboard`
   - Protected metrics API at `/api/admin/metrics`
   - Health check endpoint at `/api/health`

### Key Components

1. **Form Components**
   - Located in `/components/forms/`
   - Each form has dedicated validation schemas and server actions
   - Shared analytics tracking and error handling

2. **UI Components**
   - Radix UI-based component library in `/components/ui/`
   - Themed using Tailwind CSS
   - Includes complex components like charts and carousels

3. **Server Infrastructure**
   - PostgreSQL database with migration system
   - Email service with retry mechanism
   - Rate limiting at database level
   - Admin authentication via HTTP Basic Auth

## Environment Configuration

The application requires several environment variables categorized by function:

1. **Server Settings**
   - Optional: `HOSTNAME`, `PORT`

2. **Database Configuration**
   - Required: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - Optional: `DATABASE_URL`, `MOCK_DB`

3. **Email Service**
   - Required: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - Optional: `SMTP_FROM`, `EMAIL_MAX_RETRIES`, `MOCK_EMAIL`

4. **Security Settings**
   - Required: `IP_SALT`, `ADMIN_AUTH_TOKEN`
   - Optional: `RATE_LIMIT_COUNT`, `RATE_LIMIT_WINDOW_MS`

5. **Analytics & Admin Access**
   - Required: `ANALYTICS_AUTH_TOKEN`, `ADMIN_USER`, `ADMIN_PASS`
   - Optional: `NEXT_PUBLIC_ANALYTICS_TOKEN`, `METRICS_WINDOW_HOURS`

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom theme
- **Database**: PostgreSQL
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod
- **Monitoring**: Custom analytics and health checks

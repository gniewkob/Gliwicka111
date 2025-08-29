# Quality checks

This guide covers linting, testing, and security audits for the project.

## Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Automatically fix issues:

```bash
npm run lint:fix
```

## Testing

### Unit & Integration Tests

Run the standard unit test suite:

```bash
npm test
```

Integration tests use a separate configuration:

```bash
npm run test:integration
```

### End-to-End Tests (Playwright)

1. Install Playwright dependencies once:
   ```bash
   npx playwright install --with-deps
   ```
2. Provide required environment variables when running the tests:
   - `BASE_URL` – base URL of the running app (defaults to `http://localhost:3000`)
   - `NEXT_PUBLIC_ADMIN_USER` – admin username for HTTP Basic Auth
   - `NEXT_PUBLIC_ADMIN_PASS` – admin password for HTTP Basic Auth

Example:

```bash
BASE_URL=http://localhost:3000 \
NEXT_PUBLIC_ADMIN_USER=admin \
NEXT_PUBLIC_ADMIN_PASS=admin \
npm run test:e2e
```

The script builds the app and then executes the Playwright test suite.

## Security Audit

Check for vulnerable dependencies:

```bash
npm run security:audit
```

Attempt automatic fixes:

```bash
npm run security:fix
```

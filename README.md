# Gliwicka 111 - Professional Business Center Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/gniewkobs-projects/v0-gliwicka-111-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/JPuq0yRem6K)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🏢 Project Overview

Gliwicka 111 is a comprehensive business center website offering virtual office services, coworking spaces, meeting rooms, advertising solutions, and special deals. Built with modern web technologies and focused on user experience, privacy compliance, and business conversion optimization.

### 🎯 Business Objectives

- **Lead Generation**: Convert visitors into qualified business leads
- **Service Showcase**: Present professional business services effectively
- **Trust Building**: Establish credibility through testimonials and certifications
- **Conversion Optimization**: Maximize form completions and inquiries
- **Privacy Compliance**: Full GDPR/RODO compliance with user consent management

## 🚀 Live Deployment

**Production URL**: [https://vercel.com/gniewkobs-projects/v0-gliwicka-111-website](https://vercel.com/gniewkobs-projects/v0-gliwicka-111-website)

**Development Chat**: [https://v0.dev/chat/projects/JPuq0yRem6K](https://v0.dev/chat/projects/JPuq0yRem6K)

## 🛠 Technology Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **React 18** - Latest React features with concurrent rendering

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Form Management
- **React Hook Form 7.51** - Performant form library
- **Zod 3.22** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration
- **Database Connectivity Check** - Each form submission runs a `SELECT 1` query to verify that the database connection is alive before saving data

### Analytics & Privacy
- **Custom Analytics Client** - Privacy-first tracking system
- **GDPR/RODO Compliance** - Full consent management
- **Data Anonymization** - IP hashing and user agent sanitization

### Development Tools
- **ESLint** - Code linting and quality
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing

## 📁 Project Structure

\`\`\`
gliwicka-contact-forms/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── forms/                    # Forms showcase page
│   ├── privacy/                  # Privacy policy
│   ├── properties/               # Properties/services page
│   ├── terms/                    # Terms of service
│   ├── api/                      # API routes
│   │   └── analytics/            # Analytics endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── forms/                    # Form components
│   │   ├── virtual-office-form.tsx
│   │   ├── coworking-form.tsx
│   │   ├── meeting-room-form.tsx
│   │   ├── advertising-form.tsx
│   │   ├── special-deals-form.tsx
│   │   └── form-showcase.tsx
│   ├── analytics/                # Analytics components
│   │   ├── consent-banner.tsx
│   │   └── analytics-dashboard.tsx
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Theme management
├── lib/                          # Utility libraries
│   ├── validation-schemas.ts     # Zod schemas
│   ├── form-utils.ts            # Form utilities
│   ├── server-actions.ts        # Server actions
│   ├── analytics-client.ts      # Analytics client
│   ├── analytics-schemas.ts     # Analytics schemas
│   └── utils.ts                 # General utilities
├── hooks/                        # Custom React hooks
│   ├── use-form-analytics.ts    # Form analytics hook
│   ├── use-mobile.ts            # Mobile detection
│   └── use-toast.ts             # Toast notifications
├── public/                       # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
└── styles/                       # Additional styles
    └── globals.css
\`\`\`

## 🔧 Installation & Setup

### Prerequisites

- **Node.js 18+**
- **PostgreSQL 14+**
- **Phusion Passenger** on **FreeBSD** for production deployment
- **npm** or **yarn** package manager
- **Git** for version control

### Local Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/gliwicka-111-website.git
   cd gliwicka-111-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Variables Setup**

    The application requires the following environment variables to connect to the database, send emails, and enforce rate limiting.

    Create a `.env.local` file in the root directory:
    ```env
    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=gliwicka111
    DB_USER=postgres
    DB_PASSWORD=your-db-password
    DATABASE_URL=postgres://postgres:your-db-password@localhost:5432/gliwicka111

    # Email Configuration
    SMTP_FROM=noreply@gliwicka111.pl
    ADMIN_EMAIL=admin@gliwicka111.pl
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-smtp-username
    SMTP_PASS=your-smtp-password

    # Security
    # Strong random salt for IP hashing (e.g., openssl rand -hex 32)
    IP_SALT=your-strong-random-salt-for-ip-hashing

    # Analytics (Optional)
    NEXT_PUBLIC_ANALYTICS_TOKEN=public-analytics-token
    ANALYTICS_AUTH_TOKEN=analytics-auth-token
    ANALYTICS_BASIC_USER=analytics-user
    ANALYTICS_BASIC_PASS=analytics-pass

    # Rate limiting (defaults allow 100 requests per minute)
    RATE_LIMIT_COUNT=100
    RATE_LIMIT_WINDOW_MS=60000
    ```

    These variables are required both locally and in Vercel. The application issues a `SELECT 1` query on each form submission to ensure the database specified above is reachable.

    `RATE_LIMIT_COUNT` and `RATE_LIMIT_WINDOW_MS` define how many requests an IP can make within the specified time window. The defaults permit 100 requests per 60 seconds. Lower the count or extend the window to tighten limits, or relax them for higher throughput environments.

4. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
\`\`\`

## 📦 Deployment & Operations

### Vercel Deployment

1. **Create project** – Import this repository in the Vercel dashboard.
2. **Configure environment variables** – Add the values from `.env.example`:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (or `DATABASE_URL`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`
   - `IP_SALT`
   - Optional analytics tokens (`NEXT_PUBLIC_ANALYTICS_TOKEN`, `ANALYTICS_AUTH_TOKEN`, `ANALYTICS_BASIC_USER`, `ANALYTICS_BASIC_PASS`)
3. **Provision database** – Ensure the PostgreSQL instance is accessible from Vercel.
4. **Deploy** – Push to the main branch or trigger a deploy in Vercel. The build will use the provided env vars. During form submission the app will run a `SELECT 1` query to confirm database connectivity.

### PostgreSQL Provisioning (MyDevil or External)

1. **Provision PostgreSQL 14+** – Create a database and user in the MyDevil panel or use an external provider.
2. **Configure environment variables** – In the MyDevil config interface set:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (or `DATABASE_URL`)
   - `MOCK_DB=false` to ensure the real database is used in production
3. **Run migrations** – Apply all SQL migrations:
   ```bash
   npm run migrate
   ```
4. **Verify health** – Confirm the API reports a healthy database:
   ```bash
   curl https://your-domain/api/health
   ```

### CI/CD Pipeline
GitHub Actions manage continuous integration and deployment:

- `ci.yml` runs linting, unit tests, and the production build on every push and pull request.
- `e2e.yml` executes Playwright end-to-end tests after CI completes and uploads an HTML report and JUnit results as artifacts.
- `deploy.yml` deploys the application when the E2E workflow succeeds.
  Test artifacts can be downloaded from the GitHub Actions run summary.

1. **Run tests and linting**
   \`\`\`bash
   npm run lint
   npm test
   \`\`\`
2. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`
3. **Apply database migrations**
   \`\`\`bash
   npm run migrate
   \`\`\`
4. **Restart Passenger on FreeBSD**
   \`\`\`bash
   passenger-config restart-app /usr/local/www/gliwicka-111
   \`\`\`

### Database Migrations

Run the migration script after configuring your database connection:

\`\`\`bash
npm run migrate
\`\`\`

### Health Checks

The application exposes a rate-limited health endpoint for monitoring overall system status:

```bash
curl https://your-domain/api/health
```

The endpoint responds with JSON similar to:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 123456,
  "summary": { "healthy": 5, "degraded": 0, "unhealthy": 0 },
  "checks": [ { "service": "database", "status": "healthy" }, ... ]
}
```

- **200** – overall status is `healthy` or `degraded`
- **503** – any check reports `unhealthy`

Rate limiting for this endpoint uses `RATE_LIMIT_COUNT` and `RATE_LIMIT_WINDOW_MS` environment variables.

### Email Retry Worker

Failed emails are stored for later processing. Run the worker manually with:

```bash
npm run retry:failed-emails
```

Schedule it with cron in production to retry deliveries automatically.

### Logging

Server logs are written to `stdout` and captured by Passenger. Ensure logs are monitored and rotated on the FreeBSD host.

### Environment Variables

Configuration is managed through environment variables (see `.env.example`):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Individual database settings for local/CI use |
| `MOCK_DB` | Set to `true` to bypass real database calls (testing) |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Default "from" email address |
| `ADMIN_EMAIL` | Administrator notification address |
| `IP_SALT` | Salt used for IP hashing (set to a strong random value, e.g., from `openssl rand -hex 32`) |
| `NEXT_PUBLIC_ANALYTICS_TOKEN` | Public token for analytics client |
| `ANALYTICS_AUTH_TOKEN` | Token for securing analytics endpoints |
| `ANALYTICS_BASIC_USER` | Basic auth user for analytics endpoints |
| `ANALYTICS_BASIC_PASS` | Basic auth password for analytics endpoints |
| `NODE_ENV` | Node.js environment (`development`, `production`, etc.) |
| `CI` | Set to `true` in CI environments |

## 📋 Features & Services

### 🏢 Virtual Office Services
- **Basic Package** (199 PLN/month)
  - Business address registration
  - Mail handling and forwarding
  - Phone answering service
  - Access to meeting rooms (2 hours/month)

- **Standard Package** (349 PLN/month)
  - All Basic features
  - Dedicated phone number
  - Professional call handling
  - Access to meeting rooms (5 hours/month)
  - Business registration support

- **Premium Package** (499 PLN/month)
  - All Standard features
  - Personal assistant services
  - Unlimited meeting room access
  - Priority mail handling
  - Legal document support

### 🖥 Coworking Spaces
- **Hot Desk** (49 PLN/day, 199 PLN/week, 699 PLN/month)
- **Dedicated Desk** (79 PLN/day, 299 PLN/week, 999 PLN/month)
- **Private Office** (149 PLN/day, 549 PLN/week, 1899 PLN/month)

### 🏛 Meeting Rooms
- **Small Room** (2-4 people): 89 PLN/hour
- **Medium Room** (5-8 people): 149 PLN/hour
- **Large Room** (9-15 people): 249 PLN/hour
- **Conference Hall** (16-30 people): 399 PLN/hour

### 📢 Advertising Solutions
- **Mobile Billboard**: From 1,999 PLN/week
- **Static Billboard**: From 899 PLN/month
- **Digital Advertising**: From 1,499 PLN/month

### 🎁 Special Deals
- **Welcome Package**: 50% off first month
- **Referral Program**: 20% discount for referrals
- **Student Discount**: 30% off for students
- **Startup Package**: Customized pricing for startups
- **Long-term Contracts**: Up to 25% discount

## 🔒 Privacy & Compliance

### GDPR/RODO Compliance
- **Consent Management**: Granular privacy controls
- **Data Minimization**: Only collect necessary data
- **Right to be Forgotten**: Complete data deletion capability
- **Data Portability**: Export user data in standard formats
- **Breach Notification**: Automated security incident reporting

### Data Protection Measures
- **IP Address Hashing**: SHA-256 with salt
- **User Agent Anonymization**: Remove identifying information
- **Session Management**: Secure session handling
- **Data Retention**: 90-day automatic deletion policy
- **Encryption**: All data encrypted in transit and at rest

### Analytics Privacy
- **Privacy-First Tracking**: No third-party trackers
- **Consent-Based**: Analytics only with explicit consent
- **Anonymized Data**: No personally identifiable information
- **Local Storage**: Consent preferences stored locally

## 📊 Analytics & Monitoring

### Form Analytics
- **Conversion Tracking**: Complete funnel analysis
- **Field-Level Analytics**: Error rates and interaction patterns
- **Abandonment Analysis**: Identify drop-off points
- **Completion Time**: Track user engagement duration
- **A/B Testing**: Form optimization experiments

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Page Load Times**: Performance optimization
- **Error Tracking**: Client-side error monitoring
- **User Experience**: Interaction and engagement metrics

### Business Intelligence
- **Lead Quality Scoring**: Automated lead qualification
- **Service Popularity**: Most requested services
- **Geographic Analysis**: Customer location insights
- **Conversion Attribution**: Marketing channel effectiveness

## 🧪 Testing Strategy

### Unit Testing
\`\`\`bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
\`\`\`

### Integration Testing
\`\`\`bash
# Run integration tests
npm run test:integration
\`\`\`

### End-to-End Testing
\`\`\`bash
# Run E2E tests
npm run test:e2e
\`\`\`

### Performance Testing
\`\`\`bash
# Lighthouse CI
npm run lighthouse

# Bundle analysis
npm run analyze
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link GitHub repository to Vercel
2. **Environment Variables**: Configure production environment variables
3. **Domain Setup**: Configure custom domain (gliwicka111.pl)
4. **SSL Certificate**: Automatic HTTPS with Let's Encrypt
5. **CDN Configuration**: Global edge network optimization

### Manual Deployment
\`\`\`bash
# Build production bundle
npm run build

# Deploy to your hosting provider
npm run deploy
\`\`\`

### Docker Deployment
\`\`\`dockerfile
# Dockerfile included for containerized deployment
docker build -t gliwicka-111 .
docker run -p 3000:3000 gliwicka-111
\`\`\`

## 🔍 SEO Optimization

### Technical SEO
- **Structured Data**: JSON-LD schema markup
- **Meta Tags**: Comprehensive SEO metadata
- **Sitemap**: XML sitemap generation
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Duplicate content prevention

### Content SEO
- **Keyword Optimization**: Business service keywords
- **Local SEO**: Gliwice location optimization
- **Multilingual SEO**: Polish and English content
- **Rich Snippets**: Enhanced search results

### Performance SEO
- **Core Web Vitals**: Google ranking factors
- **Mobile-First**: Mobile optimization priority
- **Page Speed**: Sub-3-second load times
- **Image Optimization**: WebP format with fallbacks

## 🌐 Internationalization

### Language Support
- **Polish (Primary)**: Native language content
- **English (Secondary)**: International business support
- **Dynamic Switching**: Runtime language switching
- **SEO Optimization**: Hreflang implementation

### Localization Features
- **Currency**: PLN pricing with context
- **Date/Time**: Polish formatting standards
- **Phone Numbers**: Polish phone number validation
- **Legal Compliance**: GDPR/RODO dual compliance

## 🔧 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

### Component Architecture
- **Atomic Design**: Atoms, molecules, organisms pattern
- **Composition**: Prefer composition over inheritance
- **Props Interface**: Explicit TypeScript interfaces
- **Error Boundaries**: Graceful error handling

### Performance Guidelines
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images and non-critical components
- **Memoization**: React.memo and useMemo optimization
- **Bundle Analysis**: Regular bundle size monitoring

## 📈 Business Metrics & KPIs

### Conversion Metrics
- **Form Completion Rate**: Target >15%
- **Lead Quality Score**: Automated qualification
- **Cost Per Lead**: Marketing efficiency
- **Customer Acquisition Cost**: Business sustainability

### User Experience Metrics
- **Page Load Time**: Target <3 seconds
- **Bounce Rate**: Target <40%
- **Session Duration**: Target >2 minutes
- **Mobile Conversion**: Target >60% of desktop

### Technical Metrics
- **Uptime**: Target 99.9%
- **Core Web Vitals**: All metrics in "Good" range
- **Security Score**: A+ rating on security tests
- **Accessibility**: WCAG AA compliance

## 🛡 Security Considerations

### Data Security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Token-based protection

### Infrastructure Security
- **HTTPS Enforcement**: Strict Transport Security
- **Security Headers**: Comprehensive security headers
- **Rate Limiting**: API endpoint protection
- **DDoS Protection**: Cloudflare integration

### Privacy Security
- **Data Encryption**: AES-256 encryption
- **Access Controls**: Role-based permissions
- **Audit Logging**: Complete action tracking
- **Incident Response**: Automated breach detection

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**: Create personal fork
2. **Feature Branch**: Create feature-specific branch
3. **Development**: Follow coding standards
4. **Testing**: Ensure all tests pass
5. **Pull Request**: Submit for review

### Code Review Process
- **Automated Checks**: CI/CD pipeline validation
- **Peer Review**: Minimum two reviewer approval
- **Security Review**: Security-focused code review
- **Performance Review**: Performance impact assessment

## 📞 Support & Maintenance

### Technical Support
- **Documentation**: Comprehensive technical documentation
- **Issue Tracking**: GitHub Issues for bug reports
- **Feature Requests**: Community-driven feature development
- **Security Reports**: Responsible disclosure process

### Maintenance Schedule
- **Dependencies**: Monthly security updates
- **Performance**: Quarterly optimization reviews
- **Content**: Regular content freshness updates
- **Analytics**: Monthly performance reporting

## 📄 License & Legal

### Software License
- **MIT License**: Open source with attribution
- **Third-party Licenses**: All dependencies properly licensed
- **Commercial Use**: Permitted with attribution

### Content License
- **Business Content**: Proprietary to Gliwicka 111
- **Images**: Licensed stock photography
- **Trademarks**: Registered business trademarks

### Compliance
- **GDPR**: Full European data protection compliance
- **RODO**: Polish data protection law compliance
- **Accessibility**: WCAG 2.1 AA compliance
- **Business Registration**: Valid Polish business entity

## 🔮 Future Roadmap

### Phase 1 (Q1 2024)
- [ ] Advanced booking system integration
- [ ] Real-time availability calendar
- [ ] Payment gateway integration
- [ ] Customer portal development

### Phase 2 (Q2 2024)
- [ ] Mobile application development
- [ ] Advanced CRM integration
- [ ] Automated marketing workflows
- [ ] Enhanced analytics dashboard

### Phase 3 (Q3 2024)
- [ ] AI-powered chatbot integration
- [ ] Predictive analytics implementation
- [ ] Advanced personalization features
- [ ] Multi-location support

### Phase 4 (Q4 2024)
- [ ] Enterprise API development
- [ ] Third-party integrations
- [ ] Advanced reporting suite
- [ ] Franchise management system

---

## 📞 Contact Information

**Business Address**: Gliwicka 111, Gliwice, Poland

**Technical Support**: [tech@gliwicka111.pl](mailto:tech@gliwicka111.pl)

**Business Inquiries**: [info@gliwicka111.pl](mailto:info@gliwicka111.pl)

**Emergency Support**: +48 123 456 789 (24/7)

---

*This README is maintained by the development team and updated with each major release. Last updated: January 2024*

# wedding-invitation

## Project Overview

**Name:** wedding-invitation
**Couple:** Hà Phương & Hoàng Minh
**Type:** Single-page online wedding invitation website
**Style:** Vietnamese Gen Z Luxury Cinematic 2026 — modern, minimal, premium, like a love-story film trailer
**Primary Language:** Vietnamese (bilingual VI/EN toggle)
**Deploy:** Vercel

### Vision

Create a premium, cinematic single-page wedding invitation website that feels like a $500k wedding film trailer. The site celebrates the couple's love story with modern, minimal design and seamless interactivity, delivering a memorable digital experience to guests.

### Key Features

- Cinematic hero with video background + countdown timer
- Personalized guest greeting via URL param (`?guest=NguyenVanA`)
- Our Story timeline with animations
- Event details (ceremony/reception/map/add-to-calendar)
- Photo album (masonry grid + lightbox)
- Embedded wedding video
- Multi-step RSVP form with guest auto-fill
- Realtime wishes feed (Supabase subscriptions)
- Gift coordination (QR code + bank transfer info)
- Mini-games (Love Memory, Quiz, Catch Bouquet) with leaderboard
- Dynamic OG image per guest for sharing
- Floating UI (music toggle, quick nav, RSVP CTA)
- Bilingual (VI/EN) + dark mode

## Tech Stack

### Frontend

- **Build:** Vite (fast HMR, optimized production builds)
- **Framework:** React 18+ with TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility-first, dark mode)
- **State Management:** React Context + hooks
- **i18n:** react-i18next (VI/EN toggle)
- **Animation:** Framer Motion (cinematic transitions, parallax)
- **Form Handling:** React Hook Form + Zod (type-safe validation)
- **HTTP Client:** TanStack Query (React Query)
- **Icons:** Lucide React
- **Video:** HTML5 `<video>` + Plyr.js
- **Lightbox:** yet-another-react-lightbox

### Backend

- **Database:** Supabase (PostgreSQL + Realtime)
- **Storage:** Supabase Storage for media
- **Serverless:** Vercel Functions for OG image generation (@vercel/og)

### Deployment

- **Hosting:** Vercel
- **Domain:** Custom domain (TBD)
- **CI/CD:** GitHub → Vercel auto-deploy

## Important Notes

### Design Principles

- **Minimalism:** Generous whitespace, intentional negative space
- **Cinematic:** Film grain overlay, subtle parallax, smooth transitions (200–400ms easing)
- **Luxury:** Muted color palette (ivory #F7E7CE, champagne #E8D5B7, black #0A0A0A, muted gold #8B7355)
- **Emotional:** Storytelling through imagery, music, micro-interactions
- **Modern:** 2026 trends: glassmorphism, blur effects, no skeuomorphism or cartoon elements

### Performance Targets

- **Bundle size:** ≤ 200KB gzipped
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **Lighthouse score:** ≥ 90 (all metrics)
- **Mobile usability:** ≥ 95
- **WCAG AA accessibility:** ≥ 95

### Code Standards

- **File naming:** kebab-case for TS/React files (e.g., `hero-section.tsx`, `use-guest.ts`)
- **TypeScript:** Strict mode enabled, all types in `src/types/`
- **Components:** Functional components with TypeScript, co-located with styles
- **Styling:** Tailwind CSS only (no custom CSS except animations)
- **Accessibility:** WCAG AA compliance, semantic HTML, keyboard navigation
- **Git:** Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

### Development Workflow

1. Read `./docs/project-overview-pdr.md` for vision and goals
2. Read `./docs/code-standards.md` for coding conventions
3. Read `./docs/design-system/design-principles.md` for design guidelines
4. Follow phased roadmap in `./docs/project-roadmap.md`
5. Run linting before commit: `npm run lint`
6. Run tests before push: `npm run test`
7. Check Lighthouse score: `npm run build && npm run preview`

### Never Commit

- `.env.local` (secrets, API keys)
- `node_modules/`
- `.DS_Store`, `*.log`
- Database credentials or sensitive data

## Documentation

All documentation is in `./docs/`:

- **`project-overview-pdr.md`** — Vision, goals, feature scope, success metrics
- **`system-architecture.md`** — Frontend/backend architecture, data flow, DB schema, OG image generation
- **`code-standards.md`** — Folder structure, file naming, TypeScript conventions, component patterns, accessibility rules
- **`project-roadmap.md`** — 8-phase implementation plan (9 weeks total)
- **`deployment-guide.md`** — Vercel setup, environment variables, Supabase configuration, deployment steps
- **`codebase-summary.md`** — Planned module structure, dependencies, testing strategy
- **`design-system/design-principles.md`** — Color palette, typography, spacing, motion, glassmorphism, imagery direction

**Start here:** Read `./docs/project-overview-pdr.md` first, then `./docs/code-standards.md` before implementing.

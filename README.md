# wedding-invitation

Premium single-page wedding invitation website for Hà Phương & Hoàng Minh. A cinematic, modern, minimal digital experience celebrating their love story with personalized guest invitations, RSVP management, and interactive features.

## Features (Phases 0–3 Complete)

- **Cinematic Hero** — Full-screen video background with countdown timer (Phase 1)
- **Love Story Timeline** — Animated timeline of the couple's journey (Phase 2)
- **Event Details** — Ceremony/reception info, map, add-to-calendar buttons (Phase 2)
- **Photo Album** — Masonry grid with lightbox slideshow (Phase 3)
- **Wedding Video** — YouTube nocookie facade with lazy-load (Phase 3)
- **Cinematic Backdrop** — CSS scroll-snap slide deck with film grain (Phase 3)
- **Bilingual** — Vietnamese/English toggle with localStorage persistence (Phase 1)
- **Dark Mode** — Full dark mode support with pre-hydration (Phase 1)

## Planned Features (Phase 4+)

- **Personalized Invitations** — Auto-greet guests via unique URL (`?guest=NguyenVanA`)
- **Multi-Step RSVP** — Guest auto-fill, validation, Supabase submission
- **Realtime Wishes Feed** — Live guest wishes with Supabase subscriptions
- **Gift Coordination** — QR code + bank transfer info for gift money
- **Mini-Games** — Love Memory, Quiz, Catch Bouquet with leaderboard
- **Dynamic OG Images** — Per-guest share links with custom OG images
- **Floating UI** — Music toggle, quick nav, RSVP CTA

## Tech Stack

**Frontend:** Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
**Backend:** Supabase (PostgreSQL + Realtime)
**Deployment:** Vercel
**i18n:** react-i18next
**Forms:** React Hook Form + Zod
**State:** React Context + TanStack Query

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Git
- Supabase account (free tier)
- Vercel account (free tier)

### Setup

```bash
# Clone repository
git clone https://github.com/weddinginvitationmp-art/mp.git
cd wedding-invitation

# Install dependencies (pnpm required)
pnpm install

# Create environment file
cp .env.example .env.local

# Fill in Supabase credentials in .env.local
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=xxx

# Start development server
pnpm dev

# Open http://localhost:5173
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to Vercel (automatic on git push to main)
git push origin main
```

## Project Structure

```
src/
├── components/          # React components (common, sections, floating-ui)
├── hooks/               # Custom React hooks (useGuest, useRsvp, etc.)
├── lib/                 # Utilities (supabase, api, date-utils, etc.)
├── i18n/                # Translations (vi.json, en.json)
├── styles/              # Global CSS (globals, animations, film-grain)
├── types/               # TypeScript interfaces
├── App.tsx              # Root component
└── main.tsx             # Entry point

public/
├── media/               # Images, videos
└── fonts/               # Custom fonts

docs/
├── project-overview-pdr.md          # Vision, goals, features
├── system-architecture.md           # Architecture, DB schema
├── code-standards.md                # Coding conventions
├── project-roadmap.md               # 8-phase implementation plan
├── deployment-guide.md              # Vercel & Supabase setup
├── codebase-summary.md              # Module structure
└── design-system/
    └── design-principles.md         # Design system, colors, typography
```

## Documentation

Start with these docs:

1. **`./docs/project-overview-pdr.md`** — Project vision, goals, feature scope
2. **`./docs/code-standards.md`** — Coding conventions, folder structure, TypeScript rules
3. **`./docs/design-system/design-principles.md`** — Design system, colors, typography, motion
4. **`./docs/project-roadmap.md`** — 8-phase implementation plan (9 weeks)
5. **`./docs/system-architecture.md`** — Technical architecture, data flow, DB schema
6. **`./docs/deployment-guide.md`** — Vercel & Supabase setup, deployment steps

## Development

### Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript
npm run test             # Run tests
npm run analyze          # Analyze bundle size
```

### Code Standards

- **File naming:** kebab-case (e.g., `hero-section.tsx`, `use-guest.ts`)
- **TypeScript:** Strict mode, all types in `src/types/`
- **Components:** Functional components with TypeScript
- **Styling:** Tailwind CSS only
- **Accessibility:** WCAG AA compliance
- **Git:** Conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### Before Pushing

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Lighthouse score ≥ 90 (`npm run build && npm run preview`)
- [ ] No console errors/warnings
- [ ] Tested on mobile, tablet, desktop

## Design System

**Color Palette:**

- Ivory: `#F7E7CE` (primary background)
- Champagne: `#E8D5B7` (accents, hover)
- Black: `#0A0A0A` (text, dark mode)
- Muted Gold: `#8B7355` (secondary accents)

**Typography:**

- Display: Playfair Display (serif, headings)
- Body: Inter (sans-serif, readable)

**Motion:**

- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth, natural)
- Durations: 150ms (micro), 300ms (standard), 500ms (cinematic)

**Aesthetic:**

- Minimalism, generous whitespace
- Cinematic (film grain, parallax, smooth transitions)
- Luxury (muted colors, premium typography)
- Emotional (storytelling, music, micro-interactions)
- Modern (glassmorphism, blur effects, no cartoons)

See `./docs/design-system/design-principles.md` for full design system.

## Performance Targets

- **Bundle size:** ≤ 200KB gzipped
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **FCP (First Contentful Paint):** ≤ 1.5s
- **CLS (Cumulative Layout Shift):** ≤ 0.1
- **Lighthouse score:** ≥ 90 (all metrics)
- **Mobile usability:** ≥ 95
- **Accessibility (WCAG AA):** ≥ 95

## Deployment

### Vercel Setup

1. Push code to GitHub
2. Go to vercel.com, create new project
3. Select GitHub repository
4. Configure build: `npm run build`, output: `dist`
5. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
6. Deploy

### Supabase Setup

1. Create Supabase project
2. Run database schema setup (see `./docs/deployment-guide.md`)
3. Configure RLS policies
4. Populate guests table
5. Copy Project URL and anon key to Vercel env vars

See `./docs/deployment-guide.md` for detailed setup instructions.

## Roadmap

**Phase 0:** Setup (Vite, React, TypeScript, Tailwind, Supabase) ✓ Complete
**Phase 1:** Hero + Countdown + i18n + Dark mode ✓ Complete
**Phase 2:** Our Story + Event Details + Add-to-calendar ✓ Complete
**Phase 3:** Album + Video + Cinematic backdrop ✓ Complete
**Phase 4:** RSVP + Personalized link + Guests table (In Planning)
**Phase 5:** Wishes + QR/Bank gift
**Phase 6:** Mini-games + Leaderboard
**Phase 7:** OG image + Share buttons + Floating UI
**Phase 8:** Polish + Accessibility + Performance + Deploy

See `./docs/project-roadmap.md` for detailed phase breakdown.

## Contributing

1. Create feature branch: `git checkout -b feat/your-feature`
2. Follow code standards in `./docs/code-standards.md`
3. Commit with conventional commits: `git commit -m "feat: add hero section"`
4. Push to GitHub: `git push origin feat/your-feature`
5. Create pull request
6. Ensure all checks pass (tests, linting, Lighthouse)

## Support

- **Documentation:** `./docs/`
- **Design System:** `./docs/design-system/design-principles.md`
- **Deployment:** `./docs/deployment-guide.md`
- **Architecture:** `./docs/system-architecture.md`

## License

TBD

## Contact

- **Couple:** Hà Phương & Hoàng Minh
- **GitHub:** https://github.com/your-org/wedding-invitation
- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://app.supabase.com

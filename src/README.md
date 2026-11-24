# Application Source Code (`src/`)

> **Status**: Phase 1 - active development
> **Owner**: Erick & Kalya

---

## Current state

The Next.js app (App Router, TypeScript strict, Tailwind CSS 4) is scaffolded and
the UI design system is in place.

| Path | Contents |
| :--- | :--- |
| `app/` | Routes. Currently `/` (landing) and `/design-system` (component showcase). |
| `app/globals.css` | Design tokens: Poppins, 7-step brand palette, typography scale (`text-h1` ... `text-caption`). |
| `components/ui/` | Primitives: `Button`, `IconButton`, `Chip` / `FilterChips`, `SearchBar`, `GuideCard`. |
| `components/layout/` | `Navbar`, `Sidebar`, `Logo`, shared `nav-items`. |
| `lib/utils.ts` | `cn()` class-name helper (aware of the custom `text-h*` utilities). |

Target layout for the remaining modules (auth, home, community, knowledge,
ai-navigator, Supabase and Gemini clients) is defined in
[`docs/TECH_AND_DATABASE.md`](../docs/TECH_AND_DATABASE.md), section 6.

## Conventions

- Follow the design reference for all visual work: Poppins, the brand palette in
  `globals.css`, and the type scale. Do not introduce ad-hoc colors or font sizes.
- Use the `cn()` helper from `@/lib/utils` to combine class names.
- Every screen handles loading, empty, and error states.
- No secrets in code. Use `.env.local` (see `.env.example`).
- Database tables and columns must match `docs/TECH_AND_DATABASE.md`.
- `next dev` must not edit `AGENTS.md`; this is disabled via `agentRules: false`
  in `next.config.ts`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Open `/design-system` to preview every component.

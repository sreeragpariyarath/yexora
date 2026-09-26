# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/landing site for Yexora IT Solutions. Early stage: a single page (`app/page.tsx`) with a full-bleed hero image and a shared `Header` component. Nav links point to in-page anchors (`#about`, `#works`, `#services`, `#contact`) whose sections don't exist yet.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (also runs type checking)
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test framework configured.

## Stack notes

- **Next.js 16 (App Router) + React 19.** These versions are newer than much training data; check `node_modules/next/dist/docs/` or the Next.js docs before relying on older APIs or conventions.
- **Tailwind CSS v4**, configured CSS-first in `app/globals.css` via `@import "tailwindcss"` and `@theme inline` — there is no `tailwind.config.js`. Add theme tokens there.
- Path alias `@/*` maps to the repo root (e.g. `@/components/Header`, `@/public/hero-image.png`).
- `lucide-react` is installed for icons but not yet used; icons so far are hand-built (`MenuIcon`) or inline SVGs.

## Styling conventions

- The site is dark-only: `app/layout.tsx` hard-codes the `dark` class on `<html>` and `bg-[#050713] text-zinc-100` on `<body>`. The light/dark CSS variables in `globals.css` are leftover scaffolding and are overridden by these classes.
- Fonts: Geist / Geist Mono come from `next/font` (CSS vars `--font-geist-sans` / `--font-geist-mono`). The display font **Bebas Neue** is loaded via a Google Fonts `@import` in `globals.css` and exposed as the `font-bebas` class; components also set it with an inline `style={{ fontFamily: ... }}` for reliability.
- Headline sizing uses viewport units (e.g. `text-[14.8vw]`) so the hero title spans the width on one line.
- Accent colour is the `--color-accent` token in `globals.css` (`bg-accent`, `border-accent`, …).
- Animations are plain Tailwind transitions — no animation library or plugin is installed. In Tailwind v4, `translate-*`/`scale-*`/`rotate-*` set the individual CSS `translate`/`scale`/`rotate` properties, so custom transitions must list those (e.g. `transition-[translate,opacity]`), not `transform`.

## Menu

- `Header` (client component) has separate desktop (12-column grid, `lg:` and up) and mobile bars; both menu buttons open the same full-screen `MenuOverlay`. Nav items live in `NAV_ITEMS` / `MENU_ITEMS` constants in `Header.tsx`.
- Smooth scrolling is Lenis (`components/SmoothScroll.tsx`, `ReactLenis root`, wrapped around the app in `layout.tsx`). Lock page scroll with `useLenis()?.stop()/start()`, not `body { overflow }`; nested scroll areas need `data-lenis-prevent`. Scrollbars are hidden site-wide in `globals.css` (`scrollbar-width: none` + `::-webkit-scrollbar`), so locking scroll causes no layout shift.
- `MenuOverlay` is always mounted and slides with `-translate-y-full` ↔ `translate-y-0`; its inner content wrapper travels a shorter distance (`translate-y-[60%]` → 0) on the same duration/ease, so both land together. Rows only fade in (no movement), so nothing shifts after the panel lands. While closed it is `inert` + `aria-hidden`. When open it stops Lenis, closes on Escape, and restores focus. Its phone and social URLs are placeholders (TODO).
- `MenuLink` renders each label twice as per-letter spans (grey layer exits up, white layer enters from below) with an inline `transitionDelay` stagger, over an accent fill that scales up from the bottom border. Hover and `focus-visible` trigger the same effect. The link is `overflow-hidden` and the letter layers are `pointer-events-none` — rows are tightly stacked, so without this the moving letters spill into neighbouring rows and steal their hover.

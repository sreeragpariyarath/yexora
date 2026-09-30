# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/landing site for Yexora IT Solutions. Early stage: a single page (`app/page.tsx`) made of scroll sections over a fixed 3D scene (`ScrollFlow`), with the shared `Header` fixed on top. The page has a visually hidden `<h1>`. Nav links point to in-page anchors: `#about`, `#services` and `#works` exist; `#contact` doesn't yet.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (also runs type checking)
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test framework configured.

## Stack notes

- **Next.js 16 (App Router) + React 19.** These versions are newer than much training data; check `node_modules/next/dist/docs/` or the Next.js docs before relying on older APIs or conventions.
- **Tailwind CSS v4**, configured CSS-first in `app/globals.css` via `@import "tailwindcss"` and `@theme inline` — there is no `tailwind.config.js`. Add theme tokens there.
- Path alias `@/*` maps to the repo root (e.g. `@/components/Header`).
- `lucide-react` is installed for icons but not yet used; icons so far are hand-built (`MenuIcon`) or inline SVGs.
- 3D uses `three` + `@react-three/fiber` v9 + `@react-three/drei` + `@react-three/postprocessing` (bloom).

## Styling conventions

- The site is dark-only: `app/layout.tsx` hard-codes the `dark` class on `<html>` and `bg-[#050713] text-zinc-100` on `<body>`. The light/dark CSS variables in `globals.css` are leftover scaffolding and are overridden by these classes.
- Fonts: Geist / Geist Mono / Poppins come from `next/font` (CSS vars `--font-geist-sans` / `--font-geist-mono` / `--font-poppins-sans`; Poppins is exposed as the `font-poppins` utility for body copy — keep the next/font var name different from the theme token to avoid a self-referencing var). The display font **Bebas Neue** is loaded via a Google Fonts `@import` in `globals.css` and exposed as the `font-bebas` class (now only used by the menu overlay); components also set it with an inline `style={{ fontFamily: ... }}` for reliability.
- Headline sizing uses viewport units (e.g. `lg:text-[4.4vw]`) so type scales with the screen.
- Accent colour is the `--color-accent` token in `globals.css` (`bg-accent`, `border-accent`, …).
- Animations are plain Tailwind transitions — no animation library or plugin is installed. In Tailwind v4, `translate-*`/`scale-*`/`rotate-*` set the individual CSS `translate`/`scale`/`rotate` properties, so custom transitions must list those (e.g. `transition-[translate,opacity]`), not `transform`.

## Menu

- `Header` (client component), fixed over the page: logo mark (`public/logo-mark.png`, rendered white via `brightness-0 invert`) plus a "Yexora" wordmark on the left, nav links in the centre (a `lg:grid-cols-[1fr_auto_1fr]` grid keeps them truly centred; hidden below `lg`), and a "Get started" pill on the right. Below `lg`, a menu button beside the pill opens the full-screen `MenuOverlay`; there is no menu button on desktop. Nav items live in `NAV_ITEMS` / `MENU_ITEMS` constants in `Header.tsx`.
- Smooth scrolling is Lenis (`components/SmoothScroll.tsx`, `ReactLenis root`, wrapped around the app in `layout.tsx`). Lock page scroll with `useLenis()?.stop()/start()`, not `body { overflow }`; nested scroll areas need `data-lenis-prevent`. Scrollbars are hidden site-wide in `globals.css` (`scrollbar-width: none` + `::-webkit-scrollbar`), so locking scroll causes no layout shift.
- `MenuOverlay` is always mounted and slides with `-translate-y-full` ↔ `translate-y-0`; its inner content wrapper travels a shorter distance (`translate-y-[60%]` → 0) on the same duration/ease, so both land together. Rows only fade in (no movement), so nothing shifts after the panel lands. While closed it is `inert` + `aria-hidden`. When open it stops Lenis, closes on Escape, and restores focus. Its phone number is a placeholder (TODO).
- Social links live in `components/socials.tsx` (`SOCIALS` + `<SocialLinks iconClassName>`), used by the menu footer; the URLs are still `"#"` placeholders.
- `MenuLink` renders each label twice as per-letter spans (grey layer exits up, white layer enters from below) with an inline `transitionDelay` stagger, over an accent fill that scales up from the bottom border. Hover and `focus-visible` trigger the same effect. The link is `overflow-hidden` and the letter layers are `pointer-events-none` — rows are tightly stacked, so without this the moving letters spill into neighbouring rows and steal their hover.

## Scroll flow (3D)

- The page is real `<section>`s scrolling over one fixed WebGL canvas: `ScrollFlow` renders a `fixed inset-0` `FlowCanvas` plus `FlowSections` (`sections.tsx`). The sections are Hero, About, Problem, Solution, Future and Product (with the dashboard). Copy sections pin their text with a `sticky top-0 h-screen` child, so none of their ancestors may be `overflow-hidden`. Headings are Poppins medium in mixed case; all copy is placeholder (TODO).
- **Chapter value `c`:** every `[data-chapter]` section is one chapter. `ScrollFlow` measures the sections' document tops (via `ResizeObserver`) into `layoutRef`. Each frame, `Driver` (a `useFrame` at priority -1) maps `window.scrollY` onto those tops, so `c = i` when section *i*'s top reaches the viewport top. Adding, removing or resizing a section shifts `c`, so retune `timeline.ts` when you do.
- **Smoothness rule:** Lenis already eases `scrollY` every frame, so `Driver` uses it as-is. Don't damp scroll again in the canvas (that caused lag). Scrolling never re-renders React. The dashboard's rise and tilt are a CSS var (`--rise`) set from a scroll listener.
- **`timeline.ts`** holds the world layout (`FAN_A`, `FAN_B`, `WALL_A`/`WALL_B`, `TAIL_X`) and the keyframe `track`s in `c` for the camera, each fan, the tail and the particles. `track` interpolates with smoothstep between keys. `evaluate()` writes everything into the shared mutable `FlowState`, which scene components read in `useFrame`.
- **The chain:** the scene runs along +x and the camera pans right.
  - **Hero fan:** `Fan` with `FAN_A` grows in on load. This is time-based (`load`), advanced by capped frame time so a shader-compile stall doesn't skip it.
  - **Wall:** on scroll its strand ends land on a wall of glowing dots (`uWall`).
  - **Fan B:** a thread escapes that wall and fans out, bending down (`FAN_B`), then hits wall B.
  - **Tail:** the tail `Fibers` escape wall B and morph through the shapes in `fiberShader.ts` (escape → beam → hourglass → scatter), with `tailRotZ` swinging the beam. Scatter is invisible, so the scene fades out behind the rising dashboard. The tubes interlude and the radial burst were removed at the user's request.
- **Shaders:** fan and fibre positions are computed in vertex shaders (`fanShader.ts`, `fiberShader.ts`) from `t` along the strand plus a per-strand seed. The fan's wall dots use the same GLSL chunk evaluated at `t = 1`. In the tail, scatter has alpha 0, and morphs out of it fade in at the target shape rather than flying in.
- **Loading and fallbacks:** the canvas is loaded with `next/dynamic({ ssr: false })`. It uses drei `PerformanceMonitor` to drop the dpr (1.5 → 1) on slow devices, runs bloom at half resolution, and has a gradient `fallback` for when WebGL is missing. Under reduced motion there is no intro grow, no pointer parallax and no scramble.
- **Lint rule:** React Compiler lint (`react-hooks/immutability`) forbids mutating `useMemo` values or props. Declare three objects in JSX (`<shaderMaterial args={[params]} ref={…}>`) and mutate them through refs. Name ref props `…Ref` so the compiler treats them as refs.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/landing site for Yexora IT Solutions. Early stage: a single page (`app/page.tsx`) made of scroll sections over a fixed 3D scene (`ScrollFlow`), with the shared `Header` fixed on top. The page has a visually hidden `<h1>`. Nav links point to in-page anchors (`#about`, `#services`, `#works`, `#contact`), all of which exist.

**Content rules** (from the company's registration document and the owner): the company is "Yexora IT Solutions", located in "India" only (no city or state). Never show founder names. No game development and no training/internships for now. Services live in `components/flow/services.ts`; email, phone and location live in `components/contact.ts` (shared by the menu and the contact section; email and phone are still placeholders).

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

- `Header` (client component), fixed over the page: the logo mark alone on the left (`public/logo-mark.png`, rendered white via `brightness-0 invert`; no wordmark, at the owner's request), nav links in the centre (a `lg:grid-cols-[1fr_auto_1fr]` grid keeps them truly centred; hidden below `lg`), and a "Get started" pill on the right. Below `lg`, a menu button beside the pill opens the full-screen `MenuOverlay`; there is no menu button on desktop. Nav items live in `NAV_ITEMS` / `MENU_ITEMS` constants in `Header.tsx`.
- Smooth scrolling is Lenis (`components/SmoothScroll.tsx`, `ReactLenis root`, wrapped around the app in `layout.tsx`). Lock page scroll with `useLenis()?.stop()/start()`, not `body { overflow }`; nested scroll areas need `data-lenis-prevent`. Scrollbars are hidden site-wide in `globals.css` (`scrollbar-width: none` + `::-webkit-scrollbar`), so locking scroll causes no layout shift.
- `MenuOverlay` is always mounted and slides with `-translate-y-full` ↔ `translate-y-0`; its inner content wrapper travels a shorter distance (`translate-y-[60%]` → 0) on the same duration/ease, so both land together. Rows only fade in (no movement), so nothing shifts after the panel lands. While closed it is `inert` + `aria-hidden`. When open it stops Lenis, closes on Escape, and restores focus. Its phone number is a placeholder (TODO).
- Social links live in `components/socials.tsx` (`SOCIALS` + `<SocialLinks iconClassName>`), used by the menu footer; the URLs are still `"#"` placeholders.
- `MenuLink` renders each label twice as per-letter spans (grey layer exits up, white layer enters from below) with an inline `transitionDelay` stagger, over an accent fill that scales up from the bottom border. Hover and `focus-visible` trigger the same effect. The link is `overflow-hidden` and the letter layers are `pointer-events-none` — rows are tightly stacked, so without this the moving letters spill into neighbouring rows and steal their hover.

## Scroll flow (3D)

- The page is real `<section>`s scrolling over one fixed WebGL canvas: `ScrollFlow` renders a `fixed inset-0` `FlowCanvas` plus `FlowSections` (`sections.tsx`). The sections are Hero, About, Problem, Services, Future, Works and Contact. Copy sections pin their text with a `sticky top-0 h-screen` child, so none of their ancestors may be `overflow-hidden`. Headings are Poppins medium in mixed case, rendered by the shared `CopyBlock` (eyebrow + title + body). It fades up once on first view; no scramble/glitch effects (the owner doesn't want them). Copy over the fibres uses `CopyBlock glass`: a clear Apple-style "liquid display" glass panel (`.liquid-glass` in `globals.css`: a milky-white body with blur + saturation and no darkening, so the fibres glow through; a masked 1.5px edge light all around, brightest at the top; inner edge glow for thickness; a specular sheen; a floating shadow; a soft text shadow). The owner wants this clear style, not frosted/smoked dark glass. Nested items use `.glass-tile` (glass-on-glass, e.g. the services list). Besides looking premium, it blurs out the thin diagonal fibres behind the text, which otherwise make straight text look tilted (the Zöllner illusion). Works and Contact sit on the plain background and don't use it.
- **Works** (`Works.tsx`): four video cards. Their files go in `public/works/work-1.mp4` … `work-4.mp4`; titles and categories in `WORKS` are placeholders. Each card slides in from the left, right or bottom via a scroll-set `--p` CSS var. Videos are muted, loop, and play only while at least 35% visible. A missing file shows a "Video coming soon" placeholder.
- **Contact** (`Contact.tsx`): details plus a form. There is no backend; submitting opens a `mailto:` with the enquiry filled in.
- **Chapter value `c`:** every `[data-chapter]` section is one chapter. `ScrollFlow` measures the sections' document tops (via `ResizeObserver`) into `layoutRef`. Each frame, `Driver` (a `useFrame` at priority -1) maps `window.scrollY` onto those tops, so `c = i` when section *i*'s top reaches the viewport top. Adding, removing or resizing a section shifts `c`, so retune `timeline.ts` when you do.
- **Smoothness rule:** Lenis already eases `scrollY` every frame, so `Driver` uses it as-is. Don't damp scroll again in the canvas (that caused lag). Scrolling never re-renders React. The Works cards' entrance is a CSS var (`--p`) set from a scroll listener.
- **`timeline.ts`** holds the world layout (`FAN_A`, `FAN_B`, `WALL_A`/`WALL_B`, `TAIL_X`) and the keyframe `track`s in `c` for the camera, each fan, the tail and the particles. `track` interpolates with smoothstep between keys. `evaluate()` writes everything into the shared mutable `FlowState`, which scene components read in `useFrame`.
- **The chain:** the scene runs along +x and the camera pans right.
  - **Hero fan:** `Fan` with `FAN_A` grows in on load. This is time-based (`load`), advanced by capped frame time so a shader-compile stall doesn't skip it.
  - **Wall:** on scroll its strand ends land on a wall of glowing dots (`uWall`).
  - **Fan B:** its trunk starts back at fan A's node and runs along fan A's centre strand, so it reads as one fibre continuing through wall A. The trunk is kept to about one strand's worth of light, with a glowing tip while it grows, and brightens into its node. It then fans out evenly up and down (`FAN_B`, no bend), and hits wall B.
  - **Tail:** the tail `Fibers` escape the same way fan B does: a dim thread from fan B's node (`uThreadX`) through wall B to a node, then one thick lilac thread that widens only slightly. For the thread-like shapes (escape, beam), each strand's light scales with the bundle width (`escapeEnvelope`/`beamEnvelope` ÷ `BUNDLE`), so the tight bundle reads as one thread instead of stacking into a white bar. The draw-in front is feathered per strand. The hourglass shows only an evenly spaced subset of strands (`hourglassLine`, `LINES` angles, with a `boostOf` colour gain) so it reads as distinct lines crossing into a lattice. They then morph through the shapes in `fiberShader.ts` (escape → beam → hourglass → scatter), with `tailRotZ` swinging the beam. Scatter is invisible, so the scene fades out before the Works videos. The tubes interlude and the radial burst were removed at the user's request.
- **Shaders:** fan and fibre positions are computed in vertex shaders (`fanShader.ts`, `fiberShader.ts`) from `t` along the strand plus a per-strand seed. The fan's wall dots use the same GLSL chunk evaluated at `t = 1`. In the tail, scatter has alpha 0, and morphs out of it fade in at the target shape rather than flying in.
- **Loading and fallbacks:** the canvas is loaded with `next/dynamic({ ssr: false })`. It uses drei `PerformanceMonitor` to drop the dpr (1.5 → 1) on slow devices, runs bloom at half resolution, and has a gradient `fallback` for when WebGL is missing. Under reduced motion there is no intro grow, no pointer parallax and no copy fade-in.
- **Lint rule:** React Compiler lint (`react-hooks/immutability`) forbids mutating `useMemo` values or props. Declare three objects in JSX (`<shaderMaterial args={[params]} ref={…}>`) and mutate them through refs. Name ref props `…Ref` so the compiler treats them as refs.

# Yexora IT Solutions — website

Marketing site for **Yexora IT Solutions** ([yexoraitsolutions.com](https://yexoraitsolutions.com)): a single scrolling page over a 3D fibre-light scene, with liquid-glass copy panels, a works reel and a contact form.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript, built as a **static site** (`output: "export"`)
- Tailwind CSS v4
- three.js via `@react-three/fiber`, `@react-three/drei` and `@react-three/postprocessing`
- Lenis smooth scrolling

There is no backend. The contact form opens the visitor's email app with the enquiry filled in.

## Local development

Needs Node.js 20 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # writes the static site to out/
```

To preview the production build locally, serve the `out/` folder with any static server, e.g. `npx serve out`.

## Where things live

| What | Where |
| --- | --- |
| Page sections (Hero, About, Principles, Services, Works, Contact) | `components/flow/sections.tsx` |
| Loading screen | `components/Loader.tsx`, `lib/loading.ts` |
| Services list | `components/flow/services.ts` |
| Works videos | `components/flow/Works.tsx` (`MEDIA_BASE`) |
| Contact details (email, phone, location) | `components/contact.ts` |
| Social links | `components/socials.tsx` |
| 3D scene and scroll timeline | `components/flow/FlowCanvas.tsx`, `components/flow/timeline.ts` |
| Site name, URL, description, theme colour | `lib/site.ts` |
| Page title and SEO / social tags | `app/layout.tsx` |
| Favicon / link-preview image | `app/favicon.ico`, `app/opengraph-image.png`, `app/twitter-image.png` (1200×630) |
| Section photos | `public/images/web/*.webp` (1280px WebP), listed in `components/flow/services.ts` |

`CLAUDE.md` has a detailed walkthrough of how the scene, timeline and components fit together.

To add a photo, convert it to a 1280px-wide WebP (about 100 KB) in `public/images/web/` and reference it with `projectImage("name")`. Large originals don't belong in `public/`: everything there is uploaded to the live site.

## Videos (Cloudflare R2)

The Works videos are **not** in this repo. They are served from the R2 bucket `yexora-media` (folder `videos/`) through the custom domain `media.yexoraitsolutions.com`:

- `https://media.yexoraitsolutions.com/videos/work1.mp4`
- `https://media.yexoraitsolutions.com/videos/work2.mp4`
- `https://media.yexoraitsolutions.com/videos/work3.mp4`

Each video also has a light version, about 10 MB, named with `-lite` (`work1-lite.mp4`, `work2-lite.mp4`, `work3-lite.mp4`). Phones, slow connections and low-end PCs play the light one; fast PCs play the full one and drop to light if it stutters. If a light file is missing, the full one is used.

To replace a video, upload a new file with the same name to the bucket. To add or rename one, update `WORKS` in `components/flow/Works.tsx`. Export videos as H.264 MP4 with "fast start" enabled so they begin playing before they finish downloading.

## Deploying to Cloudflare

`npm run build` produces a fully static site in `out/`, so it can be hosted for free on Cloudflare.

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository** and pick this GitHub repo.
2. Set:
   - **Build command:** `npm run build`
   - **Build output directory:** `out` (only asked for on Pages; Workers reads it from `wrangler.jsonc`)
   - **Deploy command** (Workers only): `npx wrangler deploy`
   - **Environment variable:** `NODE_VERSION` = `20` (or newer)
3. Deploy. Every push to `master` then redeploys automatically.
4. Under the project's **Custom domains**, add `yexoraitsolutions.com`. Also add `www.yexoraitsolutions.com` and redirect it to the apex domain (Rules → Redirect Rules), since the site's canonical URL has no `www`.
5. Recommended: in **Caching → Cache Rules**, add a rule for the hostname `media.yexoraitsolutions.com` set to *Eligible for cache*, so videos are served from Cloudflare's cache.

Files used by Cloudflare:

- `wrangler.jsonc`: Workers static-assets config (points at `out/`, uses `404.html` for unknown paths).
- `public/_headers`: security headers for every page, and one-year caching for Next's hashed files in `/_next/static/`.

If the domain ever changes, update `SITE_URL` in `lib/site.ts` (used for the canonical URL, social tags, `robots.txt` and `sitemap.xml`) and the preconnect in `app/layout.tsx`.

The old Netlify deploy can be turned off once Cloudflare is live. To keep it, set its publish directory to `out`.

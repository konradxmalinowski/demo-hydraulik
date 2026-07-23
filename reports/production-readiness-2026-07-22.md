# Production Readiness Report — demo-hydraulik
**Project:** demo-hydraulik (Angular 19 + SSR, portfolio demo, GitHub Pages)
**Audit Date:** 2026-07-22
**Auditor:** Production Readiness Auditor Agent
**Scope:** Focused review per `plans/2026-07-22-production-readiness.md`. Read-only, no files modified.

Covered: SEO (meta/OG/canonical/robots/sitemap), Core Web Vitals & performance (SSR, lazy loading, bundle size, images), PWA correctness (manifest, icons, service worker), accessibility (contrast, aria, focus, keyboard), console/runtime errors incl. SSR hydration, SPA routing on GitHub Pages (404.html, baseHref), `npm audit`, secrets, build/CI correctness.

Explicitly out of scope (per agreed plan): a real backend, GDPR/cookie consent, payments. Not flagged below.

Method: static source review, a full `ng build` (production config) with inspection of the generated `dist/demo-hydraulik/browser` output, and a live browser check (Chrome via MCP) of the built bundle served locally under the `/demo-hydraulik/` subpath to catch console/hydration errors and verify routing behavior.

---

## Executive Summary

The app builds cleanly, prerenders all 5 routes, hydrates without console errors, and has solid bones (SSR guards, semantic HTML, real form validation, PWA manifest/service worker, aria coverage). The most damaging issue is in `seo.service.ts`: every prerendered page ships `og:url`, `og:image`, and the LocalBusiness/FAQ JSON-LD pointing at `https://hydrofix-krakow.pl` — a domain the demo doesn't own and that isn't the real GitHub Pages URL — so social share previews and structured data are broken/wrong on every page. The `<link rel="canonical">` tag is also never updated per route, so all 5 prerendered pages carry the same canonical URL (the homepage), which is a duplicate-content signal to search engines. Neither issue would be caught by just glancing at `src/index.html`, since both only surface in the final built/prerendered HTML. Beyond that: prod dependencies carry a hydration-related Angular CVE that needs tracking, CI has no lint/test gate before deploy, and a couple of small accessibility/UX polish items (no Escape-key handling on the modal/mobile menu, no canonical-cleanup after the GitHub Pages 404 redirect).

### Score
- PASS: 8
- PARTIAL: 6
- FAIL: 2
- N/A: 0
- NEEDS REVIEW: 1

(17 checks total, scoped to the agreed audit dimensions rather than the full 87-item generic checklist.)

### Critical Blockers (must fix before treating this as "done")
None are launch-blocking in the sense of the site being broken for visitors — the app works end-to-end. But these two should be fixed before actively promoting the demo to prospects, since they directly undermine the "look how polished this is" pitch of a portfolio piece:
1. Wrong domain (`hydrofix-krakow.pl`) baked into OG tags and JSON-LD on every page — breaks link previews when the demo URL is shared on any platform.
2. Canonical tag never updated per route — every subpage claims to be a duplicate of the homepage.

---

## Detailed Findings

### SEO

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 1 | Title / meta description | PASS | — | `src/index.html` has a unique, keyword-relevant title and description; each route additionally sets a unique title/description via `SeoService.setPage()` (confirmed in prerendered output, e.g. `dist/.../kalkulator/index.html:5,7`). | None. |
| 2 | Open Graph / Twitter cards | FAIL | 🔴 CRITICAL | `src/app/core/services/seo.service.ts:14` hardcodes `const BASE_URL = 'https://hydrofix-krakow.pl'`, used to build `og:url`, `og:image`, `twitter:image` on every route via `setPage()`. Confirmed in built output: `dist/demo-hydraulik/browser/index.html:42` → `<meta property="og:url" content="https://hydrofix-krakow.pl/">`, and `kalkulator/index.html:42` → `https://hydrofix-krakow.pl/kalkulator`. The real deployed URL is `https://konradxmalinowski.github.io/demo-hydraulik/`. `src/index.html`'s static tags (lines 44-49) DO use the correct github.io URL, but `SeoService.setPage()` overwrites them at prerender time on every route including the homepage — so the shipped HTML is wrong everywhere, not just on subpages. Any social-media share of this demo will show a broken/foreign-domain link preview. | Change `BASE_URL` to `https://konradxmalinowski.github.io/demo-hydraulik` (or read it from an environment-specific constant so the same code works if a real domain is ever attached). Rebuild and verify `og:url`/`og:image` in the prerendered HTML match the live URL. |
| 3 | Canonical tag | FAIL | 🔴 CRITICAL | `SeoService.setPage()` never touches `<link rel="canonical">` — confirmed by `grep -rn "canonical" src/` returning only the static tag in `src/index.html:11`. Verified in build output: `dist/.../kalkulator/index.html:9` and `dist/.../galeria/index.html:9` both still read `<link rel="canonical" href="https://konradxmalinowski.github.io/demo-hydraulik/">` (the homepage URL), identical to the home page's own canonical. All 5 prerendered pages share one canonical value pointing at `/`. | Add canonical-link updates to `SeoService.setPage()` (e.g. via `Renderer2`/`DOCUMENT` to set/create the `<link rel="canonical">` element with the per-page URL, mirroring what's already done for `og:url`). Since pages are prerendered, this only needs to run once per route at build time — no client-side-only fix needed. |
| 4 | JSON-LD structured data | PARTIAL | 🟠 HIGH | `injectLocalBusinessJsonLd()` (`seo.service.ts:60-129`) produces valid LocalBusiness + FAQPage schema, but every `url`, `@id`, and `logo` field uses the same wrong `BASE_URL` (`hydrofix-krakow.pl`) described above. Additionally `logo: `${BASE_URL}/assets/icons/logo.svg`` (`seo.service.ts:73`) points at a file that doesn't exist anywhere in the repo (actual icons are `public/icons/icon-*.png`, no `logo.svg`, no `/assets/icons/` path at all). | Fix once `BASE_URL` is corrected (item 3 above fixes url/@id). Separately, either add a real `logo.svg` under `public/assets/icons/` or point `logo` at an existing asset (e.g. `favicon.svg`). |
| 5 | robots.txt | PASS | — | `public/robots.txt` (mirrored via `src/robots.txt` in `angular.json` assets config, lines 36-40) allows all crawlers and correctly references the sitemap at the real github.io URL. Confirmed present in build output at `dist/.../robots.txt`. | None. |
| 6 | sitemap.xml | PASS | — | `public/sitemap.xml` lists all 5 real routes with correct real-domain URLs, present in build output. Consistent with `robots.txt`'s Sitemap directive. | None (optional: add `<lastmod>` dates for freshness signals). |
| 7 | Social preview image format | PARTIAL | 🟡 MEDIUM | `og-image.svg` is an SVG (`public/og-image.svg`, 1200×630, correct OG aspect ratio). Facebook/LinkedIn's crawlers do not reliably render SVG for `og:image` (only JPG/PNG/GIF/WEBP are officially supported), so previews on those platforms may show no image even after the URL bug above is fixed. Twitter/X support is inconsistent too. | Export a static PNG (1200×630) version of the OG image and reference that in `og:image`/`twitter:image` instead of the SVG. Keep the SVG only for non-OG uses if any. |

### Core Web Vitals / Performance

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 8 | SSR / prerendering configured correctly | PASS | — | `angular.json` production config has `"prerender": true` and `"ssr": {"entry": "src/server.ts"}`. A real `ng build` run (see Evidence Log) produced `Prerendered 5 static routes.` matching all 5 routes in `app.routes.ts`, each with correct per-route `<title>`/description baked in. Since GitHub Pages only serves static files, the Express/`server.ts` SSR path is dead code for the actual deployment (only `dist/demo-hydraulik/browser` is uploaded per `deploy.yml:29`) — but that's fine because prerendering already produces static HTML per route, which is exactly what's needed for a static host. | None for the GH Pages deployment. If `server.ts`/Express is not going to be used anywhere (no Node hosting target), consider removing `express`/`@angular/ssr` server bits from the shipped bundle to shrink `npm ci` and the audit surface — optional, low priority. |
| 9 | Lazy loading | PASS | — | All 4 non-home routes use `loadComponent: () => import(...)` (`app.routes.ts:10-33`), confirmed as separate lazy chunks in the build output (`chunk-QXNNBTO6.js` home-component, `chunk-ADWBHOSW.js` contact-component, etc., 6-20KB each). Gallery/before-after images use `loading="lazy"` (`before-after-slider.component.ts:84,92`). | None. |
| 10 | Bundle size | PASS | — | Production build: initial bundle 419.92 kB raw / **116.63 kB gzipped**, well under the `angular.json` budget (`500kB` warning / `1MB` error, lines 63-67) and under the general ~200KB-gzip guideline for a marketing site. Lazy chunks are all 2-8KB gzipped. | None. |
| 11 | Image optimization | PARTIAL | 🟡 MEDIUM | Gallery before/after images are hotlinked directly from `images.unsplash.com` (`src/app/data/gallery.data.ts:14,21-76`) with a single fixed `w=1200&q=80` regardless of viewport — mobile clients download the same 1200px-wide image as desktop (no responsive `srcset`/`sizes`, no Angular `NgOptimizedImage`). Format negotiation (webp/avif) is handled by Unsplash's `auto=format` param, which is good, but this also makes the gallery — a core showcased feature — dependent on a third-party CDN staying available and those specific photo IDs never being taken down. Confirmed loading with a live browser check: all 12 images returned HTTP 200. PWA icons (`public/icons/*.png`) are correctly sized (192×192, 512×512, 512×512 maskable — verified via `file`). | Serve gallery images self-hosted (or via a CDN you control) with 2-3 responsive widths (e.g. 480/800/1200) and `srcset`/`sizes`, or adopt `NgOptimizedImage` for the `<img>` tags. Lower priority than the SEO fixes since this is a demo, but worth doing before treating the gallery as "production-grade." |
| 12 | Console errors / SSR hydration mismatches | PASS | — | Live-browser check (Chrome via MCP) of the production build served under `/demo-hydraulik/`: navigated Home, Kalkulator, Galeria, FAQ, Kontakt — zero application console errors or Angular hydration warnings (only irrelevant Chrome-extension noise). Source-level check confirms all `window`/`document`/`localStorage`/`navigator` access outside injected `DOCUMENT` is guarded by `isPlatformBrowser(this.platformId)` (e.g. `navbar.component.ts:174,185,193,202,209,219`), which is exactly the pattern that prevents SSR/hydration mismatches. `provideClientHydration(withEventReplay())` is configured in `app.config.ts:14`. | None. |

### PWA

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 13 | manifest.webmanifest validity | PASS | — | `public/manifest.webmanifest` has all required fields (`name`, `short_name`, `start_url`, `scope`, `display: standalone`, `background_color`, `theme_color`) and is correctly linked from `src/index.html:18`. | None. |
| 14 | Icon completeness | PASS | — | Manifest declares 192×192, 512×512, and a 512×512 `maskable` icon; verified all three PNGs on disk match their declared dimensions exactly (`file` output). This satisfies Lighthouse's PWA installability icon requirements. `apple-touch-icon` uses the 192px icon (`index.html:20`) rather than the iOS-preferred 180×180, which is a cosmetic nitpick, not a functional gap. | Optional: add a dedicated 180×180 `apple-touch-icon` for pixel-perfect iOS home-screen rendering. Low priority. |
| 15 | Service worker offline behavior | PASS | — | `public/sw.js` is registered correctly and defensively in `src/main.ts:9-14` (guarded by `'serviceWorker' in navigator && !isDevMode()`, registered on `window.load`, relative path resolves correctly against `<base href>` for the GH Pages subpath). Strategy is sound: navigations are network-first with cached-shell fallback (`sw.js:27-38`), other same-origin GET assets are cache-first with background refresh (`sw.js:41-54`), and `activate` purges old cache versions and calls `clients.claim()`. This gives genuine offline reload capability for previously-visited pages, not just an installable-but-non-functional manifest. | None required. Minor robustness note: the cache name `demo-hydraulik-v1` (`sw.js:1`) is not bumped per deploy, so a purely offline user could keep an old shell after a release until they go online once — acceptable tradeoff for a demo site, not worth extra complexity here. |

### Accessibility

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 16 | ARIA / semantic HTML / alt text | PASS | — | Good aria coverage across the app: `aria-label`, `aria-hidden`, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-checked`, `aria-describedby` used appropriately in `navbar` (14 occurrences), `contact` (12), `faq` (8), `emergency-button` (4), `calculator` (4), `gallery` (3). All `<img>` tags have real, descriptive `alt` text (e.g. `before-after-slider.component.ts:82,89`). Semantic structure is correct: `<nav>`, `<main>`, `<footer>` used (`app.component.html`, `navbar.component.ts:36`, `footer.component.ts:14`) rather than generic divs. | None. |
| 17 | Keyboard operability (modal / mobile menu) | PARTIAL | 🟡 MEDIUM | `demo-modal.component.ts` renders a proper `role="dialog" aria-modal="true" aria-labelledby="demo-modal-title"` (lines 46-48), but there is no keydown handler anywhere in the codebase (`grep -rn "Escape\|keydown" src/app` returns nothing) — the modal cannot be dismissed with the Escape key, only by clicking the backdrop or the close button, and it doesn't move focus into itself on open. Same gap applies to the mobile nav drawer (`navbar.component.ts:199-212`, `toggleMobileMenu`/`closeMobileMenu`) — no Escape-to-close. This is a standard WAI-ARIA dialog-pattern expectation that's currently missing. | Add a `@HostListener('document:keydown.escape')` (or equivalent) to both `DemoModalComponent` and the mobile menu state in `NavbarComponent` to close on Escape, and move focus to the dialog/close button on open, returning focus to the trigger on close. |

### Runtime / Routing (GitHub Pages)

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 18 | baseHref handling | PASS | — | `src/index.html:13` has `<base href="/">` for local dev; the production build config sets `"baseHref": "/demo-hydraulik/"` (`angular.json:62`). Verified in the actual `ng build` output: `dist/demo-hydraulik/browser/index.html:11` correctly reads `<base href="/demo-hydraulik/">`, and asset/script references resolve correctly when served under that subpath (confirmed live in browser: JS/CSS/images all loaded, no 404s). | None. |
| 19 | 404.html deep-link handling on GitHub Pages | PARTIAL | 🟢 LOW | `public/404.html` uses the standard rafgraph SPA-GitHub-Pages redirect trick (`pathSegmentsToKeep = 1`, correct for a project site under `/demo-hydraulik/`), redirecting an unknown path to `/demo-hydraulik/?/<original-path>`. However, `src/index.html` contains **no** matching decode script to parse that `?/`-encoded segment and restore the real URL via `history.replaceState` (confirmed absent via full read of `index.html` and the built output). Live-browser test confirms the practical impact: navigating to a nonexistent deep link and following the resulting redirect lands the user on the working home page (Angular's wildcard route `{ path: '**', redirectTo: '' }` in `app.routes.ts:35` saves it from actually breaking) — but the address bar is left showing an ugly, permanent `?%2F<path>=` query string instead of a clean URL. Not a functional break, but unpolished for a portfolio piece meant to demonstrate craft. Note: this only matters for paths the prerenderer didn't generate — the 5 real routes (`/kalkulator`, `/galeria`, `/faq`, `/kontakt`, `/`) each have their own prerendered `index.html` on GitHub Pages and are served directly without ever touching `404.html`. | Either add the small companion decode script to `src/index.html` (standard rafgraph snippet, ~10 lines) to clean up the URL after redirect, or — simpler given there are only 5 static routes — drop the 404.html redirect trick entirely and let genuinely unknown paths show GitHub's default 404 page, since Angular's wildcard route already handles in-app navigation to unknown paths gracefully. |

### Dependencies / Secrets / CI

| # | Check | Status | Severity | Finding | Recommendation |
|---|-------|--------|----------|---------|-----------------|
| 20 | `npm audit` — production dependencies | PARTIAL | 🟠 HIGH | `npm audit --omit=dev`: **11 vulnerabilities (9 high, 1 moderate, 1 low)**, all rooted in `@angular/core <=19.2.25` and its dependents (`@angular/common`, `@angular/router`, `@angular/platform-browser`, `@angular/platform-server`, `@angular/ssr`, `@angular/compiler`). Most notable: **"Angular Client Hydration DOM Clobbering & Response-Cache Poisoning"** (GHSA-rgjc-h3x7-9mwg, high) — directly relevant since this app uses `provideClientHydration()`. Also `@angular/compiler` XSS via two-way binding sanitization bypass (moderate, GHSA-58w9-8g37-x9v5), and `body-parser <1.20.6` DoS via invalid limit value (low, only exercised if `server.ts`/Express is ever actually run, which it isn't on GH Pages). `npm audit fix` alone won't resolve the Angular-core issues — the fix requires the Angular 19→21 major upgrade path (`isSemVerMajor: true` in the audit output). | Schedule an Angular major-version upgrade (19→20 or 19→21) using `ng update`, testing SSR/hydration behavior afterward given the vulnerability is hydration-specific. Not an emergency for a public demo with no user data, but worth fixing before this is held up as a "production-ready" reference build. Run `npm audit fix` now for the low-risk `body-parser` bump in the meantime. |
| 21 | `npm audit` — dev dependencies | PARTIAL | 🟡 MEDIUM | 29 additional vulnerabilities (incl. 1 critical: `node-tar` arbitrary file write, and several `vite`/`webpack-dev-server`/`ws` DoS issues) live entirely in build tooling (`@angular-devkit/build-angular`, `@angular/cli` and their transitive deps) — not shipped to the browser bundle, so no runtime/user exposure. Still relevant as supply-chain risk for anyone running `npm install`/`ng build` on this repo. | Lower priority than item 20. Will largely resolve alongside the Angular major-version upgrade; otherwise track via `npm audit` periodically. |
| 22 | Secrets in repo | PASS | — | No `.env` files found anywhere in the repo. Grepped `src/`, `public/`, and top-level config/JSON files for API-key/secret/password/token patterns and common credential formats (AKIA keys, PEM headers) — no matches. The only "credentials" present are the intentionally fictional demo business phone/email/address in `seo.service.ts:17-19` (`+48 123 456 789`, `kontakt@hydrofix-krakow.pl`), which is expected placeholder content for a portfolio demo, not a leaked secret. `.gitignore` is otherwise standard and appropriate for an Angular project. | None. |
| 23 | Build & CI/CD correctness (`deploy.yml`) | PARTIAL | 🟡 MEDIUM | `deploy.yml` is otherwise well-formed: correct Node 24 + npm cache, `npm ci` (reproducible install), builds with the production config (baseHref bake-in confirmed), uploads only the `browser/` static output via `actions/upload-pages-artifact@v3`, and deploys via the official `actions/deploy-pages@v4` action with proper `pages`/`id-token` permissions and concurrency guard. However, the pipeline is `install → build → deploy` with **no lint and no test step** — there's no `eslint.config.js` in this project (unlike the stated portfolio convention) and no `lint`/`test` script wired into `package.json`, and the two existing spec files (`app.component.spec.ts`, `calculator.signals.spec.ts`) never run in CI. A build that type-checks and compiles can still ship a broken interaction (e.g. the calculator's pricing logic) with nothing catching it before it's live. | Add an ESLint flat config (matching the other portfolio projects' convention) plus a `lint` script, and add a `test`/`ng test --watch=false --browsers=ChromeHeadless` step to `deploy.yml` before the build step, so a red test or lint error blocks deployment. Given this is a demo site the urgency is lower than for the flagship app, but it's cheap to add and keeps the portfolio's story ("I test what I ship") consistent. |
| 24 | Production/demo mode separation | NEEDS REVIEW | — | `demo-mode.interceptor.ts` and `demo-mode.service.ts` exist to simulate "demo mode" behavior (the contact form is mocked, no real backend call happens). This is correct by design per the agreed scope, but I did not exhaustively trace every interceptor branch for edge cases (e.g. whether a slow/failed simulated request path leaves any UI stuck). Functional testing of the mocked flows end-to-end was out of scope for a static/build-level audit. | If a functional QA pass is wanted later, exercise the calculator and contact form's mocked submit paths manually (or with the `qa`/`browse` skill) to confirm loading/error states resolve correctly. Not a finding, just a boundary of this audit's method. |

---

## Action Plan

### Fix Soon (before actively sharing/promoting the demo)
1. **Fix `BASE_URL` in `seo.service.ts:14`** — point OG tags and JSON-LD at the real `https://konradxmalinowski.github.io/demo-hydraulik` URL instead of the fictional `hydrofix-krakow.pl`. Rebuild and grep the output to confirm. — ~15 min.
2. **Set canonical link per route in `SeoService.setPage()`** — currently only `og:url` is updated; add the actual `<link rel="canonical">` element update so each of the 5 prerendered pages has its own correct canonical instead of all pointing at the homepage. — ~30 min.
3. **Fix or remove the broken `logo` JSON-LD field** (`seo.service.ts:73`, points at a nonexistent `/assets/icons/logo.svg`). — ~10 min.

### High — Fix in the Next Pass
4. **Track the Angular hydration CVE** (GHSA-rgjc-h3x7-9mwg) — plan an Angular 19→20/21 upgrade via `ng update`; retest SSR/hydration after. — a few hours, needs its own regression pass.
5. **Export a PNG version of the OG image** (`og-image.svg` → `og-image.png`, same 1200×630) for reliable Facebook/LinkedIn preview rendering. — ~15 min.

### Medium — Next Sprint / Polish
6. Self-host or responsively size the gallery images (replace fixed `w=1200` Unsplash hotlinks with `srcset`/`NgOptimizedImage`). — ~1-2 hrs.
7. Add Escape-key handling (and basic focus management) to `DemoModalComponent` and the mobile nav drawer in `NavbarComponent`. — ~1 hr.
8. Add ESLint config + a `lint`/`test` gate to `deploy.yml` before build. — ~1 hr.
9. Run `npm audit fix` for the low-risk `body-parser` bump now, independent of the larger Angular upgrade. — ~5 min.

### Low — Backlog
10. Add the rafgraph URL-decode companion script to `src/index.html` (or drop the 404.html redirect trick given only 5 static routes exist). — ~20 min.
11. Add a dedicated 180×180 `apple-touch-icon`. — ~10 min.

---

## Evidence Log

- `plans/2026-07-22-production-readiness.md`, `README.md` — scope and feature context.
- `src/index.html`, `angular.json`, `package.json`, `.github/workflows/deploy.yml` — full reads.
- `public/404.html`, `public/manifest.webmanifest`, `public/sw.js`, `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/icons/*.png` (verified via `file`) — full reads / inspection.
- `src/app/app.routes.ts`, `src/app/app.config.ts`, `src/app/app.config.server.ts`, `src/main.ts`, `src/main.server.ts`, `src/server.ts` — full reads.
- `src/app/core/services/seo.service.ts` — full read; root cause of the two critical SEO findings.
- `src/app/data/gallery.data.ts` — full read; source of the Unsplash hotlink finding.
- `src/app/shared/components/before-after-slider/before-after-slider.component.ts`, `demo-modal/demo-modal.component.ts`, `navbar/navbar.component.ts` — full/partial reads for a11y and hydration-safety checks.
- `src/app/app.component.html` — semantic shell check.
- Ran `npm run build` (production config) in the actual project — full log captured; confirms bundle sizes, "Prerendered 5 static routes."
- Inspected `dist/demo-hydraulik/browser/**` directly: `index.html`, `kalkulator/index.html`, `galeria/index.html` — confirmed baseHref replacement, per-route title/description, and the wrong-domain OG/JSON-LD values as shipped.
- Ran `npm audit` (full) and `npm audit --omit=dev` — captured JSON output for severity/CVE breakdown.
- Searched for secrets: `grep -rniE "api[_-]?key|secret|password|token|AKIA[0-9A-Z]{16}|-----BEGIN"` across `src/`, `public/`, top-level config — no matches; confirmed no `.env*` files in repo.
- Searched for `console.log`/`debugger`/`TODO`/`FIXME` leftovers — none found.
- Searched for unguarded `window`/`document`/`localStorage`/`navigator` usage outside `isPlatformBrowser` guards — none found (all properly guarded).
- Searched for `aria-`, `role=`, `tabindex`, `focus:`, `Escape`/`keydown` usage across `src/app/**/*.ts` — basis for the a11y findings.
- Live browser verification (Chrome via `claude-in-chrome` MCP): served `dist/demo-hydraulik/browser` locally under a `/demo-hydraulik/` subpath (via a symlinked directory + `python3 -m http.server`) to accurately simulate the GitHub Pages path structure. Navigated Home, Kalkulator, Galeria, FAQ, Kontakt, a nonexistent deep link, and the raw `?/`-redirect URL; read console messages (no app errors/hydration warnings) and network requests (all Unsplash gallery images returned HTTP 200); tested the mobile viewport and mobile nav drawer via screenshots.

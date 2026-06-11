# CLAUDE.md — demo-hydraulik

Context for AI agents working in this repository.

## What this is

A portfolio demo website for a plumber / 24-7 emergency plumbing service, part of
Konrad Malinowski's freelance portfolio (http://konrad.malinowski.ct8.pl). Mock data
only — there is **no real backend**; the price calculator and service-area logic run
client-side.

- **Live demo:** https://konradxmalinowski.github.io/demo-hydraulik/
- Site copy is in **Polish** (target audience: Polish local businesses).

## Stack

- Angular 19 + TypeScript (standalone components)
- Angular Signals for reactive state (no BehaviorSubject)
- Angular SSR (`@angular/ssr` + Express) for indexing and LCP
- Tailwind CSS 3 for styling
- Karma + Jasmine for tests

## Commands

```bash
npm install
npm start                          # ng serve → http://localhost:4200
npm run build                      # ng build → dist/
npm test                           # ng test (Karma + Jasmine)
npm run serve:ssr:demo-hydraulik   # node dist/demo-hydraulik/server/server.mjs
```

## Structure

```
src/app/
├── core/       # Singleton services, app-wide logic
├── features/   # Feature views (Home, Services, Gallery, Contact)
├── shared/     # Reusable components, pipes, directives
└── data/       # Mock data (services, pricing, gallery)
```

## Conventions & constraints

- Use Signals for state — do not introduce BehaviorSubject-based patterns.
- Mock data only — do not add real API calls or backends; this is a showcase.
- Core Web Vitals matter: SSR + lazy loading are deliberate; keep them intact.
- Deployed to GitHub Pages under the `/demo-hydraulik/` base path — keep asset URLs base-aware.
- Conventional Commits, English, imperative mood.

# Production readiness - demo-hydraulik

## Kontekst

Statyczne demo portfolio (Angular 19 + TS + SSR), bez backendu, deployowane na GitHub Pages
przez `.github/workflows/deploy.yml` (bundle z `dist/demo-hydraulik/browser`). Ten sam audyt
uruchamiany równolegle dla demo-fryzjer, demo-hydraulik, demo-mechanik, demo-restauracja -
z tym samym zakresem kryteriów, żeby portfolio było spójne.

## Zakres (ustalony z użytkownikiem)

"Production readiness" = polish demówki jako portfolio, BEZ dodawania prawdziwego
backendu (kalkulator wyceny / formularz kontaktowy zostają frontendowe/mockowane).
W zakresie:

- SEO: meta tagi (title, description, OG/Twitter cards), canonical, robots.txt, sitemap.xml
- Core Web Vitals / wydajność (SSR poprawnie skonfigurowane, lazy loading, rozmiar bundle, obrazy)
- PWA: manifest.json poprawny, ikony w komplecie, service worker działa offline
- Dostępność (a11y): kontrast, aria, focus states, nawigacja klawiaturą
- Błędy konsoli / warningi w runtime (w tym błędy hydratacji SSR)
- Routing SPA na GitHub Pages (404.html redirect, deep links, baseHref /demo-hydraulik/)
- `npm audit` - podatności w zależnościach
- Brak sekretów / danych wrażliwych w repo
- Poprawność builda i CI/CD (deploy.yml)

Poza zakresem: prawdziwy backend, GDPR/cookie consent (brak trackingu/PII), płatności.

## Etapy

1. **Audyt** - production-readiness-auditor analizuje apkę wg powyższej listy,
   zapisuje wyniki do `reports/production-readiness-2026-07-22.md`. Read-only, brak zmian w kodzie.
2. **Plan napraw** - na podstawie znalezisk, orchestrator (główna sesja) uzupełnia ten
   plik o konkretne zadania napraw, priorytetyzowane, z podziałem na agentów.
3. **Delegacja napraw** - frontend-agent / seo-agent / security-agent-sonnet / docs-agent,
   w zależności od kategorii znaleziska.
4. **Review + start apki + testy** - zgodnie ze standardowym workflow (Step 6-8).
5. **Commit** - automatyczny po przejściu review/test/security, bez push bez zgody użytkownika.

## Wyniki audytu

Pełny raport: `reports/production-readiness-2026-07-22.md`. 8 PASS / 6 PARTIAL / 2 FAIL / 1 NEEDS REVIEW.

## Decyzje użytkownika

- **Angular upgrade 19→21**: TAK, zrobić teraz, żeby usunąć realne CVE (hydration DOM clobbering, GHSA-rgjc-h3x7-9mwg, CVSS 6.1) w `@angular/core`. Przetestować SSR/hydrację po upgrade na wszystkich 5 route'ach.
- **ESLint + CI gate**: TAK, dodać pełną konfigurację ESLint (spójną z fryzjerem/restauracją, `@angular-eslint`) + krok lint/test w `deploy.yml`.
- **Self-hosting obrazów**: TAK, zrobić teraz (galeria before/after z Unsplash).

## Zadania do wykonania (zaakceptowane)

### Critical
1. Naprawić `BASE_URL` w `seo.service.ts:14` - z fikcyjnej `hydrofix-krakow.pl` na prawdziwy `https://konradxmalinowski.github.io/demo-hydraulik`. Przebudować i zweryfikować w wygenerowanym HTML.
2. Dodać aktualizację `<link rel="canonical">` per route w `SeoService.setPage()` (obecnie tylko `og:url` jest aktualizowany, canonical zawsze wskazuje na homepage).
3. Naprawić/usunąć błędne pole `logo` w JSON-LD (`seo.service.ts:73`, wskazuje na nieistniejący plik).

### High
4. Angular upgrade 19→21 (`ng update`) - usuwa CVE hydration. Przetestować SSR/hydrację po.
5. Wyeksportować `og-image.svg` do PNG 1200x630.

### Medium
6. Self-hosting/responsywne rozmiary obrazów galerii before/after (zamiast hotlink Unsplash `w=1200`) - WebP, srcset.
7. Dodać obsługę klawisza Escape + zarządzanie fokusem do `DemoModalComponent` i mobilnego menu w `NavbarComponent`.
8. Dodać ESLint (`@angular-eslint`) + krok lint/test w `deploy.yml` przed buildem.
9. `npm audit fix` dla `body-parser` (bezpieczne, niezależne od dużego upgrade'u).

### Low
10. Dodać skrypt dekodujący URL po przekierowaniu 404 (rafgraph companion script) w `src/index.html`, albo usunąć trick z `404.html` skoro Angular wildcard route i tak łagodzi problem - zdecydować przy implementacji, prostsze rozwiązanie preferowane.
11. Dodać dedykowaną ikonę `apple-touch-icon` 180x180.

## Status

- [x] Audyt wykonany
- [x] Plan napraw uzupełniony i zaakceptowany przez użytkownika
- [x] Naprawy zaimplementowane (wszystkie 11 zadań, patrz raport frontend-agenta)
- [ ] Review + testy + security przeszły
- [ ] Commit

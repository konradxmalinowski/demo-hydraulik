# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-07-28

### Fixed
- Kalkulator Wyceny: replaced ad-hoc Tailwind blue/green colors with the app's actual `hydraulik-navy`/`hydraulik-steel` brand tokens throughout - selected service card, hours slider, form focus rings, price rows, total, and status indicator.
- Missing `dark:` text-color variant on the selected service card, which caused a contrast bug in dark mode.

## [0.1.0] - 2026-07-24

### Added
- AI-crawler policy in `robots.txt`, grouping retrieval bots (ChatGPT-User, OAI-SearchBot, PerplexityBot, Claude-User, Claude-Web) separately from training-data crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, Bytespider, Amazonbot, Applebot-Extended, cohere-ai, Meta-ExternalAgent), all explicitly allowed.
- `llms.txt` page index listing Home, Price calculator, Gallery, FAQ, and Contact with a one-line description of each, plus a note that the business/contact details on the site are fictional demo data.

### Fixed
- Structured data (JSON-LD): corrected the schema.org type used for the business to `Plumber`, and scoped the `FAQPage` markup to the FAQ page instead of applying it site-wide.
- SSR incremental hydration: added `withIncrementalHydration()` so `@defer (hydrate on ...)` blocks render real content during SSR/prerender instead of a placeholder, making deferred sections visible to crawlers and non-JS agents.
- ARIA roles/attributes on the price calculator (radiogroup for step options, progressbar for step progress) for screen readers and browser-using agents.
- Deduplicated `robots.txt` and `sitemap.xml`, which previously existed in both `src/` and `public/` with diverging content; both now live only in `public/`.

[Unreleased]: https://github.com/konradxmalinowski/demo-hydraulik/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/konradxmalinowski/demo-hydraulik/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/konradxmalinowski/demo-hydraulik/releases/tag/v0.1.0

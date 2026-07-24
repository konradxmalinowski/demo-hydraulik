# LLM / AI-agent accessibility - demo-hydraulik

## Problem summary
Audit and fix how accessible this site is to AI crawlers and browser-using agents. This is not SEO ranking (separate concern, seo-agent's job) - it is whether AI crawlers, chat assistants, and browser-using agents can actually reach, parse, and act on the content at all. Covers: AI crawler / robots.txt policy for named bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, ChatGPT-User, etc., with the training-vs-retrieval distinction), llms.txt correctness, content readability without JS execution (this app already has Angular SSR via @angular/ssr and src/server.ts, so this should mostly be a verification item, not a build from scratch), semantic HTML, structured data / entity clarity, API/MCP discoverability (not applicable - no public API), browser-agent usability (labeled interactive elements, no unnecessary CAPTCHA, working quote-calculator and emergency-contact flow), citation/attribution readiness.

Acceptance criteria: agent produces a prioritized findings report; every actionable finding is implemented (user has approved implementing everything the agent proposes).

## Task shape and scale
One task (LLM-accessibility audit + fix) applied identically across 4 independent portfolio demo repos (demo-fryzjer, demo-hydraulik, demo-mechanik, demo-restauracja - separate GitHub repos, separate git histories). Each repo is audited and fixed independently by its own llm-accessibility-agent instance running in parallel. Steps 6-10 (review, verify, docs) run per repo, in parallel where independent.

## Deviation from default workflow
- No CLAUDE.md exists in this repo (deliberately removed - see commit "chore: remove CLAUDE.md"). README.md is used as the per-project context source instead.
- No feature-flag system detected - feature-flag question is not raised.
- No CHANGELOG.md / real version field existed before this change (package.json had a placeholder "0.0.0"). Per explicit user decision, this task introduces CHANGELOG.md (Keep a Changelog format) and bumps the version to 0.1.0 as part of Step 10.

## Affected layers
Frontend only - static assets (robots.txt, llms.txt), index.html, semantic HTML/ARIA in src/, structured data (JSON-LD), SSR verification (server.ts, app.config.server.ts).

## Implementation sequence
1. llm-accessibility-agent audits: robots.txt, llms.txt, verify SSR actually renders full content server-side (no client-only gaps), semantic HTML, structured data, browser-agent usability (quote calculator, emergency contact button, area map), forms.
2. Agent reports findings with severity, then implements all actionable findings directly.
3. Code review (Step 6) on the changed files.
4. Build and verify (Step 7) - confirm SSR output includes the fixed content (e.g. curl the SSR-rendered HTML directly, not just the browser DOM).
5. Docs (Step 10): update README.md if user-facing setup changed; add CHANGELOG.md and bump package.json version 0.0.0 -> 0.1.0.

## Edge cases to address
- Existing robots.txt/llms.txt already present - agent must review and refine, not blindly overwrite.
- SSR output must be checked directly (curl/view-source), not assumed correct just because SSR is configured.
- PWA service worker must not intercept or block crawler/agent requests to content.
- Emergency/quote-calculator flow must remain usable by browser-agents (labeled inputs, no CAPTCHA blocking legitimate flows).

## Agent delegation plan
- llm-accessibility-agent: owns the entire repo (public/, index.html, src/ where relevant to rendering/semantic HTML/structured data, robots.txt, llms.txt, SSR config). Runs in parallel with three other llm-accessibility-agent instances covering demo-fryzjer, demo-mechanik, demo-restauracja - disjoint file sets (separate git repos), no conflict possible.
- Branching/PR: feature branch feat/llm-accessibility (already created), commit directly on this branch, push and open a PR only after explicit user approval.

## Feature-flag decision
Not applicable - no feature-flag system detected in this repo.

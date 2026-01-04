---
project_name: 'portfolio'
user_name: 'Dongminyu'
date: '2026-01-04T11:45:07+09:00'
sections_completed:
  [
    'technology_stack',
    'language_rules',
    'framework_rules',
    'testing_rules',
    'quality_rules',
    'workflow_rules',
    'anti_patterns',
  ]
existing_patterns_found: 7
status: 'complete'
rule_count: 48
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Next.js 16.1.1 (App Router)
- React 19.2.3 + React DOM 19.2.3
- TypeScript 5.9.3
- Tailwind CSS 4.1.18 + @tailwindcss/postcss 4.1.18
- ESLint 9.39.2 + eslint-config-next 16.1.1 + @next/eslint-plugin-next 16.1.1
- Prettier 3.7.4 + prettier-plugin-tailwindcss 0.7.2
- UI: Radix UI (react-select 2.2.6, react-tooltip 1.2.8, react-navigation-menu 1.2.14), Headless UI 0.2.1
- Utils: date-fns 4.1.0, clsx 2.1.1, tailwind-merge 3.4.0, lucide-react 0.562.0
- API: @octokit/core 7.0.6
- Automation: Puppeteer 24.34.0 (preview scripts)

## Critical Implementation Rules

### Language-Specific Rules

- TypeScript strict mode enabled (strict, noImplicitAny, strictNullChecks): avoid implicit any and keep explicit typing.
- noUnusedLocals / noUnusedParameters / noImplicitReturns / noFallthroughCasesInSwitch enabled: remove unused and avoid missing returns.
- moduleResolution: "bundler" + module: "esnext": keep ESM import/export (avoid require in app code).
- noEmit + isolatedModules: true: typecheck-only; ensure each file is a valid module.
- Path alias "@/_" maps to "src/_" (prefer alias over deep relatives).
- allowJs: false: add new sources in TS/TSX only.

### Framework-Specific Rules

- App Router only: manage pages/layouts under "src/app".
- Route Handlers live at "src/app/api/\*\*/route.ts".
- For dynamic API data, keep `export const dynamic = "force-dynamic"` and `export const revalidate = 0`.
- Client components must declare `'use client';` at the top of the file.
- Root layout should keep single global CSS entry: `import "../globals.css";`.
- Add new remote image sources to `images.remotePatterns` in `next.config.js`.

### Testing Rules

- Use Vitest + React Testing Library for unit/component tests (jsdom).
- Tests live under `src/test/**` as `*.test.ts`/`*.test.tsx`.
- `src/test/setup.ts` registers `@testing-library/jest-dom` matchers.
- Run via `yarn test` (CI), `yarn test:watch` (local), or `yarn test:coverage` for coverage.

### Code Quality & Style Rules

- ESLint uses Next.js recommended + core-web-vitals; keep simple-import-sort enforced for import/export order.
- Prettier config: single quotes, semicolons, printWidth 100, tailwindcss plugin; format via `yarn format`.
- 2-space indentation throughout.
- Naming: folders kebab-case, components PascalCase.
- Use `cn` from `src/lib/utils` to merge Tailwind classes (clsx + tailwind-merge).
- Tailwind v4 tokens/utilities live in `src/globals.css` via `@theme`/`@utility`.

### Development Workflow Rules

- Use Yarn scripts for dev/build/start/lint/format/check-type.
- Commit messages follow Conventional Commits.
- PRs for UI changes include a summary and screenshots.
- Copy `.env.sample` to `.env`; never commit secrets.
- Use `yarn update:png` / `yarn update:pdf` for preview images and resume PDF updates.

### Critical Don't-Miss Rules

- Keep `trailingSlash: true` unless intentionally changing routing/hosting behavior.
- `images.unoptimized: true` is a project decision; change only with a deliberate image pipeline update.
- `/api/resume` serves the latest file in `public/resume/` by mtime; replace the file to update the download.
- `removeConsole` strips logs in production; do not rely on `console.*` for prod behavior.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when the technology stack or patterns change.
- Review periodically and remove outdated rules.

Last Updated: 2026-01-04T11:45:07+09:00

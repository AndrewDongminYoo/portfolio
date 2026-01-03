# Repository Guidelines

## Project Structure & Module Organization

- `src/app`: Next.js App Router pages, layouts, and route handlers.
- `src/components`, `src/features`, `src/hooks`, `src/lib`: shared UI, feature modules, hooks, and utilities.
- `src/globals.css`: global styles and Tailwind layers.
- `public/`: static assets served at the site root.
- `assets/` and `data/`: local content and metadata used by the UI.
- `scripts/`: one-off utilities (e.g., resume PDF and preview generation).

## Build, Test, and Development Commands

- `yarn dev`: run the local Next.js dev server.
- `yarn build`: create a production build.
- `yarn start`: run the production server (requires `yarn build`).
- `yarn lint`: lint the codebase with ESLint.
- `yarn format`: format TypeScript/TSX with Prettier + Tailwind plugin.
- `yarn check-type`: run TypeScript type checking (no emit).
- `yarn update:png` / `yarn update:pdf`: regenerate preview images or resume PDF.

## Coding Style & Naming Conventions

- TypeScript + React (Next.js App Router). Use 2-space indentation.
- Prettier is configured in `.prettierrc.js` (single quotes, semicolons, 100-char width).
- ESLint config lives in `eslint.config.js`; prefer `yarn lint` before pushing.
- File/folder names follow existing conventions (`kebab-case` for folders, `PascalCase` for components).

## Testing Guidelines

- No formal test framework is currently wired up (no `*.test.*` or `__tests__`).
- If you add tests, document the framework and add a matching npm script.

## Commit & Pull Request Guidelines

- Commit history uses Conventional Commits (e.g., `feat:`, `docs:`, `refactor:`). Keep messages short and scoped.
- PRs should include a clear summary, expected UI changes, and screenshots for visual updates.

## Configuration & Secrets

- Copy `.env.sample` to `.env` for local configuration.
- Do not commit secrets; keep API keys and tokens in environment variables.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal resume and portfolio website built with Next.js App Router. The site features:

- Printable resume page with SEO optimization
- Dynamic GitHub repository showcase via Octokit API
- Automated preview image generation using Puppeteer
- Resume PDF serving via API route (`/api/resume`)

**Tech Stack**: Next.js 16 (React 19, App Router), TypeScript, Tailwind CSS v4, Vercel deployment

## Development Commands

### Setup

```bash
yarn install
cp .env.sample .env  # Fill in GITHUB_TOKEN and PREVIEW_BASE_URL
```

### Development

```bash
yarn dev          # Start dev server at localhost:3000
yarn build        # Production build
yarn start        # Serve production build (runs build first)
yarn vercel-build # Vercel deployment build
```

### Code Quality

```bash
yarn lint         # ESLint
yarn format       # Prettier with Tailwind plugin
yarn check-type   # TypeScript type checking
yarn watch-type   # Watch mode for type checking
```

### Testing

```bash
yarn test              # Run Vitest tests
yarn test:watch        # Watch mode
yarn test:coverage     # Generate coverage report
```

Tests are located in `src/test/` mirroring the structure of `src/`. Vitest is configured with jsdom environment and excludes `src/app/` from coverage.

### Asset Generation

```bash
yarn update:png        # Regenerate README preview images via Puppeteer
yarn update:pdf        # Generate resume PDF from / page
yarn update:repos      # Fetch and update GitHub repository metadata
```

## Architecture

### Directory Structure

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
│   ├── api/posts/    # Posts listing endpoint
│   ├── api/repos/    # Repositories listing endpoint
│   ├── api/resume/   # Latest PDF download endpoint
│   ├── api/github/contributions/  # OSS contributions via GitHub GraphQL
│   ├── posts/        # Blog post list/detail pages
│   └── repos/        # Repository list/detail pages
├── components/       # Shared UI components
├── features/         # Domain-specific feature modules
├── hooks/            # Shared React hooks
├── lib/              # Utilities and helpers
├── interface/        # TypeScript types/interfaces
├── test/             # Test files (mirrors src/ structure)
└── globals.css       # Global styles + Tailwind layers

data/                 # Static content
  ├── apps/           # Shipped app entries (JSON)
  ├── posts/          # Resume/timeline entries — experience/project/activity (YAML)
  └── repos/          # GitHub repository metadata (JSON)
public/               # Static assets (images, fonts, resume PDFs)
  └── resume/         # Resume PDFs (API serves most recent by mtime)
assets/               # README preview images
scripts/              # Automation scripts
```

### Key Design Patterns

**Module Organization**: Features are organized by domain in `src/features/` with related components, hooks, and utilities co-located. Shared functionality lives in `src/components/`, `src/hooks/`, and `src/lib/`.

**Data Flow**: GitHub data is fetched server-side using Octokit and can be refreshed via `scripts/update-repositories.ts`. Local repository metadata is stored in `data/repos/` and consumed by the repos page.

**Resume PDF API**: `/api/resume` route handler scans `public/resume/` and serves the file with the most recent modification time. Add new PDFs to `public/resume/` to update.

**Preview Automation**: `scripts/generate-previews.mjs` uses Puppeteer to capture screenshots based on targets defined in `scripts/preview-targets.json`. Supports desktop/mobile viewports and scroll positions.

## Code Style

- **TypeScript**: Strict mode enabled, 2-space indentation
- **Naming**: `kebab-case` for folders, `PascalCase` for components
- **Prettier**: Single quotes, semicolons, 100-char width, Tailwind class sorting
- **ESLint**: Next.js recommended + `simple-import-sort` for import ordering
- **Commits**: Use Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`)

## Environment Variables

Required in `.env`:

- `GITHUB_TOKEN`: GitHub PAT with repo read access (for private repos)
- `PREVIEW_BASE_URL`: Base URL for preview capture (e.g., `http://localhost:3000` or production URL)

Optional (Puppeteer generation scripts only):

- `PUPPETEER_NO_SANDBOX`: set to `1` to launch Chromium with `--no-sandbox` (auto-enabled on CI)
- `TZ`: timezone for the generated resume PDF (defaults to `Asia/Seoul`)

## Important Notes

- The site is bilingual (Korean/English), with Korean used for personal descriptions
- Tailwind v4 is used (newer `@tailwindcss/postcss` plugin)
- Deployment targets Vercel with automatic builds on push
- `knip.json` is configured for dependency analysis

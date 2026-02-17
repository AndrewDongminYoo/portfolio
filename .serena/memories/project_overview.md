# Project Overview

- Purpose: personal resume + portfolio site (printable resume page, SEO-optimized, dynamic elements). Initially static HTML/CSS/JS, now Next.js.
- Stack: Next.js App Router (React 19), TypeScript, Tailwind CSS, ESLint, Prettier, Vitest. Uses Octokit for GitHub data and Puppeteer for preview capture.
- Runtime: Node/Yarn. Deploys on Vercel; has a `vercel-build` script.
- Key features: `/api/resume` route serves the most recently modified PDF from `public/resume/`; preview images can be regenerated into `assets/`.
- Env: copy `.env.sample` to `.env` (e.g., `GITHUB_TOKEN`, `PREVIEW_BASE_URL`).

## Structure

- `src/app/`: Next.js App Router pages/layouts/route handlers.
- `src/components/`: shared UI components.
- `src/features/`: domain/feature modules.
- `src/hooks/`: shared hooks.
- `src/lib/`: utilities/helpers.
- `src/interface/`: types/interfaces.
- `src/globals.css`: global styles and Tailwind layers.
- `data/`: local content/metadata (posts, repos).
- `public/`: static assets (images, fonts, resume PDFs).
- `assets/`: README preview images.
- `scripts/`: one-off utilities (preview capture, resume PDF generation).

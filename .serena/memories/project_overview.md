## Purpose

Personal resume + portfolio site for Yoo Dong Min. Built as a printable, SEO-friendly Next.js site with dynamic sections showcasing projects and GitHub data.

## Tech stack

- Next.js 16 with the App Router (code under `src/app`), React 19, TypeScript
- Tailwind CSS 4 with Radix UI, Lucide, FontAwesome, Headless UI
- Content/data sourced from local `data/` markdown/JSON, GitHub API via Octokit, and utility libs like date-fns, lodash.groupby, gray-matter
- Uses next-sitemap and next export for static generation, sharp for image processing

## Structure highlights

- `src/app`: App router routes/layouts
- `src/components`: Shared UI components (tooltip, cards, etc.)
- `src/features`: Feature-focused sections
- `src/lib`: Utilities (GitHub API, formatting helpers, etc.)
- `data/`: Markdown/JSON resume data
- `public/`, `assets/`: static files, preview images
- Root configs: Tailwind/PostCSS, ESLint, TS, sitemap, Next config

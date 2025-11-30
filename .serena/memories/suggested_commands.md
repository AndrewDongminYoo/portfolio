## Common commands
- `yarn dev`: run Next.js dev server on :3000 using App Router
- `yarn build`: production build (also used by `yarn vercel-build`)
- `yarn start`: serve the production build (runs `next start`)
- `yarn export`: generate static export if needed for GitHub Pages
- `yarn lint`: ESLint across the repo (Next.js config + simple-import-sort)
- `yarn format`: Prettier (w/ Tailwind plugin) across TS/TSX files
- `yarn check-type`: Run `tsc --noEmit` for strict type checking; use `yarn watch-type` for watch mode
- `yarn postbuild`: Runs `next-sitemap` after build to update sitemap
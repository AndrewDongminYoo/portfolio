## Languages & patterns

- TypeScript w/ strict compiler settings (`strict`, `noImplicitAny`, unused checks). Prefer function components + hooks under the Next.js App Router.
- Path alias `@/*` points to `src/*`.
- Styling via Tailwind CSS utility classes, Tailwind Merge for dynamic class composition, plus Radix/HeadlessUI primitives.

## Tooling

- ESLint (Next + Simple Import Sort + React-specific rules) and Prettier w/ Tailwind plugin enforce formatting/order. Run `yarn lint` and `yarn format` to stay consistent.
- Type safety enforced via `yarn check-type` / `tsc --noEmit`.

## Data/content

- Resume/portfolio data generally lives in `data/` markdown/JSON and is consumed in `src/app` or feature modules. Prefer centralizing static content there instead of hardcoding.

## Misc

- Uses both `public/` and `assets/` for static imagery (preview shots, etc.); keep additions optimized for static export.

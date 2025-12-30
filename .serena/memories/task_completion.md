## Before handing off changes

1. Run `yarn lint` and `yarn check-type` after code edits.
2. For anything affecting runtime behavior or data fetching, also run `yarn build` to catch Next.js/App Router issues.
3. Update any generated assets/configs (e.g., sitemap via `yarn postbuild`, Tailwind builds) when touching related functionality.
4. Manual QA through `yarn dev` to confirm portfolio/resume pages render + print views still work.
5. Ensure new static assets go under `public/` (served) or `assets/` (docs/previews) and are referenced correctly.

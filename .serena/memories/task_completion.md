# Task Completion Checklist

- Run `yarn lint` when touching JS/TS/TSX.
- Run `yarn format` if formatting changes are needed.
- Run `yarn check-type` for type safety on TS changes.
- Run `yarn test` for behavior-impacting changes; use `yarn test:coverage` when validating broader impact.
- If updating UI previews, run `yarn update:png` and commit regenerated `assets/*.png`.
- If updating the resume PDF, replace/add in `public/resume/` (latest mtime is served by `/api/resume`).
- If tests are not applicable to the change, note manual checks performed.

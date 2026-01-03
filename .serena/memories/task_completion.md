# Task Completion Checklist

- Run `yarn lint` when touching JS/TS/TSX.
- Run `yarn format` if formatting changes are needed.
- Run `yarn check-type` for type safety on TS changes.
- If updating UI previews, run `yarn update:png` and commit regenerated `assets/*.png`.
- If updating the resume PDF, replace/add in `public/resume/` (latest mtime is served by `/api/resume`).
- No formal tests are configured; note any manual checks performed.

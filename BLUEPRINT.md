# BLUEPRINT

## Goal

- Provide an internal `/insights` admin dashboard that shows Search Console queries and basic traffic trends.
- Keep the implementation minimal and avoid adding complex Google Analytics features.
- Surface feedback on who visits and what they are interested in (aggregated, non-PII).

## Success Criteria

- `/insights` page displays:
  - Top queries, pages, countries, devices (clicks, impressions, CTR, avg position).
  - Simple time-series trend (daily or weekly) for search traffic.
- Data is viewable without visiting Google Search Console UI.
- Access is restricted (basic auth or secret-based gate).
- No new heavy analytics stack is introduced; Vercel Analytics stays as-is.

## Constraints / Non-goals

- Do not integrate advanced GA4 features or increase project complexity.
- No user-level tracking or PII collection.
- Keep dependencies and operational overhead low.

## Phase 1 - Requirements & Data Model

- [x] Confirm data sources and scope (GSC only, Vercel Analytics optional).
- [x] Define the metrics, dimensions, and time windows to display.
- [x] Decide auth strategy for GSC (service account).
- [x] Decide storage (Vercel KV) and retention policy.
- [x] Outline `/insights` access control method (secret token).

## Phase 2 - Data Ingestion (GSC)

- [x] Implement a secure server-side fetch for GSC data.
- [ ] Add a scheduled job (e.g., Vercel Cron) to refresh data (daily).
- [x] Normalize and store data for dashboard consumption.
- [ ] Add basic health logging/alerts for data refresh failures.

## Phase 3 - Insights Dashboard UI

- [x] Create `/insights` route with minimal admin UI.
- [x] Build tables + a small trend chart for search traffic.
- [ ] Add device/country filters and date range selection (basic).
- [x] Add access gate and UX polish for internal use.
- [x] Document the data refresh cadence and limitations.

## Open Questions

- Need overall traffic trend beyond search (Vercel Analytics API/logs)?

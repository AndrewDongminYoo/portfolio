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

- [ ] Confirm data sources and scope (GSC only vs GSC + Vercel Analytics API).
- [ ] Define the metrics, dimensions, and time windows to display.
- [ ] Decide auth strategy for GSC (service account or OAuth).
- [ ] Decide storage (Vercel KV/DB/Sheets/etc.) and retention policy.
- [ ] Outline `/insights` access control method.

## Phase 2 - Data Ingestion (GSC)

- [ ] Implement a secure server-side fetch for GSC data.
- [ ] Add a scheduled job (e.g., Vercel Cron) to refresh data.
- [ ] Normalize and store data for dashboard consumption.
- [ ] Add basic health logging/alerts for data refresh failures.

## Phase 3 - Insights Dashboard UI

- [ ] Create `/insights` route with minimal admin UI.
- [ ] Build tables + a small trend chart for search traffic.
- [ ] Add device/country filters and date range selection (basic).
- [ ] Add access gate and UX polish for internal use.
- [ ] Document the data refresh cadence and limitations.

## Open Questions

- Preferred GSC auth method: Service Account or OAuth?
- Preferred storage: Vercel KV, DB, Google Sheets, or other?
- Need overall traffic trend beyond search (Vercel Analytics API/logs)?
- Access control preference: basic auth, secret token, or IP allowlist?

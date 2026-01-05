# Insights Setup

## Overview

- `/insights` shows Search Console query/page/country/device trends.
- Data is fetched server-side, stored in Redis, and read by the dashboard.
- Access is protected by a token (stored locally in the browser).

## 1) Google Search Console (Service Account)

1. Create a Google Cloud project and enable **Search Console API**.
2. Create a **Service Account** and download a JSON key.
3. In Search Console, add the service account email to the property with **Full** access.
4. Set these env vars:
   - `GSC_SITE_URL` (example: `https://example.com/`)
   - `GSC_SERVICE_ACCOUNT_EMAIL`
   - `GSC_PRIVATE_KEY` (use `\n` for newlines)

## 2) Redis (Vercel Marketplace)

Vercel 권고에 따라 `@vercel/kv` 대신 `redis` 패키지를 사용합니다.

1. Vercel Marketplace에서 Redis(Upstash) 인스턴스를 생성합니다.
2. 프로젝트에 연결합니다.
3. 아래 환경 변수를 설정합니다:
   - `REDIS_URL` (TLS 연결 문자열, `rediss://` 권장)

> 참고: Vercel이 `VERCEL_OIDC_TOKEN`을 자동 주입할 수 있지만, 현재 구현은 `REDIS_URL`만 사용합니다.

## 3) Insights Tokens

- `INSIGHTS_ACCESS_TOKEN`: for opening `/insights` and reading data.
- `INSIGHTS_REFRESH_TOKEN` (optional): for refresh endpoints. If omitted, access token is used.

## 4) Manual Refresh

- Trigger a refresh in the UI or call:
  - `/api/insights/refresh?token=INSIGHTS_REFRESH_TOKEN`

## 5) Daily Cron (recommended)

Configure in Vercel Dashboard (Cron Jobs) to avoid committing secrets.

- **Path**: `/api/insights/refresh?token=INSIGHTS_REFRESH_TOKEN`
- **Schedule**: daily (UTC). Example: `0 0 * * *`

> Note: Search Console data can be delayed by 2-3 days.

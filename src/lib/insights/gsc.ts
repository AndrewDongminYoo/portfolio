import { google } from 'googleapis';

import type {
  SearchConsoleDataset,
  SearchConsoleDimension,
  SearchConsoleRow,
  SearchConsoleSnapshot,
} from '@/interface/insights';

type SearchConsoleFetchResult =
  | {
      ok: true;
      data: SearchConsoleSnapshot;
    }
  | {
      ok: false;
      error: string;
    };

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const DEFAULT_LOOKBACK_DAYS = 28;
const DEFAULT_ROW_LIMIT = 250;
const DEFAULT_DATE_ROW_LIMIT = 90;
const MAX_ROW_LIMIT = 250;
const MAX_LOOKBACK_DAYS = 180;

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function computeDateRange() {
  const lookbackDays = clamp(
    toPositiveInt(process.env.INSIGHTS_LOOKBACK_DAYS, DEFAULT_LOOKBACK_DAYS),
    1,
    MAX_LOOKBACK_DAYS,
  );
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - lookbackDays + 1);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

function normalizeRows(
  rows: Array<{
    keys?: string[] | null;
    clicks?: number | null;
    impressions?: number | null;
    ctr?: number | null;
    position?: number | null;
  }>,
): SearchConsoleRow[] {
  return rows.map((row) => ({
    keys: row.keys ?? [],
    clicks: Number(row.clicks ?? 0),
    impressions: Number(row.impressions ?? 0),
    ctr: Number(row.ctr ?? 0),
    position: Number(row.position ?? 0),
  }));
}

async function fetchDimensionDataset({
  client,
  siteUrl,
  startDate,
  endDate,
  dimensions,
  rowLimit,
}: {
  client: ReturnType<typeof google.searchconsole>;
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: SearchConsoleDimension[];
  rowLimit: number;
}): Promise<SearchConsoleDataset> {
  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
    },
  });

  const rows = normalizeRows(response.data.rows ?? []);
  if (dimensions.includes('date')) {
    rows.sort((a, b) => (a.keys[0] ?? '').localeCompare(b.keys[0] ?? ''));
  }
  return { dimension: dimensions, rows };
}

export async function fetchSearchConsoleSnapshot(): Promise<SearchConsoleFetchResult> {
  const siteUrl = process.env.GSC_SITE_URL;
  const clientEmail = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;

  if (!siteUrl) return { ok: false, error: 'Missing GSC_SITE_URL' };
  if (!clientEmail) return { ok: false, error: 'Missing GSC_SERVICE_ACCOUNT_EMAIL' };
  if (!privateKey) return { ok: false, error: 'Missing GSC_PRIVATE_KEY' };

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const client = google.searchconsole({ version: 'v1', auth });
  const { startDate, endDate } = computeDateRange();
  const rowLimit = clamp(
    toPositiveInt(process.env.INSIGHTS_ROW_LIMIT, DEFAULT_ROW_LIMIT),
    1,
    MAX_ROW_LIMIT,
  );
  const dateRowLimit = clamp(
    toPositiveInt(process.env.INSIGHTS_DATE_ROW_LIMIT, DEFAULT_DATE_ROW_LIMIT),
    1,
    MAX_ROW_LIMIT,
  );

  try {
    const [byQuery, byPage, byCountry, byDevice, byDate] = await Promise.all([
      fetchDimensionDataset({
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit,
      }),
      fetchDimensionDataset({
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit,
      }),
      fetchDimensionDataset({
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions: ['country'],
        rowLimit,
      }),
      fetchDimensionDataset({
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions: ['device'],
        rowLimit,
      }),
      fetchDimensionDataset({
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: dateRowLimit,
      }),
    ]);

    return {
      ok: true,
      data: {
        siteUrl,
        startDate,
        endDate,
        createdAt: new Date().toISOString(),
        byQuery,
        byPage,
        byCountry,
        byDevice,
        byDate,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

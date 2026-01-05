import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const googleMocks = vi.hoisted(() => {
  const query = vi.fn();
  const searchconsole = vi.fn(() => ({
    searchanalytics: {
      query,
    },
  }));
  const jwt = vi.fn(function JWT(options: { email: string; key: string; scopes: string[] }) {
    return { options };
  });
  return { query, searchconsole, jwt };
});

vi.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: googleMocks.jwt,
    },
    searchconsole: googleMocks.searchconsole,
  },
}));

import { fetchSearchConsoleSnapshot } from '@/lib/insights/gsc';

const originalEnv = { ...process.env };

describe('fetchSearchConsoleSnapshot', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    googleMocks.query.mockReset();
    googleMocks.searchconsole.mockClear();
    googleMocks.jwt.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.useRealTimers();
  });

  it('returns an error when environment variables are missing', async () => {
    delete process.env.GSC_SITE_URL;
    process.env.GSC_SERVICE_ACCOUNT_EMAIL = 'service@example.com';
    process.env.GSC_PRIVATE_KEY = 'key';

    const result = await fetchSearchConsoleSnapshot();

    expect(result).toEqual({ ok: false, error: 'Missing GSC_SITE_URL' });
  });

  it('fetches datasets, normalizes rows, and sorts date rows', async () => {
    process.env.GSC_SITE_URL = 'https://example.com';
    process.env.GSC_SERVICE_ACCOUNT_EMAIL = 'service@example.com';
    process.env.GSC_PRIVATE_KEY = 'line1\\nline2';
    process.env.INSIGHTS_ROW_LIMIT = '999';
    process.env.INSIGHTS_DATE_ROW_LIMIT = '5';
    process.env.INSIGHTS_LOOKBACK_DAYS = '10';

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-04-10T00:00:00Z'));

    googleMocks.query.mockImplementation(async ({ requestBody }) => {
      const dimension = requestBody.dimensions[0];
      if (dimension === 'query') {
        return {
          data: {
            rows: [
              {
                keys: ['hello'],
                clicks: null,
                impressions: undefined,
                ctr: null,
                position: null,
              },
            ],
          },
        };
      }
      if (dimension === 'date') {
        return {
          data: {
            rows: [
              { keys: ['2024-04-09'], clicks: 2, impressions: 10, ctr: 0.2, position: 2 },
              { keys: ['2024-04-08'], clicks: 4, impressions: 20, ctr: 0.2, position: 1 },
            ],
          },
        };
      }
      return { data: { rows: [] } };
    });

    const result = await fetchSearchConsoleSnapshot();

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const calls = googleMocks.query.mock.calls.map((call) => call[0].requestBody);
    const rowLimitByDimension = new Map(
      calls.map((call: { dimensions: string[]; rowLimit: number }) => [
        call.dimensions[0],
        call.rowLimit,
      ]),
    );

    expect(rowLimitByDimension.get('query')).toBe(250);
    expect(rowLimitByDimension.get('date')).toBe(5);

    expect(result.data.startDate).toBe('2024-03-31');
    expect(result.data.endDate).toBe('2024-04-09');

    expect(result.data.byQuery.rows[0]).toEqual({
      keys: ['hello'],
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    });

    expect(result.data.byDate.rows.map((row) => row.keys[0])).toEqual(['2024-04-08', '2024-04-09']);

    expect(googleMocks.jwt).toHaveBeenCalledWith({
      email: 'service@example.com',
      key: 'line1\nline2',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    const [jwtCall] = googleMocks.jwt.mock.calls;
    expect(googleMocks.searchconsole).toHaveBeenCalledWith({
      version: 'v1',
      auth: { options: jwtCall?.[0] },
    });
    expect(googleMocks.query).toHaveBeenCalledTimes(5);
  });

  it('returns error message when API throws', async () => {
    process.env.GSC_SITE_URL = 'https://example.com';
    process.env.GSC_SERVICE_ACCOUNT_EMAIL = 'service@example.com';
    process.env.GSC_PRIVATE_KEY = 'key';

    googleMocks.query
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue({ data: { rows: [] } });

    const result = await fetchSearchConsoleSnapshot();

    expect(result).toEqual({ ok: false, error: 'boom' });
  });
});

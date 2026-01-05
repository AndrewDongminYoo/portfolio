import type { SearchConsoleSnapshot } from '@/interface/insights';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const redisMocks = vi.hoisted(() => {
  const kv = {
    get: vi.fn(),
    set: vi.fn(),
  };
  const connect = vi.fn(async () => kv);
  const createClient = vi.fn(() => ({ connect }));
  return { kv, connect, createClient };
});

vi.mock('redis', () => ({
  createClient: redisMocks.createClient,
}));

import { loadSearchConsoleSnapshot, saveSearchConsoleSnapshot } from '@/lib/insights/storage';

const baseSnapshot: SearchConsoleSnapshot = {
  siteUrl: 'https://example.com',
  startDate: '2024-01-01',
  endDate: '2024-01-10',
  createdAt: '2024-01-11T00:00:00.000Z',
  byQuery: { dimension: ['query'], rows: [] },
  byPage: { dimension: ['page'], rows: [] },
  byCountry: { dimension: ['country'], rows: [] },
  byDevice: { dimension: ['device'], rows: [] },
  byDate: { dimension: ['date'], rows: [] },
};

const originalEnv = { ...process.env };

describe('insights storage', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, REDIS_URL: 'redis://localhost:6379' };
    delete process.env.INSIGHTS_KV_KEY;
    redisMocks.kv.get.mockReset();
    redisMocks.kv.set.mockReset();
    redisMocks.createClient.mockClear();
    redisMocks.connect.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('loads snapshot from redis and returns parsed data', async () => {
    process.env.INSIGHTS_KV_KEY = 'custom-key';
    redisMocks.kv.get.mockResolvedValueOnce(JSON.stringify(baseSnapshot));

    const result = await loadSearchConsoleSnapshot();

    expect(redisMocks.createClient).toHaveBeenCalledWith({ url: process.env.REDIS_URL });
    expect(redisMocks.kv.get).toHaveBeenCalledWith('custom-key');
    expect(result).toEqual(baseSnapshot);
  });

  it('returns null when redis value is invalid JSON', async () => {
    redisMocks.kv.get.mockResolvedValueOnce('not-json');

    const result = await loadSearchConsoleSnapshot();

    expect(result).toBeNull();
  });

  it('saves snapshot to redis', async () => {
    process.env.INSIGHTS_KV_KEY = 'custom-key';

    await saveSearchConsoleSnapshot(baseSnapshot);

    expect(redisMocks.kv.set).toHaveBeenCalledWith('custom-key', JSON.stringify(baseSnapshot));
  });
});

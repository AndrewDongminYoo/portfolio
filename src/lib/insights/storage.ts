import { createClient } from 'redis';

import type { SearchConsoleSnapshot } from '@/interface/insights';

const DEFAULT_INSIGHTS_KEY = 'insights:gsc:latest';

async function getClient() {
  return await createClient({ url: process.env.REDIS_URL }).connect();
}

function getInsightsKey() {
  return process.env.INSIGHTS_KV_KEY ?? DEFAULT_INSIGHTS_KEY;
}

export async function loadSearchConsoleSnapshot(): Promise<SearchConsoleSnapshot | null> {
  const key = getInsightsKey();
  const kv = await getClient();
  try {
    const value = await kv.get(key);
    return JSON.parse(value!) satisfies SearchConsoleSnapshot;
  } catch (_error) {
    return null;
  }
}

export async function saveSearchConsoleSnapshot(snapshot: SearchConsoleSnapshot) {
  const key = getInsightsKey();
  const kv = await getClient();
  await kv.set(key, JSON.stringify(snapshot));
}

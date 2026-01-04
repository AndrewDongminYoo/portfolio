import { NextRequest, NextResponse } from 'next/server';

import type { InsightsApiResponse } from '@/interface/insights';
import { requireToken } from '@/lib/insights/auth';
import { fetchSearchConsoleSnapshot } from '@/lib/insights/gsc';
import { saveSearchConsoleSnapshot } from '@/lib/insights/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const refreshToken = process.env.INSIGHTS_REFRESH_TOKEN ?? process.env.INSIGHTS_ACCESS_TOKEN;
  const tokenName = process.env.INSIGHTS_REFRESH_TOKEN
    ? 'INSIGHTS_REFRESH_TOKEN'
    : 'INSIGHTS_ACCESS_TOKEN';
  const tokenCheck = requireToken(request, refreshToken, tokenName);
  if (!tokenCheck.ok) {
    return NextResponse.json({ ok: false, error: tokenCheck.error } satisfies InsightsApiResponse, {
      status: tokenCheck.status,
    });
  }

  const result = await fetchSearchConsoleSnapshot();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error } satisfies InsightsApiResponse, {
      status: 500,
    });
  }

  try {
    await saveSearchConsoleSnapshot(result.data);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: `Failed to persist insights snapshot. ${error}`,
      } satisfies InsightsApiResponse,
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: result.data } satisfies InsightsApiResponse, {
    status: 200,
  });
}

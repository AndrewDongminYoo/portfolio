import { NextRequest, NextResponse } from 'next/server';

import type { InsightsApiResponse } from '@/interface/insights';
import { requireToken } from '@/lib/insights/auth';
import { loadSearchConsoleSnapshot } from '@/lib/insights/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const tokenCheck = requireToken(
    request,
    process.env.INSIGHTS_ACCESS_TOKEN,
    'INSIGHTS_ACCESS_TOKEN',
  );
  if (!tokenCheck.ok) {
    return NextResponse.json({ ok: false, error: tokenCheck.error } satisfies InsightsApiResponse, {
      status: tokenCheck.status,
    });
  }

  const data = await loadSearchConsoleSnapshot();
  if (!data) {
    return NextResponse.json(
      {
        ok: false,
        error: 'No Search Console data yet. Trigger refresh to populate insights.',
      } satisfies InsightsApiResponse,
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, data } satisfies InsightsApiResponse, { status: 200 });
}

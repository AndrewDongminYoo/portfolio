import type { NextRequest } from 'next/server';

type TokenCheckResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice('Bearer '.length).trim();
  return request.nextUrl.searchParams.get('token');
}

export function requireToken(
  request: NextRequest,
  token: string | undefined,
  tokenName: string,
): TokenCheckResult {
  if (!token) {
    return {
      ok: false,
      status: 500,
      error: `Missing ${tokenName}`,
    };
  }

  const incoming = extractToken(request);
  if (!incoming) {
    return {
      ok: false,
      status: 401,
      error: 'Missing access token',
    };
  }

  if (incoming !== token) {
    return {
      ok: false,
      status: 401,
      error: 'Invalid access token',
    };
  }

  return { ok: true };
}

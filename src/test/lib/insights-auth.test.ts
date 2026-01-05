import type { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { requireToken } from '@/lib/insights/auth';

const makeRequest = ({
  headers = {},
  url = 'https://example.com',
}: {
  headers?: Record<string, string>;
  url?: string;
}) => {
  return {
    headers: new Headers(headers),
    nextUrl: new URL(url),
  } as unknown as NextRequest;
};

describe('requireToken', () => {
  it('returns 500 when token is missing', () => {
    const request = makeRequest({});

    expect(requireToken(request, undefined, 'INSIGHTS_ACCESS_TOKEN')).toEqual({
      ok: false,
      status: 500,
      error: 'Missing INSIGHTS_ACCESS_TOKEN',
    });
  });

  it('returns 401 when incoming token is missing', () => {
    const request = makeRequest({});

    expect(requireToken(request, 'secret', 'INSIGHTS_ACCESS_TOKEN')).toEqual({
      ok: false,
      status: 401,
      error: 'Missing access token',
    });
  });

  it('returns 401 when incoming token is invalid', () => {
    const request = makeRequest({
      headers: {
        authorization: 'Bearer nope',
      },
    });

    expect(requireToken(request, 'secret', 'INSIGHTS_ACCESS_TOKEN')).toEqual({
      ok: false,
      status: 401,
      error: 'Invalid access token',
    });
  });

  it('accepts a valid token from authorization header', () => {
    const request = makeRequest({
      headers: {
        authorization: 'Bearer secret',
      },
    });

    expect(requireToken(request, 'secret', 'INSIGHTS_ACCESS_TOKEN')).toEqual({
      ok: true,
    });
  });

  it('accepts a valid token from query string', () => {
    const request = makeRequest({ url: 'https://example.com?token=secret' });

    expect(requireToken(request, 'secret', 'INSIGHTS_ACCESS_TOKEN')).toEqual({
      ok: true,
    });
  });
});

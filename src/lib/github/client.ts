import { Octokit } from '@octokit/core';

export const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
} as const;

// ----------------------------
// Octokit (lazy init) - DO NOT throw at import-time
// ----------------------------

let _octokit: Octokit | null = null;

export function getOctokit(): Octokit {
  if (_octokit) return _octokit;

  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required.');

  _octokit = new Octokit({ auth: GITHUB_TOKEN });
  return _octokit;
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const octokit = getOctokit();
  const res = await octokit.request('POST /graphql', {
    query,
    variables,
    headers: DEFAULT_HEADERS,
  });

  const payload = res.data as unknown as { data?: T } | T;
  return (
    typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload
  ) as T;
}

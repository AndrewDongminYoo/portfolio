import type Repository from '@/interface/repos';

// ----------------------------
// GitHub REST: shape
// ----------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pickRepository(raw: any): Repository {
  const repo = {
    node_id: String(raw.node_id ?? ''),
    name: String(raw.name ?? ''),
    full_name: String(raw.full_name ?? ''),
    private: Boolean(raw.private),
    owner: {
      login: String(raw.owner?.login ?? ''),
      avatar_url: String(raw.owner?.avatar_url ?? ''),
    },
    html_url: String(raw.html_url ?? ''),
    description: String(raw.description ?? ''),
    languages_url: String(raw.languages_url ?? ''),
    pushed_at: String(raw.pushed_at ?? ''),
    size: Number(raw.size ?? 0),
    stargazers_count: Number(raw.stargazers_count ?? 0),
    watchers_count: Number(raw.watchers_count ?? 0),
    language: String(raw.language ?? ''),
    forks_count: Number(raw.forks_count ?? 0),
    languages:
      raw.languages && typeof raw.languages === 'object'
        ? (raw.languages as Record<string, number>)
        : ({} as Record<string, number>),
    topics: Array.isArray(raw.topics) ? (raw.topics as string[]) : undefined,
    framework: raw.framework ?? undefined,
    descriptive_slug: raw.descriptive_slug ?? undefined,
    framework_candidates: raw.framework_candidates ?? undefined,
    ecosystems: raw.ecosystems ?? undefined,
  } satisfies Repository;

  return repo;
}

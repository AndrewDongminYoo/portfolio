import type { ContributionRepo } from '@/components/contributions/shared';

/**
 * Open-source ecosystems the contribution list is grouped by. Each repo is
 * classified into at most one ecosystem; repos that match none are omitted from
 * the ecosystem view (they are apps or infra, not ecosystem packages).
 */
export type EcosystemKey = 'react-native' | 'flutter' | 'vscode' | 'figma';

export type EcosystemMeta = { label: string; color: string };

export const ECOSYSTEMS: Record<EcosystemKey, EcosystemMeta> = {
  'react-native': { label: 'React Native', color: '#61DAFB' },
  'flutter': { label: 'Flutter · Dart', color: '#02569B' },
  'vscode': { label: 'VSCode', color: '#007ACC' },
  'figma': { label: 'Figma', color: '#F24E1E' },
};

const ECOSYSTEM_ORDER: EcosystemKey[] = ['react-native', 'flutter', 'vscode', 'figma'];

/** GitHub topics that map directly to an ecosystem. */
const TOPIC_MAP: Record<string, EcosystemKey> = {
  'react-native': 'react-native',
  'expo': 'react-native',
  'react-native-library': 'react-native',
  'turbomodule': 'react-native',
  'turbo-module': 'react-native',
  'flutter': 'flutter',
  'dart': 'flutter',
  'flutter-plugin': 'flutter',
  'flutter-package': 'flutter',
  'riverpod': 'flutter',
  'vscode': 'vscode',
  'vscode-extension': 'vscode',
  'visual-studio-code': 'vscode',
  'figma': 'figma',
  'figma-plugin': 'figma',
  'figma-api': 'figma',
};

/** Repository-name patterns, matched against the bare name (without owner). */
const NAME_PATTERNS: Array<{ pattern: RegExp; key: EcosystemKey }> = [
  { pattern: /^(react-native|expo|rn)-/, key: 'react-native' },
  { pattern: /^vscode-|-vscode$/, key: 'vscode' },
  { pattern: /^figma-|-figma$/, key: 'figma' },
  { pattern: /^flutter[_-]|[_-]flutter($|_)/, key: 'flutter' },
];

/**
 * Manual overrides keyed by `owner/name`, applied before any inference. Use for
 * repos that topics and naming misclassify or fail to classify.
 */
const ECOSYSTEM_OVERRIDES: Record<string, EcosystemKey> = {};

const bareName = (nameWithOwner: string) => nameWithOwner.split('/')[1] ?? nameWithOwner;

/**
 * Classify a repo into an ecosystem via override → topics → name → language.
 * Returns null when no signal matches.
 */
export const classifyEcosystem = (repo: ContributionRepo): EcosystemKey | null => {
  const override = ECOSYSTEM_OVERRIDES[repo.nameWithOwner];
  if (override) return override;

  for (const topic of repo.topics ?? []) {
    const key = TOPIC_MAP[topic.toLowerCase()];
    if (key) return key;
  }

  const name = bareName(repo.nameWithOwner).toLowerCase();
  for (const { pattern, key } of NAME_PATTERNS) {
    if (pattern.test(name)) return key;
  }

  if (repo.language === 'Dart') return 'flutter';

  return null;
};

export type EcosystemStat = EcosystemMeta & { key: EcosystemKey; count: number };

/**
 * Count how many of the given repos fall into each ecosystem, sorted by count
 * descending (ties keep the canonical ecosystem order).
 */
export const buildEcosystemDistribution = (repos: ContributionRepo[]): EcosystemStat[] => {
  const counts = new Map<EcosystemKey, number>();
  for (const repo of repos) {
    const key = classifyEcosystem(repo);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return ECOSYSTEM_ORDER.filter((key) => (counts.get(key) ?? 0) > 0)
    .map((key) => ({ key, ...ECOSYSTEMS[key], count: counts.get(key) ?? 0 }))
    .sort((a, b) => b.count - a.count);
};

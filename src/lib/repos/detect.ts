import path from 'node:path';

import type Repository from '@/interface/repos';
import type { Candidate } from '@/interface/repos';
import type { BrandSlug, BrandTitle, Ecosystem } from '@/interface/stack';
import type { RepoSignals } from '@/lib/github/signals';

// ----------------------------
// Types
// ----------------------------

type DetectResult = {
  framework: BrandTitle | null;
  descriptive_slug: BrandSlug | null;
  framework_candidates: Candidate[];
  ecosystems: Ecosystem[];
};

type DetectOptions = {
  minScoreToDecide: number;
};

const DEFAULT_DETECT_OPTIONS: DetectOptions = { minScoreToDecide: 80 };

// ----------------------------
// Framework definitions
// ----------------------------

const FRAMEWORKS = {
  flutter: 'Flutter',
  nextdotjs: 'Next.js',
  reactnative: 'React Native',
} as const;

type FrameworkKey = keyof typeof FRAMEWORKS;
type FrameworkTitle = (typeof FRAMEWORKS)[FrameworkKey];

function frameworkKeyToBrandSlug(key: FrameworkKey): BrandSlug {
  return key as unknown as BrandSlug;
}

function frameworkTitleToBrandTitle(title: FrameworkTitle): BrandTitle {
  return title as unknown as BrandTitle;
}

export function brandTitleToFrameworkKey(title: BrandTitle): FrameworkKey | null {
  const str = String(title);
  for (const [k, v] of Object.entries(FRAMEWORKS) as Array<[FrameworkKey, FrameworkTitle]>) {
    if (v === str) return k;
  }
  return null;
}

// ----------------------------
// Topic heuristics
// ----------------------------

const FLUTTER_TOPICS = new Set(['flutter', 'flutter-plugin', 'flutter-package', 'flutter-app']);
const REACT_NATIVE_TOPICS = new Set(['react-native', 'reactnative', 'expo']);
const NEXT_TOPICS = new Set(['nextjs', 'next.js', 'next-js', 'next']);

// ----------------------------
// Detection utilities
// ----------------------------

function normalizeTopics(topics?: string[]): Set<string> {
  return new Set((topics ?? []).map((t) => t.toLowerCase().trim()).filter(Boolean));
}

function addScore(
  map: Map<FrameworkKey, { score: number; reasons: string[] }>,
  key: FrameworkKey,
  delta: number,
  reason: string,
) {
  const cur = map.get(key) ?? { score: 0, reasons: [] };
  cur.score += delta;
  cur.reasons.push(`${delta >= 0 ? '+' : ''}${delta} ${reason}`);
  map.set(key, cur);
}

function isFlutterPubspec(content: string): boolean {
  return /(^|\n)\s*flutter\s*:\s*(\n|$)/m.test(content) || /\bsdk\s*:\s*flutter\b/i.test(content);
}

function parsePackageJsonDeps(content: string): Record<string, string> {
  const parsed = JSON.parse(content) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
  };
  return {
    ...(parsed.dependencies ?? {}),
    ...(parsed.devDependencies ?? {}),
    ...(parsed.peerDependencies ?? {}),
    ...(parsed.optionalDependencies ?? {}),
  };
}

function detectFrameworksFromPackageJson(content: string): FrameworkKey[] {
  try {
    const deps = parsePackageJsonDeps(content);
    const keys = Object.keys(deps);

    const hits: FrameworkKey[] = [];
    if (deps['react-native'] || deps.expo || keys.some((k) => k.startsWith('@react-native/')))
      hits.push('reactnative');
    if (deps.next) hits.push('nextdotjs');
    return hits;
  } catch {
    return [];
  }
}

// ----------------------------
// Language slug fallback
// ----------------------------

const LANGUAGE_TO_SLUG: Record<string, BrandSlug> = {
  'TypeScript': 'typescript' as BrandSlug,
  'JavaScript': 'javascript' as BrandSlug,
  'Dart': 'dart' as BrandSlug,
  'Python': 'python' as BrandSlug,
  'Go': 'go' as BrandSlug,
  'Java': 'java' as BrandSlug,
  'Ruby': 'ruby' as BrandSlug,
  'Rust': 'rust' as BrandSlug,
  'PHP': 'php' as BrandSlug,
  'Swift': 'swift' as BrandSlug,
  'Kotlin': 'kotlin' as BrandSlug,
  'C': 'c' as BrandSlug,
  'C++': 'cplusplus' as BrandSlug,
  'C#': 'csharp' as BrandSlug,
  'Shell': 'gnu-bash' as BrandSlug,
  'HTML': 'html5' as BrandSlug,
  'CSS': 'css3' as BrandSlug,
  'HCL': 'hcl' as BrandSlug,
  'YAML': 'yaml' as BrandSlug,
};

function pickPrimaryLanguageName(
  repo: Repository,
  languageMap: Record<string, number>,
): string | null {
  const primary = String(repo.language ?? '').trim();
  if (primary) return primary;

  let best: { name: string; size: number } | null = null;
  for (const [name, size] of Object.entries(languageMap ?? {})) {
    const s = typeof size === 'number' ? size : 0;
    if (!best || s > best.size) best = { name, size: s };
  }
  return best?.name ?? null;
}

export function inferDescriptiveSlug(
  decidedFramework: BrandTitle | null,
  repo: Repository,
  languageMap: Record<string, number>,
): BrandSlug | null {
  if (decidedFramework) {
    const key = brandTitleToFrameworkKey(decidedFramework);
    return key ? frameworkKeyToBrandSlug(key) : null;
  }

  const langName = pickPrimaryLanguageName(repo, languageMap);
  if (!langName) return null;
  return LANGUAGE_TO_SLUG[langName] ?? null;
}

// ----------------------------
// Ecosystem inference
// ----------------------------

function inferEcosystemsFromFiles(root: Set<string>, workflows: Set<string>): Ecosystem[] {
  const rootList = Array.from(root);
  const basenames = new Set(
    rootList.map((p) => path.posix.basename(p.replaceAll('\\', '/'))).filter(Boolean),
  );

  const hasPath = (name: string) => root.has(name) || basenames.has(name);
  const hasPathSuffix = (suffixes: string[]) =>
    rootList.some((p) => suffixes.some((s) => p.endsWith(s) || p.endsWith(`/${s}`)));

  const out = new Set<Ecosystem>();

  if (Array.from(workflows).some((n) => n.endsWith('.yml') || n.endsWith('.yaml')))
    out.add('GitHub Actions workflows');

  if (hasPath('pnpm-lock.yaml')) out.add('pnpm');
  if (hasPath('yarn.lock')) out.add('Yarn');
  if (hasPath('package-lock.json')) out.add('npm');

  if (hasPath('pubspec.yaml') || hasPath('pubspec.lock')) out.add('pub');

  if (hasPath('requirements.txt') || hasPath('Pipfile') || hasPath('Pipfile.lock')) out.add('pip');
  if (hasPath('poetry.lock') || hasPath('pyproject.toml')) out.add('Poetry');

  if (hasPath('Cargo.lock') || hasPath('Cargo.toml')) out.add('Cargo');

  if (hasPath('composer.lock') || hasPath('composer.json')) out.add('Composer');

  if (hasPath('Gemfile.lock') || hasPath('Gemfile') || hasPathSuffix(['.gemspec']))
    out.add('RubyGems');

  if (hasPath('go.mod')) out.add('Go modules');

  if (hasPath('pom.xml')) out.add('Maven');
  if (
    hasPath('build.gradle') ||
    hasPath('build.gradle.kts') ||
    hasPath('settings.gradle') ||
    hasPath('settings.gradle.kts')
  ) {
    out.add('Gradle');
  }

  if (hasPath('WORKSPACE') || hasPath('WORKSPACE.bazel') || hasPath('MODULE.bazel'))
    out.add('Bazel');

  if (hasPath('.terraform.lock.hcl')) out.add('OpenTofu');

  if (hasPath('Manifest.toml') || hasPath('Project.toml')) out.add('Julia');

  if (hasPath('Package.resolved') || hasPath('Package.swift')) out.add('Swift Package Manager');

  if (
    hasPathSuffix(['.csproj', '.fsproj', '.vbproj', '.vcxproj', '.nuspec']) ||
    hasPath('packages.config')
  )
    out.add('NuGet');

  return Array.from(out);
}

// ----------------------------
// Public APIs
// ----------------------------

export function detectFrameworkFromTopicsOnly(topics?: string[]): BrandTitle | null {
  if (!topics?.length) return null;
  const normalized = normalizeTopics(topics);

  for (const t of FLUTTER_TOPICS)
    if (normalized.has(t)) return frameworkTitleToBrandTitle('Flutter');
  for (const t of REACT_NATIVE_TOPICS)
    if (normalized.has(t)) return frameworkTitleToBrandTitle('React Native');
  for (const t of NEXT_TOPICS) if (normalized.has(t)) return frameworkTitleToBrandTitle('Next.js');

  return null;
}

export function applyFrameworkFromTopics(repo: Repository): Repository {
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

  const framework = detectFrameworkFromTopicsOnly(repo.topics);
  const descriptive_slug = inferDescriptiveSlug(framework, repo, repo.languages ?? {});
  return { ...repo, framework, descriptive_slug };
}

export async function detectFrameworkRich(
  repo: Repository,
  signals: RepoSignals,
  options: DetectOptions = DEFAULT_DETECT_OPTIONS,
): Promise<DetectResult> {
  const scoreMap = new Map<FrameworkKey, { score: number; reasons: string[] }>();
  const mergedTopics = normalizeTopics([...(repo.topics ?? []), ...(signals.topics ?? [])]);

  if ([...FLUTTER_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'flutter', 100, 'topic match');
  if ([...REACT_NATIVE_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'reactnative', 100, 'topic match');
  if ([...NEXT_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'nextdotjs', 100, 'topic match');

  if (signals.pubspecText && isFlutterPubspec(signals.pubspecText))
    addScore(scoreMap, 'flutter', 90, 'pubspec.yaml indicates Flutter');

  if (signals.packageJsonText) {
    const hits = detectFrameworksFromPackageJson(signals.packageJsonText);
    if (hits.includes('reactnative'))
      addScore(scoreMap, 'reactnative', 90, 'package.json deps indicate RN');
    if (hits.includes('nextdotjs'))
      addScore(scoreMap, 'nextdotjs', 90, 'package.json deps indicate Next.js');
  }

  const ecosystems = inferEcosystemsFromFiles(signals.rootNames, signals.workflowNames);
  if (ecosystems.includes('pub')) addScore(scoreMap, 'flutter', 15, 'ecosystem: pub present');

  const framework_candidates: Candidate[] = Array.from(scoreMap.entries())
    .map(([key, v]) => ({
      slug: frameworkKeyToBrandSlug(key),
      name: frameworkTitleToBrandTitle(FRAMEWORKS[key]),
      score: v.score,
      reasons: v.reasons,
    }))
    .sort((a, b) => b.score - a.score);

  const top = framework_candidates[0];
  const framework: BrandTitle | null =
    top && top.score >= options.minScoreToDecide ? top.name : null;
  const descriptive_slug = inferDescriptiveSlug(framework, repo, signals.languages);

  return { framework, descriptive_slug, framework_candidates, ecosystems };
}

// Test-only exports (kept minimal to avoid leaking internals in production usage)
export const __test__ = {
  brandTitleToFrameworkKey,
};

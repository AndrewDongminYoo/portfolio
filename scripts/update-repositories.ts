import fs from 'node:fs';
import { parseArgs } from 'node:util';

import { loadEnvConfig } from '@next/env';
import path from 'path';

import { enrichRepository, fetchRepositories } from '@/lib/repos';
import { createLimiter } from '@/lib/repos/limiter';

const reposDirectory = path.join(process.cwd(), 'data/repos');

/**
 * Update repository metadata JSON files under `data/repos`.
 *
 * Usage:
 *   npx tsx scripts/update-repositories.ts
 *   npx tsx scripts/update-repositories.ts --min-size-kb 5000 --include-forks
 *   npx tsx scripts/update-repositories.ts --public-only
 *   npx tsx scripts/update-repositories.ts --help
 */
const USAGE = `
Usage:
  npx tsx scripts/update-repositories.ts [options]

Options:
  -m, --min-size-kb <number>   Minimum repository size in KB (default: 1000)
  -f, --include-forks          Include fork repositories (default: false)
  -a, --include-archived       Include archived repositories (default: false)
      --public-only            Fetch public repositories only (default: false)
  -h, --help                   Show this help message
`.trim();

const DEFAULT_OPTIONS = {
  minSizeKb: 1000,
  includeArchived: false,
  includeForks: false,
  includePrivate: true,
} satisfies NonNullable<Parameters<typeof fetchRepositories>[0]>;

loadEnvConfig(process.cwd());

function parseMinSizeKb(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_OPTIONS.minSizeKb;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid --min-size-kb value "${raw}". Use a non-negative integer.`);
  }

  return parsed;
}

function parseFetchRepoOptions(
  args: string[],
): NonNullable<Parameters<typeof fetchRepositories>[0]> {
  const { values } = parseArgs({
    args,
    strict: true,
    allowPositionals: false,
    options: {
      'min-size-kb': { type: 'string', short: 'm' },
      'include-forks': { type: 'boolean', short: 'f' },
      'include-archived': { type: 'boolean', short: 'a' },
      'public-only': { type: 'boolean' },
      'help': { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    console.log(USAGE);
    process.exit(0);
  }

  return {
    minSizeKb: parseMinSizeKb(values['min-size-kb']),
    includeArchived: values['include-archived'] ?? DEFAULT_OPTIONS.includeArchived,
    includeForks: values['include-forks'] ?? DEFAULT_OPTIONS.includeForks,
    includePrivate: values['public-only'] ? false : DEFAULT_OPTIONS.includePrivate,
  };
}

async function main() {
  const repositories = await fetchRepositories(parseFetchRepoOptions(process.argv.slice(2)));

  const limit = createLimiter(6);

  const repositoryData = await Promise.all(
    repositories.map((repo) => limit(() => enrichRepository(repo))),
  );

  repositoryData.forEach((json) => {
    const targetJsonPath = path.join(reposDirectory, `${json.name}.json`);
    fs.writeFile(targetJsonPath, JSON.stringify(json, null, 2), { flag: 'w' }, (err) => {
      if (err) console.error(err);
    });
  });

  console.log(`✅ Updated ${repositoryData.length} repositories`);
}

main().catch((err) => {
  console.error('❌ Failed to update repositories', err);
  process.exit(1);
});

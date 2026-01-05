import fs from 'node:fs';

import path from 'path';

import { enrichRepository, fetchRepositories } from '@/lib/repos';
import { createLimiter } from '@/lib/repos/limiter';

const reposDirectory = path.join(process.cwd(), 'data/repos');

async function main() {
  const repositories = await fetchRepositories({
    minSizeKb: 0,
    includeArchived: false,
    includeForks: true,
  });

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

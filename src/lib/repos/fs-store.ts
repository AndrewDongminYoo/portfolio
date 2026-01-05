import fs from 'node:fs';
import path from 'node:path';

import type Repository from '@/interface/repos';
import { sortRepositoriesDefault } from '@/lib/repo-sort';
import { applyFrameworkFromTopics } from '@/lib/repos/detect';

export const reposDirectory = path.join(process.cwd(), 'data/repos');
export const starsDirectory = path.join(process.cwd(), 'data/stars');

export async function ensureDir(dirPath: string) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

export async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  const payload = JSON.stringify(data, null, 2);

  await fs.promises.writeFile(tmpPath, payload, 'utf8');
  await fs.promises.rename(tmpPath, filePath);
}

function readReposIds(): { params: { repo: string } }[] {
  const fileNames = fs.readdirSync(reposDirectory);
  return fileNames
    .filter((n) => n.endsWith('.json'))
    .map((fileName) => ({ params: { repo: fileName.replace(/\.json$/, '') } }));
}

export function readData(repo: string): Repository {
  const fullPath = path.join(reposDirectory, `${repo}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return applyFrameworkFromTopics(JSON.parse(fileContents) as Repository);
}

export function readRepositories(): Repository[] {
  const allReposData = readReposIds().map(({ params: { repo } }) => readData(repo));
  return sortRepositoriesDefault(allReposData);
}

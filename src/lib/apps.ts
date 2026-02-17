import fs from 'node:fs';
import path from 'node:path';

import type App from '@/interface/app';

const appsDirectory = path.join(process.cwd(), 'data/apps');

/**
 * 모든 앱 데이터를 읽어옵니다.
 * @returns {App[]} order 순으로 정렬된 앱 목록
 */
export function getApps(): App[] {
  const fileNames = fs.readdirSync(appsDirectory);
  const apps = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(appsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as App;
    });

  return apps.sort((a, b) => a.order - b.order);
}

/**
 * ID로 특정 앱 데이터를 읽어옵니다.
 * @param {string} id - 앱 ID
 * @returns {App} 앱 데이터
 */
export function getAppById(id: string): App {
  const fullPath = path.join(appsDirectory, `${id}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents) as App;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import type Repository from 'types/repos';
import fs from 'fs';
import parse from 'date-fns/parseISO';
import path from 'path';

const { GITHUB_TOKEN } = process.env;
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const reposDirectory = path.join(process.cwd(), 'data/repos');

/**
 * @description 리포지토리 데이터에서 특정 속성을 재귀적으로 필터링.
 * @param {{ [x: string]: any; }} repo - 키가 문자열이고 값이 모든 유형일 수 있는 키-값 쌍이 포함.
 * @returns {Repository} 필터링된 리포지토리 객체.
 */
export function reclusiveFilter(repo: { [x: string]: any }) {
    Object.entries(repo).forEach(([key, value]) => {
        switch (typeof value) {
            case 'string': {
                if (value.endsWith('.git')) {
                    delete repo[key];
                } else if (value.includes('{')) {
                    delete repo[key];
                } else {
                    repo[key] = value;
                }
                break;
            }
            case 'object': {
                if (key === 'topics') {
                    repo[key] = value;
                } else if (value === null) {
                    delete repo[key];
                } else {
                    repo[key] = reclusiveFilter(value);
                }
                break;
            }
            case 'undefined': {
                delete repo[key];
                break;
            }
            default: {
                repo[key] = value;
                break;
            }
        }
    });
    return repo as Repository;
}

/**
 * @description 깃허브 API 통해 사용자 계정에서 리포지토리를 가져와 특정 기준에 따라 필터링하고 필터링된 리포지토리를 반환.
 * @returns {Promise<Repository[]>} 다음 기준을 충족하는 저장소 배열을 반환.
 */
export async function fetchRepositories() {
    const EP_REPOS: keyof Endpoints = 'GET /user/repos';
    const repositories = await octokit
        .request(EP_REPOS, {
            type: 'public',
            per_page: 100,
            direction: 'desc',
            sort: 'pushed',
        })
        .then((value) => value.data);
    return repositories
        .filter((R) => !R.fork && R.size > 4000 && !R.archived)
        .map((repo) => reclusiveFilter(repo));
}

/**
 * @description 깃허브 유저 및 repo 매개변수를 사용하여 리포지토리를 가져오고 가져온 데이터에 필터를 적용.
 * @param {string} owner - 저장소 소유자의 유저 이름 또는 조직 이름.
 * @param {string} repo - 저장소의 이름을 나타내는 문자열.
 * @returns {Promise<Repository>} GitHub API를 사용하여 가져온 저장소의 데이터.
 */
export async function fetchRepository(owner: string, repo: string) {
    const EP_REPO: keyof Endpoints = 'GET /repos/{owner}/{repo}';
    return await octokit
        .request(EP_REPO, { owner, repo })
        .then((value) => value.data)
        .then((repo) => reclusiveFilter(repo));
}

/**
 * @description 리포지토리를 가져오고 해당 언어를 검색하며 리포지토리 데이터를 정적 폴더에 JSON 파일로 저장.
 * @returns {Promise<number>} 저장한 `repositoryData` 배열의 길이.
 */
export async function downloadJSON() {
    const repositories = await fetchRepositories();
    const repositoryData = await Promise.all(
        repositories.map(async (repo) => {
            const { languages_url } = repo;
            const languages = await octokit.request({ url: languages_url }).then((res) => res.data);
            return { ...repo, languages };
        })
    );
    repositoryData.forEach((json) => {
        const targetJsonPath = path.join(reposDirectory, `${json.name}.json`);
        fs.writeFile(targetJsonPath, JSON.stringify(json, null, 4), { flag: 'w' }, (err) => {
            if (err) console.error(err);
        });
    });
    return repositoryData.length;
}

/**
 * @description 지정된 정적 디렉토리 아래의 파일 이름을 읽고 파일 확장자가 없는 파일 이름을 포함하는 객체 배열을 반환.
 * @returns {{ params: { repo: string; } }} `repo`(파일 이름에서 '.json' 확장자를 제거하여 얻은 저장소의 ID) 속성을 포함하는 `params` 속성을 가진 객체.
 */
export function readReposIds() {
    // Get file names under /data/repos
    const fileNames = fs.readdirSync(reposDirectory);
    return fileNames.map((fileName) => {
        // Remove '.md' from file name to get id
        const repo = fileName.replace(/\.json$/, '');
        return { params: { repo } };
    });
}

/**
 * @description JSON 파일을 읽고 그 내용을 Repository 객체로 반환.
 * @param {string} repo - 저장소의 이름을 나타내는 ID.
 * @returns {Repository} 리포지토리 객체로서의 JSON 파일의 내용.
 */
export function readData(repo: string) {
    // Read JSON file as Repository
    const fullPath = path.join(reposDirectory, `${repo}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as Repository;
}

/**
 * @description 정적 폴더에 저장된 리포지토리 데이터를 읽고 날짜별로 정렬한 다음 정렬된 데이터를 반환.
 * @returns {Repository[]} `pushed_at` 날짜를 기준으로 내림차순으로 정렬된 저장소 데이터 개체의 배열.
 */
export function readRepositories() {
    const allReposData = readReposIds().map(({ params: { repo } }) => readData(repo));
    // Sort repos by date
    return allReposData.sort((a, b) => {
        if (parse(a.pushed_at) < parse(b.pushed_at)) {
            return 1;
        } else return -1;
    });
}

import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import type { Repository } from '@typings/repos';
import fs from 'fs';
import { parse } from 'html-metadata-parser';
import { parseISO } from 'date-fns';
import path from 'path';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const reposDirectory = path.join(process.cwd(), 'data/repos');

/** 깃허브에서 가져온 데이터 필터링 함수 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reclusiveFilter = (repo: { [x: string]: any }) => {
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
};

/** 깃허브 API 통해 유저의 리포지토리 리스트 전체 가져오기 */
const fetchRepositories = async () => {
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
        .filter((R) => !R.fork && R.size > 4000 && R.topics?.length !== 0)
        .map((repo) => reclusiveFilter(repo));
};

/** 깃허브 API 통해 리포지토리 데이터 가져오기 */
const fetchRepository = async (owner: string, repo: string) => {
    const EP_REPO: keyof Endpoints = 'GET /repos/{owner}/{repo}';
    return await octokit
        .request(EP_REPO, { owner, repo })
        .then((value) => value.data)
        .then((repo) => reclusiveFilter(repo));
};

/** 깃허브에서 가져온 리포지토리 데이터 로컬에 저장하기 */
const downloadJSON = async () => {
    const repositories = await fetchRepositories();
    const repositoryData = await Promise.all(
        repositories.map(async (repo) => {
            const { html_url, languages_url } = repo;
            const languages = await octokit
                .request({ url: languages_url })
                .then((res) => res.data);
            const meta_tags = await getTagsFromWebsite(html_url);
            return { ...repo, meta_tags, languages };
        })
    );
    repositoryData.forEach((json) => {
        const targetJsonPath = path.join(reposDirectory, `${json.name}.json`);
        fs.writeFile(
            targetJsonPath,
            JSON.stringify(json, null, 4),
            { flag: 'w' },
            (err) => {
                if (err) console.error(err);
            }
        );
    });
    return repositoryData.length;
};
/** 로컬 리포지토리 데이터 ID 리스트 읽기 */
function readReposIds() {
    // Get file names under /data/repos
    const fileNames = fs.readdirSync(reposDirectory);
    return fileNames.map((fileName) => {
        // Remove '.md' from file name to get id
        const repo = fileName.replace(/\.json$/, '');
        return { params: { repo } };
    });
}

/** 로컬 리포지토리 데이터 ID로 읽어오기 */
const readData = (repo: string) => {
    // Read JSON file as Repository
    const fullPath = path.join(reposDirectory, `${repo}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as Repository;
};

/** 로컬 리포지토리 리스트 데이터 읽어오기 */
const readRepositories = () => {
    const allReposData = readReposIds().map(({ params: { repo } }) =>
        readData(repo)
    );
    // Sort repos by date
    return allReposData.sort((a, b) => {
        if (parseISO(a.pushed_at) < parseISO(b.pushed_at)) {
            return 1;
        } else return -1;
    });
};

async function getTagsFromWebsite(url: string) {
    return await parse(url).then((metaData) => metaData.og);
}

export {
    downloadJSON,
    fetchRepositories,
    fetchRepository,
    readData,
    readReposIds,
    readRepositories,
};

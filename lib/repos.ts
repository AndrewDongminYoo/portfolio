import '@next/env';
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import { Repository } from '@typings/repos';
import { getTagsFromWebsite } from './metatag';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type route = keyof Endpoints;

const repos: route = 'GET /user/repos';
const langs: route = 'GET /repos/{owner}/{repo}/languages';

const getRepositories = async () => {
    return await octokit
        .request(repos, {
            type: 'all',
            per_page: 100,
            direction: 'desc',
            sort: 'created',
        })
        .then((value) => value.data.map((repo) => reclusiveFilter(repo)));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reclusiveFilter = (repo: { [x: string]: any }) => {
    const copy = { ...repo };
    Object.entries(copy).map(([key, value]) => {
        const V = typeof value;
        if (V === 'string') {
            if (value.includes('{')) {
                return delete copy[key];
            } else if (value.endsWith('.git')) {
                return delete copy[key];
            } else {
                return [key, value];
            }
        } else if (V === 'boolean' || V === 'number') {
            return [key, value];
        } else if (V === 'undefined' || value === null) {
            return delete copy[key];
        } else if (V === 'object') {
            return [key, reclusiveFilter(value)];
        } else {
            return delete copy[key];
        }
    });
    return copy;
};

const getLangs = async ({
    owner: user,
    name,
}: {
    name: string;
    owner: { login: string };
}) => {
    const repo = name;
    const owner = user.login;
    return await octokit
        .request(langs, { owner, repo })
        .then((value) => value.data);
};

export const getTagsFromRepository = async (): Promise<Repository[]> => {
    const result: Record<string, Repository> = {};
    return await getRepositories()
        .then((repositories) => {
            return Object.values(repositories).map((repo, i) => {
                result[String(i)] = repo as Repository;
                return getTagsFromWebsite(repo.html_url);
            });
        })
        .then((promises) => Promise.all(promises))
        .then((openGraph) => {
            return openGraph.map((meta_tags, i) => {
                return { ...result[String(i)], meta_tags };
            });
        });
};

export const getReposLanguages = async (): Promise<Repository[]> => {
    const result: Record<string, Repository> = {};
    return await getRepositories()
        .then((repositories) => {
            return Object.values(repositories).map((repo, i) => {
                result[String(i)] = repo as Repository;
                return getLangs(repo as Repository);
            });
        })
        .then((promises) => Promise.all(promises))
        .then((langs) => {
            return langs.map((languages, i) => {
                return { ...result[String(i)], languages };
            });
        });
};

export const getReposIds = async () => {
    const repositories = await getRepositories();
    return repositories.map((repo) => {
        return {
            params: {
                id: String(repo.id),
            },
        };
    });
};

import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import { Repository } from '@typings/repos';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type route = keyof Endpoints;

const repos: route = 'GET /user/repos';

export const getRepositories = async () => {
    return (await octokit
        .request(repos, {
            type: 'all',
            per_page: 100,
            direction: 'desc',
            sort: 'created',
        })
        .then((value) =>
            value.data.map((repo) => reclusiveFilter(repo))
        )) as Repository[];
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
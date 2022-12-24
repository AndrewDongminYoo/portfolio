import '@next/env';
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import { Repository } from '../types/repos.types';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

type route = keyof Endpoints

const repos: route = "GET /user/repos";
const langs: route = "GET /repos/{owner}/{repo}/languages";

const getRepositories = async () => {
    return await octokit.request(repos, {
        type: "all",
        per_page: 100,
        direction: "asc",
        sort: "created"
    }).then((value) => value.data.map((repo) => filterRepository(repo)))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterRepository = (repo: Record<string, any>): Repository => {
    const copy = { ...repo }
    Object.entries(copy).forEach(([key, value]) => {
        if (typeof value === 'string') {
            if (value.includes("{")) {
                return delete copy[key]
            } else if (value.endsWith(".git")) {
                return delete copy[key]
            } else {
                return [key, value]
            }
        } else if (value && typeof value === 'object') {
            const newV = Object.entries(value).map(([k, v]) => {
                if (typeof v === 'string') {
                    if (v.includes("{")) {
                        return delete value[k]
                    } else if (v.endsWith(".git")) {
                        return delete value[k]
                    } else {
                        return [k, v]
                    }
                } else {
                    return [k, v]
                }
            })
            return [key, newV]
        } else {
            return delete copy[key]
        }
    })
    return copy as Repository;
}

export const getReposLanguages = async (): Promise<Repository[]> => {
    const result: Record<string, Repository> = {}
    const getLangs = async ({
        html_url,
    }: {
        html_url: string;
    }) => {
        const splitted = html_url.split('/')
        const length = splitted.length;
        const repo = splitted[length - 1]
        const owner = splitted[length - 2]
        return await octokit.request(langs, { owner, repo }).then((value) => value.data)
    };

    return await getRepositories()
        .then((repositories) => {
            return Object.values(repositories).map((repo, i) => {
                result[String(i)] = repo as Repository;
                return getLangs(repo)
            })
        }).then((promises) => Promise.all(promises)).then((langs) => {
            return langs.map((languages, i) => {
                return { ...result[String(i)], languages }
            })
        })
}

export const getReposIds = async () => {
    const repositories = await getRepositories()
    return repositories.map((repo) => {
        return {
            params: {
                id: String(repo.id),
            },
        };
    });
}

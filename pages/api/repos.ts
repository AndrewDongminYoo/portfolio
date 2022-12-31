import { NextApiRequest, NextApiResponse } from 'next';
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import fs from 'fs';
import path from 'path';

export default async function repos(req: NextApiRequest, res: NextApiResponse) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repos: keyof Endpoints = 'GET /user/repos';
    const info: keyof Endpoints = 'GET /repos/{owner}/{repo}';
    const fetchRepositories = async () => {
        const repositories = await octokit
            .request(repos, {
                type: 'public',
                per_page: 100,
                direction: 'desc',
                sort: 'created',
            })
            .then((value) => value.data);
        return repositories
            .filter((_) => !_.fork && _.size > 5000 && _.topics?.length !== 0)
            .map((repo) => reclusiveFilter(repo));
    };

    const fetchRepository = async (owner: string, repo: string) => {
        return await octokit
            .request(info, { owner, repo })
            .then((value) => value.data)
            .then((repo) => reclusiveFilter(repo));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reclusiveFilter = (repo: { [x: string]: any }) => {
        Object.entries(repo).forEach(([key, value]) => {
            switch (typeof value) {
                case 'string': {
                    if (value.endsWith('.git')) {
                        delete repo[key];
                    } else if (key === 'languages_url') {
                        repo[key] = value;
                    } else if (value.startsWith('https://api.github.com/')) {
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
        return repo;
    };

    const downloadJSON = async () => {
        const repositoryData = await fetchRepositories();
        repositoryData.forEach((json) => {
            const reposDirectory = path.join(
                process.cwd(),
                'repos',
                `${json.name}.json`
            );
            fs.writeFile(
                reposDirectory,
                JSON.stringify(json, null, 4),
                { flag: 'w' },
                (err) => {
                    if (err) console.error(err);
                }
            );
        });
        return repositoryData.length;
    };

    const { query, method } = req;
    if (method === 'GET') {
        if (typeof query.full_name === 'string') {
            const [owner, repo] = query.full_name.split('/');
            const repository = await fetchRepository(owner, repo);
            res.status(200).json({ repository });
        } else {
            const repositories = await fetchRepositories();
            res.status(200).json({ repositories });
        }
    } else if (method === 'POST') {
        await downloadJSON().then((length) => {
            res.status(200).send({ length });
        });
    }
}

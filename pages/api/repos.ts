import { NextApiRequest, NextApiResponse } from 'next';
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';
import fs from 'fs';
import path from 'path';

const repos = async (_: NextApiRequest, res: NextApiResponse) => {
    const fetchRepositories = async () => {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const repos: keyof Endpoints = 'GET /user/repos';
        return (
            await octokit
                .request(repos, {
                    type: 'public',
                    per_page: 100,
                    direction: 'desc',
                    sort: 'created',
                })
                .then((value) => value.data)
        ).filter((repo) => !repo.fork && repo.size > 5000 && repo.topics?.length > 0)
            .map((repo) => reclusiveFilter(repo));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reclusiveFilter = (repo: { [x: string]: any }) => {
        Object.entries(repo).forEach(([key, value]) => {
            switch (typeof value) {
                case 'string': {
                    if (value.endsWith('.git')) { delete repo[key]; }
                    else if (key === 'languages_url') { repo[key] = value; }
                    else if (value.startsWith('https://api.github.com/')) { delete repo[key]; }
                    else { repo[key] = value; }
                    break;
                }
                case 'object': {
                    if (key === 'topics') { repo[key] = value; }
                    else if (value === null) { delete repo[key]; }
                    else { repo[key] = reclusiveFilter(value); }
                    break;
                }
                case 'undefined': {
                    delete repo[key]; break;
                }
                default: {
                    repo[key] = value; break;
                }
            }
        });
        return repo;
    };

    const downloadJSON = async () => {
        const repositoryData = await fetchRepositories();
        repositoryData.forEach((json) => {
            const reposDirectory = path.join(process.cwd(), 'repos', `${json.name}.json`);
            fs.writeFile(reposDirectory, JSON.stringify(json, null, 4), { flag: 'w' }, (err) => {
                if (err) console.error(err);
            });
        });
        return repositoryData.length
    }

    if (_.method === 'GET') {
        const repositories = await fetchRepositories();
        res.status(200).json({ repositories });
    } else if (_.method === 'POST') {
        await downloadJSON().then((length) => {
            res.status(200).json({ length });
        })
    }
};

export default repos;

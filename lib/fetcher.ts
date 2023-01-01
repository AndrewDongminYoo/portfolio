import { Axios } from 'axios';

export const githubAxios = new Axios({
    baseURL: 'https://github.com/',
    method: 'GET',
    headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
    },
});

export const selfAPIAxios = new Axios({
    baseURL: process.cwd(),
    method: 'GET',
    responseType: 'json',
    headers: {
        accept: 'application/json',
    },
    transformResponse: (data: string) => {
        return JSON.parse(data);
    },
});

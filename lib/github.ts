/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})
export const request = octokit.request;
type route = keyof Endpoints

const repos: route = "GET /user/repos"
export const getRepositories = async () => {
    return await request(repos, {
        type: "all",
        per_page: 100,
        direction: "asc",
        sort: "created"
    }).then((value) => value.data)
        .then((repos) => {
            const repositories = {};
            repos.forEach(async (repo) => {
                const { owner, name, html_url: url, description, languages_url, topics, visibility, created_at, updated_at, homepage } = repo;
                const isTeam = owner.type === 'Organization'
                const personal = owner.type === 'User'
                repositories[name] = { isTeam: owner.type === 'Organization', url, description, topics, visibility, created_at, updated_at, homepage };
                await fetch(languages_url).then(async e => {
                    const names = e.url.split('/');
                    const name = names[names.length - 2];
                    const data = await e.json();
                    repositories[name]['languages'] = data;
                })
            })
            return repositories;
        })
}
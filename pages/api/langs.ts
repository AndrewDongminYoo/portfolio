import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/core';
import { OpenGraph } from '@typings/repos';
import { parse } from 'node-html-parser';

const ogTags = [
    'url',
    'type',
    'title',
    'image',
    'description',
    'site_name',
    'image:alt',
];

export default async function langs(req: NextApiRequest, res: NextApiResponse) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const { method, query } = req;
    const html_url = `https://github.com/${query.full_name}`;
    const languages_url = `https://api.github.com/repos/${query.full_name}/languages`;
    const languages = (await octokit.request({ method, url: languages_url })).data;
    const meta_tags = await getTagsFromWebsite(html_url);
    res.status(200).json({ languages, meta_tags });
}

const getContent = (rootElement: Pick<Document, 'querySelector'>, t: string) =>
    rootElement
        .querySelector(`meta[property="og:${t}"]`)
        ?.getAttribute('content') ?? null;

async function getTagsFromWebsite(url: string): Promise<OpenGraph> {
    const html = await fetch(url).then((res) => res.text());
    const doc = parse(html);
    return ogTags.reduce((pre, tag) => {
        return { ...pre, [tag]: getContent(doc, tag) };
    }, {}) as unknown as OpenGraph;
}
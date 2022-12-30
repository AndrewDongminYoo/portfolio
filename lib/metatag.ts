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
const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
};
const getContent = (rootElement: Pick<Document, 'querySelector'>, t: string) =>
    rootElement
        .querySelector(`meta[property="og:${t}"]`)
        ?.getAttribute('content') ?? null;

export async function getTagsFromWebsite(url: string): Promise<OpenGraph> {
    const html = await fetch(url, { headers }).then((res) => res.text());
    const doc = parse(html);
    return ogTags.reduce((pre, tag) => {
        return { ...pre, [tag]: getContent(doc, tag) };
    }, {}) as unknown as OpenGraph;
}

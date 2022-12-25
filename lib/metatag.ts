import { OpenGraph } from '@typings/repos';
import { parse } from 'node-html-parser';

const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
};

export async function getTagsFromWebsite(url: string): Promise<OpenGraph> {
    const html = await fetch(url, { headers }).then((res) => res.text());
    const doc = parse(html);
    const getContent = (t: string) => doc.querySelector(`meta[property="og:${t}"]`)?.getAttribute("content") ?? null;
    const ogTags = ["url", "type", "title", "image", "description", "site_name", "image:alt"];
    return ogTags.reduce<{ [k: string]: string | null } | string>((pre, tag) => {
        if (typeof pre === 'string') {
            pre = { [pre]: getContent(pre) };
        }
        return { ...pre, [tag]: getContent(tag) };
    }, {}) as unknown as OpenGraph;
};
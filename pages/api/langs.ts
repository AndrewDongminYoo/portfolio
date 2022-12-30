import { NextApiRequest, NextApiResponse } from 'next';
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

const langs = async (_: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = _;
    if (method === 'GET') {
        if (query?.id) {
            const html_url = "https://github.com/JARYOGOOJO/52market.shop"
            const html = await fetch(html_url).then((res) => res.text());
            const doc = parse(html);
            const meta_tags = ogTags.reduce((pre, tag) => {
                return { ...pre, [tag]: getContent(doc, tag) };
            }, {}) as unknown as OpenGraph;
            res.status(200).json({ meta_tags });
        }
    }
};

const getContent = (rootElement: Pick<Document, 'querySelector'>, t: string) =>
    rootElement
        .querySelector(`meta[property="og:${t}"]`)
        ?.getAttribute('content') ?? null;

export default langs;
import { OpenGraph } from '@typings/repos';
import { parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

export const isDevelopment = process.env.NODE_ENV === 'development';
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
    if (isDevelopment) {
        const html = await fetch(url, { headers }).then((res) => res.text());
        const doc = parse(html);
        return ogTags.reduce((pre, tag) => {
            return { ...pre, [tag]: getContent(doc, tag) };
        }, {}) as unknown as OpenGraph;
    } else {
        try {
            // launch a new headless browser
            const browser = await puppeteer.launch();
            // check for https for safety!
            const page = await browser.newPage();
            // tell the page to visit the url
            await page.goto(url);
            // take a screenshot and save it in the screenshots directory
            const og = await page.evaluate(() => {
                return ogTags.reduce((pre, tag) => {
                    return { ...pre, [tag]: getContent(document, tag) };
                }, {}) as unknown as OpenGraph;
            });
            await browser.close();
            return og as unknown as OpenGraph;
        } catch (e) {
            return {} as OpenGraph;
        }
    }
}

import { OpenGraph } from '@typings/repos';
import { parse } from 'node-html-parser';
import puppeteer from "puppeteer";

export const isDevelopment = process.env.NODE_ENV === "development";
const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
};

export async function getTagsFromWebsite(url: string): Promise<OpenGraph> {
    if (!isDevelopment) {
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
                const initial: { [x: string]: string | null; } = {};
                const ogTags = ["url", "type", "title", "image", "description", "site_name", "image:alt"];
                const getContent = (t: string) => document.querySelector(`meta[property="og:${t}"]`)?.getAttribute("content") ?? null;
                ogTags.forEach((tag) => {
                    initial[tag] = getContent(tag);
                });
                return initial;
            })
            await browser.close()
            return og as unknown as OpenGraph;
        } catch (e){
            return {} as OpenGraph;
        }
    }
};
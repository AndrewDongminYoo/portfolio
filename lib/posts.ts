import {
    Activity,
    Education,
    Experience,
    Project,
    Resume,
} from '../types/profile.types';
import fs from 'fs';
import matter from 'gray-matter';
import { parseISO } from 'date-fns';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        return categorizing(id, matterResult);
    });
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        const index = ['experience', 'project', 'activity', 'education'];
        if (index.indexOf(a.type) > index.indexOf(b.type)) {
            return 1;
        } else if (index.indexOf(a.type) < index.indexOf(b.type)) {
            return -1;
        } else if (parseISO(a.startAt) < parseISO(b.startAt)) {
            return 1;
        } else return -1;
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return categorizing(id, matterResult);
}

const categorizing = (
    id: string,
    matterResult: matter.GrayMatterFile<string>
): Resume => {
    // Combine the data with the id
    const type = id.split('_').shift();
    if (type === 'education') {
        return { id, ...(matterResult.data as Education), type };
    } else if (type === 'experience') {
        return { id, ...(matterResult.data as Experience), type };
    } else if (type === 'project') {
        return { id, ...(matterResult.data as Project), type };
    }
    return { id, ...(matterResult.data as Activity), type: 'activity' };
};

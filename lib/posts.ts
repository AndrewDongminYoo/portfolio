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

export const getSortedPostsData = () => {
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
        if (parseISO(a.startAt) < parseISO(b.startAt)) {
            return 1;
        } else return -1;
    });
}

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export const getPostData = (id: string) => {
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
    const type = id.split('_').shift() as Resume["type"];
    switch (type) {
        case ('education'): return { ...(matterResult.data as Education), id, type };
        case ('activity'): return { ...(matterResult.data as Activity), id, type };
        case ('experience'): return { ...(matterResult.data as Experience), id, type };
        case ('project'): return { ...(matterResult.data as Project), id, type };
    }
};

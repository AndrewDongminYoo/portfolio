import {
    Activity,
    Education,
    Experience,
    Project,
    Resume,
} from '@typings/profile';
import matter, { GrayMatterFile } from 'gray-matter';
import fs from 'fs';
import { parseISO } from 'date-fns';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
    const allPostsData = getAllIds().map((id) => getPostData(id));
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (parseISO(a.startAt) < parseISO(b.startAt)) {
            return 1;
        } else return -1;
    });
};

const getAllIds = () => {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        // Remove '.md' from file name to get id
        return fileName.replace(/\.md$/, '');
    });
}

export const getPostData = (id: string) => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    return categorizing(id, matterResult);
};

const categorizing = (
    id: string,
    mattered: GrayMatterFile<string>
): Resume => {
    // Combine the data with the id
    const type = id.split('_').shift() as Resume['type'];
    switch (type) {
        case 'education':
            return { ...(mattered.data as Education), id, type };
        case 'activity':
            return { ...(mattered.data as Activity), id, type };
        case 'experience':
            return { ...(mattered.data as Experience), id, type };
        case 'project':
            return { ...(mattered.data as Project), id, type };
    }
};

export const getAllPostIds = () =>  getAllIds().map((id) => { return { params: { id } }; });

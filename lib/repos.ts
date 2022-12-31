import { Repository } from '@typings/repos';
import fs from 'fs';
import { parseISO } from 'date-fns';
import path from 'path';

const reposDirectory = path.join(process.cwd(), 'repos');

export const getRepositories = () => {
    const allReposData = getAllIds().map((id) => getRepoData(id));
    // Sort repos by date
    return allReposData.sort((a, b) => {
        if (parseISO(a.updated_at) < parseISO(b.updated_at)) {
            return 1;
        } else return -1;
    });
};

function getAllIds() {
    // Get file names under /repos
    const fileNames = fs.readdirSync(reposDirectory);
    return fileNames.map((fileName) => {
        // Remove '.md' from file name to get id
        return fileName.replace(/\.json$/, '');
    });
};

export const getRepoData = (id: string) => {
    // Read markdown file as string
    const fullPath = path.join(reposDirectory, `${id}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as Repository;
};

export const getReposIds = () => {
    return getRepositories().map((repo) => {
        return { params: { id: String(repo.id) } };
    });
};

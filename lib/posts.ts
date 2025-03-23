import Resume, { Activity, Education, Experience, Project } from 'types/profile';
import matter, { GrayMatterFile } from 'gray-matter';
import fs from 'fs';
import { parseISO } from 'date-fns/parseISO';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'data/posts');

export function getSortedPostsData() {
  const allPostsData = getAllIds().map((id) => getPostData(id));
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (parseISO(a.startAt) < parseISO(b.startAt)) {
      return 1;
    } else return -1;
  });
}

export function getAllIds() {
  // Get file names under /data/posts
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    // Remove '.md' from file name to get id
    return fileName.replace(/\.md$/, '');
  });
}

export function getPostData(post: string) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${post}`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  return categorizing(post, matterResult);
}

export function categorizing(post: string, mattered: GrayMatterFile<string>): Resume {
  // Combine the data with the id
  const type = post.split('_').shift() as Resume['type'];
  switch (type) {
    case 'education':
      return { ...(mattered.data as Education), id: post, type };
    case 'activity':
      return { ...(mattered.data as Activity), id: post, type };
    case 'experience':
      return { ...(mattered.data as Experience), id: post, type };
    case 'project':
      return { ...(mattered.data as Project), id: post, type };
  }
}

export function getAllPostIds() {
  return getAllIds().map((post) => {
    return { params: { post } };
  });
}

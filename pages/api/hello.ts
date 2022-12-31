import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedPostsData } from '@lib/posts';

export default function hello(_: NextApiRequest, res: NextApiResponse) {
    const postData = getSortedPostsData();
    res.status(200).json({ postData });
};
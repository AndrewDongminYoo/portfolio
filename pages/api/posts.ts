import { NextApiRequest, NextApiResponse } from 'next';
import { getPostData, getSortedPostsData } from 'lib/posts';

export default function posts(req: NextApiRequest, res: NextApiResponse) {
  const { query, method } = req;
  if (method === 'GET') {
    if (typeof query.id === 'string') {
      const data = getPostData(query.id);
      res.status(200).json(data);
    } else {
      const postData = getSortedPostsData();
      res.status(200).json({ postData });
    }
  }
}

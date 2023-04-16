import { NextApiRequest, NextApiResponse } from 'next';
import {
    downloadJSON,
    fetchRepositories,
    fetchRepository,
    readData,
    readRepositories,
} from '@/lib/repos';

export default async function repos(req: NextApiRequest, res: NextApiResponse) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const { query, method } = req;
    if (method === 'GET') {
        if (typeof query.full_name === 'string') {
            const [owner, repo] = query.full_name.split('/');
            const repository = isDevelopment ? await fetchRepository(owner, repo) : readData(repo);
            res.status(200).json({ repository });
        } else {
            const repositories = isDevelopment ? await fetchRepositories() : readRepositories();
            res.status(200).json({ repositories });
        }
    } else if (method === 'POST' && isDevelopment) {
        await downloadJSON().then((length) => {
            res.status(200).send({ length });
        });
    }
}

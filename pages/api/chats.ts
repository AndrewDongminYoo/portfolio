import { NextApiRequest, NextApiResponse } from 'next';
import fetchChatBot from '@/lib/openai';

export default async function chats(req: NextApiRequest, res: NextApiResponse) {
    const { body, method, query } = req;
    let input: string | string[] | undefined;
    if (method === 'GET') {
        input = query.prompt;
    } else if (method === 'POST') {
        input = body;
    }
    const response = await fetchChatBot(input);
    if ('error' in response) {
        const { message, type } = response?.error;
        res.status(400).json({ message, type });
    } else {
        res.status(200).json(response);
    }
}

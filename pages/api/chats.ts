import { NextApiRequest, NextApiResponse } from 'next';
import fetchChatBot from 'lib/openai';

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
        res.status(400).json({ ...response.error });
    } else {
        res.status(200).json(response);
    }
}

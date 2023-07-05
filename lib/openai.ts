import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY, OPENAI_ORGANIZATION } from '@/env';
import { encode } from 'gpt-3-encoder';
import { isAxiosError } from 'axios';

const MAX_TOKENS = 4000;
const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION,
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function fetchChatBot(query: string | string[] | undefined) {
    let prompt: number[] = [];
    let tokens = 0;
    if (typeof query === 'undefined') {
        return 'Be sure to enter a prompt. If you do not type, the conversation with the chatbot will start all over again.';
    } else if (typeof query === 'string') {
        prompt = encode(query);
        tokens = prompt.length;
    } else {
        // query is string[]
        for (const q in query) {
            prompt.push(...encode(q));
        }
        tokens = prompt.length;
    }
    const max_tokens = MAX_TOKENS - tokens;
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            temperature: 0.6,
            max_tokens,
        });
        const { data, headers, status } = response;
        console.debug('🚀 - file: openai.ts:13 - prompt', prompt);
        console.debug('🚀 - file: openai.ts:26 - limits', max_tokens);
        console.debug('🚀 - file: openai.ts:34 - timeout', headers['openai-processing-ms']);
        if (status === 200) {
            const { created, choices, usage } = data;
            console.debug('🚀 - file: openai.ts:39 - choices', choices);
            console.debug('🚀 - file: openai.ts:39 - created', created);
            console.debug('🚀 - file: openai.ts:39 - usage', usage);
            return choices[0].text?.trim().split(/\n+/g);
        } else {
            return data;
        }
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            return e.response?.data;
        }
        throw e;
    }
}

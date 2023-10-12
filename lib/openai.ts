import OpenAI from 'openai';
import { encode } from 'gpt-3-encoder';

const MAX_TOKENS = 4000;
const { OPENAI_API_KEY, OPENAI_ORGANIZATION } = process.env;
const configuration = {
    organization: OPENAI_ORGANIZATION,
    apiKey: OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

export default async function fetchChatBot(query: string[]): Promise<string[]> {
    const prompt: number[] = [];
    let tokens = 0;

    // query is string[]
    for (const q in query) {
        prompt.push(...encode(q));
    }
    tokens = prompt.length;
    const max_tokens = MAX_TOKENS - tokens;
    try {
        const completion = await openai.chat.completions.create({
            model: 'text-davinci-003',
            messages: [],
            temperature: 0.6,
            max_tokens,
        });
        const { choices, created, id, model, object, usage } = completion;
        console.debug('🚀 - file: openai.ts:31 - id', id);
        console.debug('🚀 - file: openai.ts:32 - model', model);
        console.debug('🚀 - file: openai.ts:33 - object', object);
        console.debug('🚀 - file: openai.ts:34 - prompt', prompt);
        console.debug('🚀 - file: openai.ts:35 - limits', max_tokens);
        console.debug('🚀 - file: openai.ts:36 - choices', choices);
        console.debug('🚀 - file: openai.ts:37 - created', created);
        console.debug('🚀 - file: openai.ts:38 - usage', usage);
        return choices[0].message.content!.trim().split(/\n+/g) ?? [];
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
}

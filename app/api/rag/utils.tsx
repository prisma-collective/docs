import OpenAI from 'openai';
import { Dewy } from 'dewy-ts';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Create Dewy and OpenAI clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
const dewy = new Dewy({
    BASE: process.env.DEWY_ENDPOINT
})

export async function getContext(query: string) {
    if (!process.env.DEWY_COLLECTION) {
        throw new Error('DEWY_COLLECTION environment variable is not set');
    }

    // Search Dewy for chunks relevant to the given query
    const context = await dewy.kb.retrieveChunks({
        collection: process.env.DEWY_COLLECTION,
        query: query,
        n: 10,
    });

    return context.text_results.map((c: any) => c.chunk.text).join("\n");
}

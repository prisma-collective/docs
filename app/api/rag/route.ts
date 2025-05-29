import { streamText } from 'ai';
import { getContext } from "./utils";
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    const json = await req.json()
    const { messages } = json
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    
    // Get context from Dewy
    const context = await getContext(lastMessage.content);
    
    // Create system message with context
    const systemMessage = {
        role: 'system',
        content: `You are a helpful assistant.
            You will take into account any CONTEXT BLOCK
            that is provided in a conversation.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK`
    };

    // Generate a response using streamText
    const { textStream } = streamText({
        model: openai('gpt-3.5-turbo'),
        messages: [systemMessage, ...messages],
        temperature: 0.7,
    });

    // Return the stream
    return new Response(textStream);
}
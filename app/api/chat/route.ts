import { streamText } from 'ai';
import { getContext } from './utils';
import { openai } from '@ai-sdk/openai';

// Optional: Set timeout for long streams
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];

  const context = await getContext(lastMessage.content);

  const systemMessage = {
    role: 'system',
    content: `You are a helpful assistant.
    You will take into account any CONTEXT BLOCK
    that is provided in a conversation.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK`,
  };

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [systemMessage, ...messages],
    temperature: 0.7,
  });

  return result.toDataStreamResponse(); 
}

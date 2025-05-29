'use client';

import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';

export default function ChatRAG() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/rag', 
  });

  return (
    <div className="p-4">
      <div className="space-y-2 mb-4">
        {messages.map((message: Message) => (
          <div key={message.id} className="text-sm">
            <strong>{message.role === 'user' ? 'User' : 'AI'}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-white text-black px-4 py-2 rounded-2xl">
          Submit
        </button>
      </form>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Tabs } from 'nextra/components';
import ChatEntryList from './ChatEntriesList';

type Chat = {
  id: string;
  name: string;
};

export default function DynamicChatsTabs() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetch('/api/chats')
      .then((res) => res.json())
      .then((data) => setChats(data.chats))
      .catch((err) => console.error('Failed to fetch chats:', err));
  }, []);

  if (chats.length === 0) return <p>Loading chats...</p>;

  return (
    <Tabs items={chats.map((chat) => chat.name)}>
      {chats.map((chat) => (
        <Tabs.Tab key={chat.id}>
          <ChatEntryList chatId={chat.id} />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

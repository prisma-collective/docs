'use client';

import { useEffect, useState } from 'react';
import { Tabs } from 'nextra/components';
import TopicTabs from './TopicTabs';

type Chat = {
  id: string;
  type: string;
  title: string;
  username: string;
  topic: string;
  displayName: string;
};

type TeamTabsProps = {
  filterTopics: string[]; 
};

export default function TeamTabs({ filterTopics }: TeamTabsProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetch('/api/chats/list?type=supergroup')
      .then((res) => res.json())
      .then((data) => setChats(data.chats))
      .catch((err) => console.error('Failed to fetch chats:', err));
  }, []);

  if (chats.length === 0) return <p>Loading chats...</p>;

  console.log(`Found ${chats.length} chats: ${chats.join(',')}`)

  const chatsByTeam = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    if (!acc[chat.title]) acc[chat.title] = [];
    acc[chat.title].push(chat);
    return acc;
  }, {});

  const teamNames = Object.keys(chatsByTeam);
  console.log(`Found ${teamNames.length} teams: ${teamNames.join(',')}`)

  return (
    <Tabs items={teamNames}>
      {teamNames.map((team) => (
        <Tabs.Tab key={team}>
          <TopicTabs 
            chats={chatsByTeam[team]} 
            filterTopics={filterTopics}
          />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

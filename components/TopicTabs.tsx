import { Tabs } from 'nextra/components';

type Chat = {
  id: string;
  type: string;
  title: string;
  username: string;
  topic: string;
  displayName: string;
};

type TopicTabsProps = {
  chats: Chat[];
  filterTopics: string[]; 
};

export default function TopicTabs({ chats, filterTopics }: TopicTabsProps) {
  // Filter chats by topics that are included in the filterTopics list
  const filteredChats = chats.filter(chat => filterTopics.includes(chat.topic));

  return (
    <Tabs items={filteredChats.map((chat) => chat.topic)}>
      {filteredChats.map((chat) => (
        <Tabs.Tab key={chat.id}>
          {/* Replace below with your actual rendering */}
          {/* <ChatEntryList chatId={chat.id} /> */}
          <p>Topic ID: {chat.id}</p>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

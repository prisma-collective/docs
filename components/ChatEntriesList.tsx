'use client';

import { useEffect, useState } from 'react';
import EntryPreview from './EntryPreview';

type Entry = {
  type: string;
  [key: string]: any;
};

export default function ChatEntryList({ chatId }: { chatId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch(`/api/chats/${chatId}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.entries))
      .catch((err) => console.error(`Failed to fetch entries for chat ${chatId}:`, err));
  }, [chatId]);

  if (entries.length === 0) return <p>No entries found.</p>;

  return (
    <div className="space-y-4">
      {entries.map((entry, idx) => (
        <EntryPreview key={idx} entry={entry} type={entry.type} />
      ))}
    </div>
  );
}

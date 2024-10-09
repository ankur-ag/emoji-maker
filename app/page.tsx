'use client';

import { useState } from 'react';
import { EmojiGrid } from '@/components/ui/emoji-grid';
import { EmojiGenerator } from '@/components/EmojiGenerator';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEmoji = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Emoji Magic</h2>
        </div>
        <EmojiGenerator onNewEmoji={handleNewEmoji} />
        <EmojiGrid refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}

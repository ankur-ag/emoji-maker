'use client';

import { useState } from 'react';
import { EmojiGrid } from '@/components/ui/emoji-grid';
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { EmojiGenerator } from '@/components/EmojiGenerator';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEmoji = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <SignedIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Emoji Maker</h2>
          </div>
          <EmojiGenerator onNewEmoji={handleNewEmoji} />
          <EmojiGrid refreshTrigger={refreshTrigger} />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </main>
    </div>
  );
}

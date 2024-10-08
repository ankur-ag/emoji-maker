'use client';

import { useState } from 'react';
import { EmojiGrid } from '@/components/ui/emoji-grid';
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { EmojiGenerator } from '@/components/EmojiGenerator';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const handleNewEmoji = (newEmoji: Emoji) => {
    setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
  };

  const handleLike = (id: string, isLiked: boolean) => {
    setEmojis((prevEmojis) =>
      prevEmojis.map((emoji) =>
        emoji.id === id ? { ...emoji, likes: emoji.likes + (isLiked ? 1 : -1) } : emoji
      )
    );
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <SignedIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Emoji Maker</h2>
          </div>
          <EmojiGenerator onNewEmoji={handleNewEmoji} />
          <EmojiGrid emojis={emojis} onLike={handleLike} />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </main>
    </div>
  );
}

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

  const handleLikeToggle = async (id: string, isLiked: boolean): Promise<number> => {
    try {
      const response = await fetch('/api/like-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emojiId: id, isLiked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      return data.likes_count;
    } catch (error) {
      console.error('Error updating like:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <main className="w-full max-w-4xl px-4">
        <SignedIn>
          <h1 className="text-4xl font-bold text-center mb-8">Emoji Maker</h1>
          <EmojiGenerator onNewEmoji={handleNewEmoji} />
          <EmojiGrid onLike={handleLikeToggle} refreshTrigger={refreshTrigger} />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </main>
    </div>
  );
}

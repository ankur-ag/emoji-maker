'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { EmojiGeneratorForm } from '@/components/ui/emoji-generator-form';
import { EmojiGrid } from '@/components/ui/emoji-grid';
import { Card } from '@/components/ui/card';
import { SignedIn, SignedOut, SignIn, SignInButton } from "@clerk/nextjs";
import Image from 'next/image';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestEmoji, setLatestEmoji] = useState<Emoji | null>(null);

  const generateEmoji = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate emoji');
      }

      const data = await response.json();
      const newEmoji = { id: Date.now().toString(), url: data.url, prompt, likes: 0 };
      setLatestEmoji(newEmoji);
      setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
    } catch (error) {
      console.error('Error generating emoji:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLike = (id: string, isLiked: boolean) => {
    setEmojis((prevEmojis) =>
      prevEmojis.map((emoji) =>
        emoji.id === id ? { ...emoji, likes: emoji.likes + (isLiked ? 1 : -1) } : emoji
      )
    );
    if (latestEmoji && latestEmoji.id === id) {
      setLatestEmoji((prev) => prev ? {...prev, likes: prev.likes + (isLiked ? 1 : -1)} : null);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <SignedIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Emoji Maker</h2>
          </div>
          <EmojiGeneratorForm onGenerate={generateEmoji} />
          
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : latestEmoji ? (
            <Card className="p-4 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">Latest Generated Emoji</h2>
              <Image src={latestEmoji.url} alt={latestEmoji.prompt} width={200} height={200} className="w-auto h-auto" />
              <p className="mt-2 text-center">{latestEmoji.prompt}</p>
            </Card>
          ) : null}
          
          <EmojiGrid emojis={emojis} onLike={handleLike} />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { EmojiGeneratorForm } from '@/components/ui/emoji-generator-form';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
}

interface EmojiGeneratorProps {
  onNewEmoji: (emoji: Emoji) => void;
}

export function EmojiGenerator({ onNewEmoji }: EmojiGeneratorProps) {
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
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate emoji');
      }

      const data = await response.json();
      const newEmoji: Emoji = {
        id: data.emoji.id,
        url: data.emoji.image_url,
        prompt: data.emoji.prompt,
        likes: 0,
      };
      setLatestEmoji(newEmoji);
      onNewEmoji(newEmoji);
    } catch (error) {
      console.error('Error generating emoji:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
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
    </>
  );
}
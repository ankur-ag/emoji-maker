import Image from 'next/image';
import { Button } from './button';
import { Card } from './card';
import { Download, Heart } from 'lucide-react';
import { useState } from 'react';

type Emoji = {
  id: string;
  url: string;
  prompt: string;
  likes: number;
};

type EmojiGridProps = {
  emojis: Emoji[];
  onLike: (id: string, isLiked: boolean) => void;
};

export function EmojiGrid({ emojis, onLike }: EmojiGridProps) {
  const [likedEmojis, setLikedEmojis] = useState<Set<string>>(new Set());

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `emoji-${prompt.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading emoji:', error);
    }
  };

  const handleLike = (id: string) => {
    setLikedEmojis((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    onLike(id, !likedEmojis.has(id));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="relative group">
          <Image src={emoji.url} alt={emoji.prompt} width={100} height={100} className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:text-blue-400"
              onClick={() => handleDownload(emoji.url, emoji.prompt)}
            >
              <Download className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`text-white ${likedEmojis.has(emoji.id) ? 'text-red-400' : 'hover:text-red-400'}`}
              onClick={() => handleLike(emoji.id)}
            >
              <Heart className={`h-6 w-6 ${likedEmojis.has(emoji.id) ? 'fill-current' : ''}`} />
              <span className="ml-1">{emoji.likes}</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
import Image from 'next/image';
import { Card } from './card';
import { Heart, Download } from 'lucide-react';
import { LikeHearts } from './like-hearts';
import { Emoji } from '@/types';

interface EmojiCardProps {
  emoji: Emoji;
  onLikeToggle: (id: string, isLiked: boolean) => void;
}

export function EmojiCard({ emoji, onLikeToggle }: EmojiCardProps) {
  const handleDownload = () => {
    // ... (keep existing download logic)
  };

  return (
    <Card className="p-4 flex flex-col items-center relative group">
      <Image src={emoji.image_url} alt={emoji.prompt} width={100} height={100} className="w-auto h-auto" />
      <p className="mt-2 text-center">{emoji.prompt}</p>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onLikeToggle(emoji.id, emoji.liked_by_user)} 
          className={`p-2 transition-colors ${emoji.liked_by_user ? 'text-red-500' : 'text-white hover:text-red-500'}`}
          aria-label={emoji.liked_by_user ? "Unlike" : "Like"}
        >
          <Heart fill={emoji.liked_by_user ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={handleDownload} 
          className="text-white p-2 hover:text-blue-500 transition-colors"
          aria-label="Download"
        >
          <Download />
        </button>
      </div>
      <LikeHearts count={emoji.likes_count} />
    </Card>
  );
}
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from './card';
import { Heart, Download } from 'lucide-react';
import { LikeHearts } from './like-hearts';

interface Emoji {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
  liked_by_user: boolean;
}

interface EmojiGridProps {
  onLike: (id: string, isLiked: boolean) => Promise<number>;
  refreshTrigger: number;
}

export function EmojiGrid({ onLike, refreshTrigger }: EmojiGridProps) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/get-emojis');
      if (!response.ok) {
        throw new Error('Failed to fetch emojis');
      }
      const data = await response.json();
      setEmojis(data.emojis);
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  useEffect(() => {
    fetchEmojis();
  }, [refreshTrigger]);

  const handleDownload = (imageUrl: string, prompt: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `emoji-${prompt}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => console.error('Error downloading emoji'));
  };

  const handleLikeToggle = async (id: string) => {
    const emoji = emojis.find(e => e.id === id);
    if (!emoji) return;

    const newIsLiked = !emoji.liked_by_user;
    const optimisticLikesCount = newIsLiked ? emoji.likes_count + 1 : Math.max(emoji.likes_count - 1, 0);

    // Immediately update UI
    setEmojis(prevEmojis => 
      prevEmojis.map(e => 
        e.id === id ? { ...e, liked_by_user: newIsLiked, likes_count: optimisticLikesCount } : e
      )
    );

    try {
      // Make API call in the background
      const newLikesCount = await onLike(id, newIsLiked);
      
      // Update with the actual count from the server
      setEmojis(prevEmojis => 
        prevEmojis.map(e => 
          e.id === id ? { ...e, likes_count: newLikesCount } : e
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert the optimistic update in case of error
      setEmojis(prevEmojis => 
        prevEmojis.map(e => 
          e.id === id ? { ...e, liked_by_user: !newIsLiked, likes_count: emoji.likes_count } : e
        )
      );
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="p-4 flex flex-col items-center relative group">
          <Image src={emoji.image_url} alt={emoji.prompt} width={100} height={100} className="w-auto h-auto" />
          <p className="mt-2 text-center">{emoji.prompt}</p>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleLikeToggle(emoji.id)} 
              className={`p-2 transition-colors ${emoji.liked_by_user ? 'text-red-500' : 'text-white hover:text-red-500'}`}
              aria-label={emoji.liked_by_user ? "Unlike" : "Like"}
            >
              <Heart fill={emoji.liked_by_user ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => handleDownload(emoji.image_url, emoji.prompt)} 
              className="text-white p-2 hover:text-blue-500 transition-colors"
              aria-label="Download"
            >
              <Download />
            </button>
          </div>
          <LikeHearts count={emoji.likes_count} />
        </Card>
      ))}
    </div>
  );
}
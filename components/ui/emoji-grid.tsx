import { useEffect, useState } from 'react';
import { Emoji } from '@/types';
import { fetchEmojis, likeEmoji } from '@/utils/api';
import { EmojiCard } from './emoji-card';

interface EmojiGridProps {
  refreshTrigger: number;
}

export function EmojiGrid({ refreshTrigger }: EmojiGridProps) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    fetchEmojis().then(data => setEmojis(data.emojis));
  }, [refreshTrigger]);

  const handleLikeToggle = async (id: string, currentLikedState: boolean) => {
    const emoji = emojis.find(e => e.id === id);
   if (!emoji) return;

    const newIsLiked = !currentLikedState;
    const optimisticLikesCount = newIsLiked ? emoji.likes_count + 1 : Math.max(emoji.likes_count - 1, 0);

    setEmojis(prevEmojis => 
      prevEmojis.map(e => 
        e.id === id ? { ...e, liked_by_user: newIsLiked, likes_count: optimisticLikesCount } : e
      )
    );

    try {
      const newLikesCount = await likeEmoji(id, newIsLiked);
      setEmojis(prevEmojis => 
        prevEmojis.map(e => 
          e.id === id ? { ...e, likes_count: newLikesCount } : e
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert the optimistic update
      setEmojis(prevEmojis => 
        prevEmojis.map(e => 
          e.id === id ? { ...e, liked_by_user: currentLikedState, likes_count: emoji.likes_count } : e
        )
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <EmojiCard 
          key={emoji.id} 
          emoji={emoji} 
          onLikeToggle={handleLikeToggle} 
        />
      ))}
    </div>
  );
}
import { Heart } from 'lucide-react';

interface LikeHeartsProps {
  count: number;
}

export function LikeHearts({ count }: LikeHeartsProps) {
  return (
    <div className="flex items-center mt-2 text-sm text-gray-500">
      <Heart size={16} className="text-red-500 mr-1" />
      <span>{count}</span>
    </div>
  );
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { emojiId, isLiked } = await request.json();

  if (!emojiId) {
    return NextResponse.json({ error: 'Emoji ID is required' }, { status: 400 });
  }

  try {
    // Check if the user has already liked this emoji
    const { data: existingLike, error: likeError } = await supabase
      .from('emoji_likes')
      .select()
      .eq('user_id', userId)
      .eq('emoji_id', emojiId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') {
      throw likeError;
    }

    if (isLiked && !existingLike) {
      // Like the emoji
      await supabase.from('emoji_likes').insert({ user_id: userId, emoji_id: emojiId });
      await supabase.rpc('increment_likes', { emoji_id: emojiId });
    } else if (!isLiked && existingLike) {
      // Unlike the emoji
      await supabase.from('emoji_likes').delete().eq('user_id', userId).eq('emoji_id', emojiId);
      await supabase.rpc('decrement_likes', { emoji_id: emojiId });
    }

    // Get the updated likes count
    const { data: updatedEmoji, error: emojiError } = await supabase
      .from('emojis')
      .select('likes_count')
      .eq('id', emojiId)
      .single();

    if (emojiError) throw emojiError;

    return NextResponse.json({ likes_count: updatedEmoji.likes_count });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
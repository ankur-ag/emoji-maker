import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';
import { Emoji } from '@/types';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabase
      .from('emojis')
      .select(`
        *,
        liked_by_user:emoji_likes(user_id)
      `)
      .eq('liked_by_user.user_id', userId)
      .order('inserted_at', { ascending: false });

    if (error) throw error;
    console.log("data: is here " + data[0].liked_by_user);
    const emojisWithLikedStatus = data.map((emoji: Emoji) => ({
      ...emoji,
      liked_by_user: Array.isArray(emoji.liked_by_user) && emoji.liked_by_user.length > 0
    }));
    console.log("emojisWithLikedStatus: is here " + emojisWithLikedStatus);
    return NextResponse.json({ emojis: emojisWithLikedStatus });
  } catch (error) {
    console.error('Error fetching emojis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      // User already exists, return their ID
      return NextResponse.json({ userId: existingUser.user_id });
    }

    // User doesn't exist, create a new one
    const { data, error } = await supabase
      .from('users')
      .insert({ user_id: userId })
      .select('user_id')
      .single();

    if (error) throw error;

    return NextResponse.json({ userId: data.user_id });
  } catch (error) {
    console.error('Error creating/fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
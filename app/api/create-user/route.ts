import { NextRequest, NextResponse } from 'next/server';
import { createOrGetUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await createOrGetUser(userId);
    return NextResponse.json({ userId: user.user_id });
  } catch (error) {
    console.error('Error creating/fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
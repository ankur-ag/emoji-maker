import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    // Step 1: Generate emoji using Replicate
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: "Generate a TOK emoji for" + prompt,
        }
      }
    );

    if (!output || !Array.isArray(output) || typeof output[0] !== 'string') {
      throw new Error('Failed to generate emoji');
    }

    const imageUrl = output[0];

    // Step 2: Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Step 3: Upload to Supabase Storage
    const fileName = `${userId}_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('emojis')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('emojis')
      .getPublicUrl(fileName);

    // Step 4: Create a row in the emojis table
    const { data: emojiData, error: emojiError } = await supabase
      .from('emojis')
      .insert({
        image_url: publicUrl,
        prompt: prompt,
        user_id: userId,
      })
      .select()
      .single();

    if (emojiError) {
      throw emojiError;
    }

    return NextResponse.json({ emoji: emojiData });
  } catch (error) {
    console.error('Error generating and uploading emoji:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
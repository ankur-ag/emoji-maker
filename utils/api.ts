export async function likeEmoji(id: string, isLiked: boolean): Promise<number> {
  const response = await fetch('/api/like-emoji', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emojiId: id, isLiked }),
  });

  if (!response.ok) {
    throw new Error('Failed to update like');
  }

  const data = await response.json();
  return data.likes_count;
}

export async function generateEmoji(prompt: string) {
  const response = await fetch('/api/generate-emoji', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate emoji');
  }

  return response.json();
}

export async function fetchEmojis() {
  const response = await fetch('/api/get-emojis');
  if (!response.ok) {
    throw new Error('Failed to fetch emojis');
  }
  return response.json();
}
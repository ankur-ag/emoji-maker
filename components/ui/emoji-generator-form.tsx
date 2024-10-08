import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';

export function EmojiGeneratorForm({ onGenerate }: { onGenerate: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <Input
        type="text"
        placeholder="Enter a prompt to generate an emoji"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button type="submit">Generate</Button>
    </form>
  );
}
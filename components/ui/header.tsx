import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-4xl">
      <div className="flex items-center gap-2">
        <Image src="/path-to-emoji-icon.png" alt="Emoji Maker" width={40} height={40} />
        <h1 className="text-2xl font-bold">Emoji Maker</h1>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </header>
  );
}
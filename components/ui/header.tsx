import Image from 'next/image';
import { SignedIn, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <SignedIn>
      <header className="w-full flex justify-center py-4">
        <div className="w-full max-w-4xl flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/images/fav-icon.png" alt="Emoji Maker" width={40} height={40} />
            <h1 className="text-2xl font-bold">Emoji Magic ✨</h1>
          </div>
            <UserButton />
        </div>
      </header>
    </SignedIn>
  );
}
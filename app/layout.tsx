import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { Header } from "@/components/ui/header";
import { UserInitializer } from "@/components/UserInitializer";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Emoji Maker",
  description: "Generate custom emojis with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <UserInitializer />
          <SignedIn>
            <Header />
            <div className="flex justify-center w-full">
              <main className="w-full max-w-4xl px-4">
                {children}
              </main>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                  Welcome to Emoji Magic ✨
                </h1>
                <p className="text-xl text-white mb-8">
                  Transform your words into emojis with a sprinkle of AI magic!
                </p>
                <SignInButton mode="modal">
                  <button className="bg-white text-purple-600 hover:bg-purple-100 font-semibold py-2 px-6 rounded-full text-lg">
                    Login to Start
                  </button>
                </SignInButton>
              </div>
            </div>
        </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}

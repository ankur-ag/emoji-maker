import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { Header } from "@/components/ui/header";
import { UserInitializer } from "@/components/UserInitializer";

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
          <Header />
          <div className="flex justify-center w-full">
            <main className="w-full max-w-4xl px-4">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

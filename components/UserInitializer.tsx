"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function UserInitializer() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const initializeUser = async () => {
        try {
          const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          });

          if (!response.ok) {
            throw new Error('Failed to initialize user');
          }

          // User has been created or already exists
          router.refresh();
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      };

      initializeUser();
    }
  }, [isLoaded, user, router]);

  return null; // This component doesn't render anything
}
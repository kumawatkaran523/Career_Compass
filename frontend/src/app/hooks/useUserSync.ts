import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (!isLoaded || !user) return;

      setSyncing(true);

      try {
        const response = await fetch('http://localhost:5000/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync user');
        }

        const result = await response.json();
        setDbUserId(result.data.id);
        
        localStorage.setItem('dbUserId', result.data.id);
        
        console.log('User synced to database:', result.data);
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setSyncing(false);
      }
    };

    syncUserToDatabase();
  }, [user, isLoaded]);

  return { dbUserId, syncing, clerkUser: user };
};

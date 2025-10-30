import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserToDatabase = async () => {
      // Wait for Clerk to load
      if (!isLoaded) {
        console.log("⏳ Clerk loading...");
        return;
      }

      // No user logged in
      if (!user) {
        console.log("👤 No user logged in");
        // Clear localStorage on logout
        const existingUserId = localStorage.getItem("dbUserId");
        if (existingUserId) {
          localStorage.removeItem("dbUserId");
          setDbUserId(null);
        }
        return;
      }

      // Check if already synced (CRITICAL FIX)
      const existingUserId = localStorage.getItem("dbUserId");
      if (existingUserId) {
        console.log("✅ User already synced:", existingUserId);
        setDbUserId(existingUserId);
        return; // Don't sync again
      }

      // Only sync if not already synced
      setSyncing(true);
      setError(null);

      try {
        console.log("🔄 Syncing user to database...", user.id);

        const response = await fetch("http://localhost:5000/api/users/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          throw new Error("Failed to sync user");
        }

        const result = await response.json();
        const userId = result.data.id;

        setDbUserId(userId);
        localStorage.setItem("dbUserId", userId);

        console.log("✅ User synced successfully:", userId);
      } catch (err: any) {
        console.error("❌ Error syncing user:", err);
        setError(err.message);
      } finally {
        setSyncing(false);
      }
    };

    syncUserToDatabase();
  }, [user?.id, isLoaded]); // Changed: Only watch user.id, not entire user object

  return { dbUserId, syncing, error, clerkUser: user };
};

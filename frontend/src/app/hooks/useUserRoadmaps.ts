import { useState, useEffect } from 'react';

interface Roadmap {
  id: string;
  technology: string;
  duration: string;
  difficulty: string;
  totalWeeks: number;
  estimatedHours: number;
  content: any;
  createdAt: string;
}

export const useUserRoadmaps = (userId: string | null) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = async () => {
    if (!userId) {
      setRoadmaps([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/roadmap/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch roadmaps');
      }

      const result = await response.json();
      setRoadmaps(result.data);
      console.log('Loaded user roadmaps:', result.data.length);
    } catch (err: any) {
      console.error('Error fetching roadmaps:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [userId]);

  return { roadmaps, loading, error, refetch: fetchRoadmaps };
};

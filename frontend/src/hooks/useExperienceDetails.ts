import { useState, useEffect } from 'react';
import { getExperienceById } from '../services/api';
import type { ExperienceDetails } from '../types';

interface UseExperienceDetailsReturn {
  experience: ExperienceDetails | null;
  loading: boolean;
  error: string | null;
}

export const useExperienceDetails = (id: string): UseExperienceDetailsReturn => {
  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExperienceById(id);
        setExperience(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experience details');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  return { experience, loading, error };
};

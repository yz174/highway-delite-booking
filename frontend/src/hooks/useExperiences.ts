import { useState, useEffect, useCallback } from 'react';
import { getExperiences } from '../services/api';
import type { Experience } from '../types';

interface UseExperiencesReturn {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  fetchExperiences: (search?: string) => Promise<void>;
}

export const useExperiences = (): UseExperiencesReturn => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExperiences(search);
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, error, fetchExperiences };
};

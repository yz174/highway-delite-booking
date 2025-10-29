import { useState } from 'react';
import { createBooking } from '../services/api';
import type { BookingRequest, BookingResponse } from '../types';

interface UseBookingReturn {
  createBookingRequest: (bookingData: BookingRequest) => Promise<BookingResponse | null>;
  loading: boolean;
  error: string | null;
}

export const useBooking = (): UseBookingReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBookingRequest = async (bookingData: BookingRequest): Promise<BookingResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await createBooking(bookingData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBookingRequest, loading, error };
};

import { useState } from 'react';
import { validatePromoCode } from '../services/api';
import type { PromoCodeRequest, PromoCodeResponse } from '../types';

interface UsePromoCodeReturn {
  discount: PromoCodeResponse | null;
  validateCode: (promoData: PromoCodeRequest) => Promise<PromoCodeResponse | null>;
  loading: boolean;
  error: string | null;
  clearDiscount: () => void;
}

export const usePromoCode = (): UsePromoCodeReturn => {
  const [discount, setDiscount] = useState<PromoCodeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async (promoData: PromoCodeRequest): Promise<PromoCodeResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await validatePromoCode(promoData);
      setDiscount(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid promo code';
      setError(errorMessage);
      setDiscount(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearDiscount = () => {
    setDiscount(null);
    setError(null);
  };

  return { discount, validateCode, loading, error, clearDiscount };
};

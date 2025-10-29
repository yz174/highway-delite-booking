import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  Experience,
  ExperienceDetails,
  BookingRequest,
  BookingResponse,
  PromoCodeRequest,
  PromoCodeResponse,
} from '../types';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom error class for API errors
export class ApiError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as any;
      const errorCode = errorData?.error?.code || 'UNKNOWN_ERROR';
      const errorMessage = errorData?.error?.message || 'An error occurred';
      const statusCode = error.response.status;

      // Map specific error codes to user-friendly messages
      let userMessage = errorMessage;
      
      if (errorCode === 'SLOT_UNAVAILABLE') {
        userMessage = 'Sorry, this time slot is no longer available. Please select another slot.';
      } else if (errorCode === 'INVALID_PROMO_CODE') {
        userMessage = 'Invalid or expired promo code. Please check and try again.';
      } else if (errorCode === 'VALIDATION_ERROR') {
        userMessage = errorMessage || 'Please check your input and try again.';
      } else if (statusCode === 404) {
        userMessage = 'The requested resource was not found.';
      } else if (statusCode >= 500) {
        userMessage = 'Server error. Please try again later.';
      }

      return Promise.reject(new ApiError(userMessage, errorCode, statusCode));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new ApiError(
        'Network error. Please check your internet connection and try again.',
        'NETWORK_ERROR'
      ));
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      return Promise.reject(new ApiError(
        'Request timeout. Please try again.',
        'TIMEOUT_ERROR'
      ));
    } else {
      // Something else happened
      return Promise.reject(new ApiError(
        'An unexpected error occurred. Please try again.',
        'UNKNOWN_ERROR'
      ));
    }
  }
);

// API functions

/**
 * Fetch all experiences with optional search query
 */
export const getExperiences = async (search?: string): Promise<Experience[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get<{ success: boolean; data: Experience[] }>('/experiences', { params });
  return response.data.data;
};

/**
 * Fetch single experience by ID with available slots
 */
export const getExperienceById = async (id: string): Promise<ExperienceDetails> => {
  const response = await apiClient.get<{ success: boolean; data: ExperienceDetails }>(`/experiences/${id}`);
  return response.data.data;
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const response = await apiClient.post<{ success: boolean; data: BookingResponse }>('/bookings', bookingData);
  return response.data.data;
};

/**
 * Validate promo code and get discount details
 */
export const validatePromoCode = async (promoData: PromoCodeRequest): Promise<PromoCodeResponse> => {
  const response = await apiClient.post<{ success: boolean; data: PromoCodeResponse }>('/promo/validate', promoData);
  return response.data.data;
};

export default apiClient;

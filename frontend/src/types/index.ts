// Experience types
export interface Experience {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  startingPrice: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  availableCount: number;
  totalCapacity: number;
}

export interface AvailableDate {
  date: string;
  slots: TimeSlot[];
}

export interface ExperienceDetails extends Experience {
  price: number;
  about: string;
  availableDates: AvailableDate[];
}

// Booking types
export interface BookingRequest {
  experienceId: string;
  slotId: string;
  date: string;
  time: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  promoCode?: string;
  agreedToTerms: boolean;
}

export interface BookingResponse {
  bookingId: string;
  referenceId: string;
  status: string;
}

// Promo code types
export interface PromoCodeRequest {
  code: string;
  subtotal: number;
}

export interface PromoCodeResponse {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountAmount: number;
}

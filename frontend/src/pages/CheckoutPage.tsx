import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import PriceSummary from '../components/PriceSummary';
import ErrorAlert from '../components/ErrorAlert';
import { useBooking } from '../hooks/useBooking';
import { usePromoCode } from '../hooks/usePromoCode';
import { validateCheckoutForm, isFormValid } from '../utils/validation';
import type { FormValidationErrors } from '../utils/validation';

interface CheckoutState {
  experienceId: string;
  experienceName: string;
  slotId: string;
  date: string;
  time: string;
  quantity: number;
  basePrice: number;
  subtotal: number;
  taxes: number;
  total: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState({ name: false, email: false });

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const { discount, validateCode, loading: promoLoading, error: promoError } = usePromoCode();

  // Terms and conditions
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Booking hook
  const { createBookingRequest, loading: bookingLoading, error: bookingError } = useBooking();

  // Redirect if no booking data
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  // Validate form on input change
  const handleNameChange = (value: string) => {
    setCustomerName(value);
    if (touched.name) {
      const validationErrors = validateCheckoutForm(value, customerEmail);
      setErrors(validationErrors);
    }
  };

  const handleEmailChange = (value: string) => {
    setCustomerEmail(value);
    if (touched.email) {
      const validationErrors = validateCheckoutForm(customerName, value);
      setErrors(validationErrors);
    }
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    const validationErrors = validateCheckoutForm(customerName, customerEmail);
    setErrors(validationErrors);
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    const validationErrors = validateCheckoutForm(customerName, customerEmail);
    setErrors(validationErrors);
  };

  // Handle promo code application
  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !state) return;
    await validateCode({ code: promoCode, subtotal: state.subtotal });
  };

  // Check if form is valid
  const isFormValidForSubmission = () => {
    const validationErrors = validateCheckoutForm(customerName, customerEmail);
    return isFormValid(validationErrors) && agreedToTerms;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!state) return;

    // Validate all fields
    setTouched({ name: true, email: true });
    const validationErrors = validateCheckoutForm(customerName, customerEmail);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors) || !agreedToTerms) {
      return;
    }

    // Create booking request
    const bookingData = {
      experienceId: state.experienceId,
      slotId: state.slotId,
      date: state.date,
      time: state.time,
      quantity: state.quantity,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      promoCode: discount?.code,
      agreedToTerms: true,
    };

    const result = await createBookingRequest(bookingData);

    if (result) {
      // Navigate to confirmation page with booking reference
      navigate('/confirmation', {
        state: {
          success: true,
          referenceId: result.referenceId,
          experienceName: state.experienceName,
        },
      });
    } else {
      // Navigate to confirmation page with failure state
      navigate('/confirmation', {
        state: {
          success: false,
          experienceName: state.experienceName,
          error: bookingError || 'Unable to complete your booking. Please try again.',
        },
      });
    }
  };

  if (!state) {
    return null;
  }

  // Price calculations with discount (after null check)
  const discountAmount = discount?.discountAmount || 0;
  const subtotalAfterDiscount = state.subtotal - discountAmount;
  const taxesAfterDiscount = subtotalAfterDiscount * 0.06;
  const totalAfterDiscount = subtotalAfterDiscount + taxesAfterDiscount;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary dark:text-white mb-6 sm:mb-8">Checkout</h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column - Form (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-secondary dark:text-white mb-6">
                Your Information
              </h2>
              
              {/* User Information Form */}
              <div className="space-y-4 mb-6">
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  error={touched.name ? errors.name : undefined}
                  required
                  className="mb-4"
                />

                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  error={touched.email ? errors.email : undefined}
                  required
                  className="mb-4"
                />
              </div>

              {/* Promo Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-secondary dark:text-white mb-4">
                  Promo Code
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={setPromoCode}
                      error={promoError || undefined}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || promoLoading}
                  >
                    {promoLoading ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {discount && (
                  <p className="mt-2 text-sm text-success dark:text-green-400">
                    ✓ Promo code applied! You saved ₹{discountAmount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all duration-200"
                  />
                  <span className="ml-3 text-sm text-secondary dark:text-gray-300 group-hover:text-secondary-light dark:group-hover:text-gray-400 transition-colors">
                    I agree to the terms and safety policy
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {bookingError && (
                <div className="mb-6">
                  <ErrorAlert message={bookingError} type="error" />
                </div>
              )}

              {/* Submit Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValidForSubmission() || bookingLoading}
                className="w-full"
              >
                {bookingLoading ? 'Processing...' : 'Pay and Confirm'}
              </Button>
            </div>
          </div>

          {/* Right column - Summary (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <PriceSummary
                experienceName={state.experienceName}
                date={state.date}
                time={state.time}
                quantity={state.quantity}
                basePrice={state.basePrice}
                discount={discountAmount}
                taxes={taxesAfterDiscount}
                total={totalAfterDiscount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


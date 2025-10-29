import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';

interface ConfirmationState {
  success: boolean;
  referenceId?: string;
  experienceName?: string;
  error?: string;
}

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  // Default to success if no state provided (shouldn't happen in normal flow)
  const isSuccess = state?.success !== false;
  const referenceId = state?.referenceId;
  const experienceName = state?.experienceName;
  const errorMessage = state?.error;

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-gray dark:bg-dark-bg flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 sm:p-8 text-center animate-slide-up">
          {isSuccess ? (
            <>
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-success dark:bg-green-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-secondary dark:text-white mb-4">
                Booking Confirmed!
              </h1>

              {experienceName && (
                <p className="text-secondary-light dark:text-gray-400 mb-4">
                  Your booking for <span className="font-semibold">{experienceName}</span> has been confirmed.
                </p>
              )}

              {/* Booking Reference */}
              {referenceId && (
                <div className="bg-background-gray dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <p className="text-sm text-secondary-light dark:text-gray-400 mb-1">
                    Booking Reference
                  </p>
                  <p className="text-2xl font-bold text-secondary dark:text-white tracking-wider">
                    {referenceId}
                  </p>
                </div>
              )}

              <p className="text-sm text-secondary-light dark:text-gray-400 mb-8">
                A confirmation email has been sent to your email address.
              </p>
            </>
          ) : (
            <>
              {/* Failure Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-error dark:bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              {/* Failure Message */}
              <h1 className="text-3xl font-bold text-secondary dark:text-white mb-4">
                Booking Failed
              </h1>

              <p className="text-secondary-light dark:text-gray-400 mb-6">
                {errorMessage || 'Unfortunately, we could not complete your booking. Please try again.'}
              </p>
            </>
          )}

          {/* Back to Home Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleBackToHome}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;


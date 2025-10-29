import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExperienceDetails } from '../hooks/useExperienceDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import DateButton from '../components/DateButton';
import TimeSlotButton from '../components/TimeSlotButton';
import PriceSummary from '../components/PriceSummary';
import Button from '../components/Button';
import type { TimeSlot } from '../types';

const ExperienceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { experience, loading, error } = useExperienceDetails(id || '');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Format date for display (e.g., "Oct 22")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get slots for selected date
  const selectedDateSlots = experience?.availableDates.find(
    (d) => d.date === selectedDate
  )?.slots || [];

  // Calculate pricing
  const basePrice = experience?.price || 0;
  const subtotal = basePrice * quantity;
  const taxes = subtotal * 0.06; // 6% tax
  const total = subtotal + taxes;

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot when date changes
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = selectedSlot?.availableCount || 10;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  // Handle confirm button
  const handleConfirm = () => {
    if (!experience || !selectedDate || !selectedSlot) return;

    navigate('/checkout', {
      state: {
        experienceId: experience.id,
        experienceName: experience.name,
        slotId: selectedSlot.id,
        date: selectedDate,
        time: selectedSlot.time,
        quantity,
        basePrice,
        subtotal,
        taxes,
        total,
      },
    });
  };

  const isConfirmEnabled = selectedDate && selectedSlot && quantity >= 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          message={error || 'Experience not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="bg-background-gray dark:bg-dark-bg animate-fade-in">
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Experience Info */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6">
              <h1 className="text-3xl font-bold text-secondary dark:text-white mb-2">
                {experience.name}
              </h1>
              <p className="text-lg text-secondary-light dark:text-gray-400 mb-4">
                {experience.location}
              </p>
              <p className="text-secondary dark:text-gray-300 mb-4">{experience.description}</p>
              {experience.about && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-secondary dark:text-white mb-2">
                    About this experience
                  </h3>
                  <p className="text-secondary-light dark:text-gray-400">{experience.about}</p>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-secondary dark:text-white mb-4">
                Select Date
              </h3>
              {experience.availableDates.length === 0 ? (
                <EmptyState
                  icon="calendar"
                  title="No Available Dates"
                  message="This experience currently has no available dates. Please check back later or contact us for more information."
                />
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-custom -mx-4 px-4 sm:mx-0 sm:px-0">
                  {experience.availableDates.map((dateObj) => (
                    <DateButton
                      key={dateObj.date}
                      date={dateObj.date}
                      displayText={formatDate(dateObj.date)}
                      selected={selectedDate === dateObj.date}
                      onClick={() => handleDateSelect(dateObj.date)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-xl font-semibold text-secondary dark:text-white mb-4">
                  Select Time
                </h3>
                {selectedDateSlots.length === 0 ? (
                  <EmptyState
                    icon="calendar"
                    title="No Time Slots Available"
                    message="There are no available time slots for this date. Please select a different date."
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {selectedDateSlots.map((slot) => (
                      <TimeSlotButton
                        key={slot.id}
                        time={slot.time}
                        availableCount={slot.availableCount}
                        selected={selectedSlot?.id === slot.id}
                        soldOut={slot.availableCount === 0}
                        onClick={() => handleSlotSelect(slot)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            {selectedDate && selectedSlot && (
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-xl font-semibold text-secondary dark:text-white mb-4">
                  Select Quantity
                </h3>
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-95"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold text-secondary dark:text-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedSlot.availableCount}
                    className="w-10 h-10 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-95"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-secondary-light dark:text-gray-400">
                  Maximum {selectedSlot.availableCount} {selectedSlot.availableCount === 1 ? 'slot' : 'slots'} available
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Price Summary (Sticky on desktop, hidden on mobile) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <PriceSummary
                experienceName={experience.name}
                date={selectedDate ? formatDate(selectedDate) : ''}
                time={selectedSlot?.time || ''}
                quantity={quantity}
                basePrice={basePrice}
                discount={0}
                taxes={taxes}
                total={total}
              />
              <Button
                variant="primary"
                size="lg"
                disabled={!isConfirmEnabled}
                onClick={handleConfirm}
                className="w-full mt-4"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet for Price Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card shadow-2xl p-4 border-t-2 border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-secondary-light">Total Amount</p>
            <p className="text-xl sm:text-2xl font-bold text-secondary">₹{total.toFixed(2)}</p>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!isConfirmEnabled}
            onClick={handleConfirm}
            className="flex-shrink-0"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailsPage;


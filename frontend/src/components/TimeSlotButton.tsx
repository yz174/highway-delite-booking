import React from 'react';

interface TimeSlotButtonProps {
  time: string;
  availableCount: number;
  selected: boolean;
  soldOut: boolean;
  onClick: () => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  time,
  availableCount,
  selected,
  soldOut,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={soldOut}
      className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none active:scale-95 ${
        selected
          ? 'bg-primary text-black shadow-md'
          : soldOut
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600'
          : 'bg-white dark:bg-gray-700 text-secondary dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-800'
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base">{time}</span>
        <span className={`text-xs mt-1 ${soldOut ? 'text-gray-400 dark:text-gray-500' : availableCount <= 3 ? 'text-error dark:text-red-400' : 'text-secondary-light dark:text-gray-400'}`}>
          {soldOut ? 'Sold out' : `${availableCount} left`}
        </span>
      </div>
    </button>
  );
};

export default TimeSlotButton;

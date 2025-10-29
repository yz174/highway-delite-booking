import React from 'react';

interface DateButtonProps {
  date: string;
  displayText: string;
  selected: boolean;
  onClick: () => void;
}

const DateButton: React.FC<DateButtonProps> = ({
  displayText,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 focus:outline-none active:scale-95 text-sm sm:text-base ${
        selected
          ? 'bg-primary text-black shadow-md'
          : 'bg-white dark:bg-gray-700 text-secondary dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-800'
      }`}
    >
      {displayText}
    </button>
  );
};

export default DateButton;

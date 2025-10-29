import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: 'search' | 'calendar' | 'box' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'info',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        );
      case 'calendar':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        );
      case 'box':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        );
      default:
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
    }
  };

  return (
    <div className="text-center py-12 px-4 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-dark-card rounded-full mb-6">
        <svg
          className="w-10 h-10 text-secondary-light dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {getIcon()}
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">{title}</h3>
      <p className="text-secondary-light dark:text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;


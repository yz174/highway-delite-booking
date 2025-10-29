import React from 'react';

interface PriceSummaryProps {
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  basePrice: number;
  discount: number;
  taxes: number;
  total: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  experienceName,
  date,
  time,
  quantity,
  basePrice,
  discount,
  taxes,
  total,
}) => {
  const subtotal = basePrice * quantity;

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6 transition-shadow hover:shadow-lg dark:hover:shadow-gray-900/50">
      <h3 className="text-lg sm:text-xl font-semibold text-secondary dark:text-white mb-4">Booking Summary</h3>
      
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="font-medium text-secondary dark:text-white text-sm sm:text-base">{experienceName}</p>
        {date && <p className="text-xs sm:text-sm text-secondary-light dark:text-gray-400 mt-1">{date}</p>}
        {time && <p className="text-xs sm:text-sm text-secondary-light dark:text-gray-400">{time}</p>}
        {quantity > 0 && <p className="text-xs sm:text-sm text-secondary-light dark:text-gray-400">Quantity: {quantity}</p>}
      </div>

      <div className="space-y-2 mb-4 text-sm sm:text-base">
        <div className="flex justify-between text-secondary dark:text-gray-300 transition-colors">
          <span>Base Price</span>
          <span>₹{basePrice}</span>
        </div>
        {quantity > 0 && (
          <div className="flex justify-between text-secondary dark:text-gray-300 transition-colors">
            <span>Quantity</span>
            <span>× {quantity}</span>
          </div>
        )}
        <div className="flex justify-between text-secondary dark:text-gray-300 transition-colors">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success dark:text-green-400 font-medium">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-secondary dark:text-gray-300 transition-colors">
          <span>Taxes (6%)</span>
          <span>₹{taxes.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-base sm:text-lg font-bold text-secondary dark:text-white transition-colors">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;


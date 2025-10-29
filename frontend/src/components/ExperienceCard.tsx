import React from 'react';
import Button from './Button';

interface ExperienceCardProps {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  price: number;
  onViewDetails: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id,
  name,
  location,
  description,
  imageUrl,
  price,
  onViewDetails,
}) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group h-full">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-secondary-light dark:text-gray-400 mb-2">{location}</p>
        <p className="text-sm text-secondary-light dark:text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-secondary-light dark:text-gray-400">Starting from</span>
            <p className="text-lg font-bold text-secondary dark:text-white">₹{price}</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;


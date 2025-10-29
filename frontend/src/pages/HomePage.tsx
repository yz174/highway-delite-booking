import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiences } from '../hooks/useExperiences';
import ExperienceCard from '../components/ExperienceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { experiences, loading, error, fetchExperiences } = useExperiences();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter experiences based on search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery.trim()) {
      return experiences;
    }
    
    const query = searchQuery.toLowerCase();
    return experiences.filter(experience => 
      experience.name.toLowerCase().includes(query) ||
      experience.location.toLowerCase().includes(query) ||
      experience.description.toLowerCase().includes(query)
    );
  }, [experiences, searchQuery]);

  const handleSearch = () => {
    fetchExperiences(searchQuery);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/experience/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex w-full max-w-2xl mx-auto gap-2">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-dark-card text-secondary dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchExperiences()}
          />
        ) : filteredExperiences.length === 0 ? (
          <EmptyState
            icon={searchQuery ? 'search' : 'box'}
            title={searchQuery ? 'No Results Found' : 'No Experiences Available'}
            message={
              searchQuery
                ? `We couldn't find any experiences matching "${searchQuery}". Try adjusting your search terms.`
                : 'There are no experiences available at the moment. Please check back later.'
            }
            actionLabel={searchQuery ? 'Clear Search' : undefined}
            onAction={searchQuery ? handleClearSearch : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredExperiences.map((experience, index) => (
              <div
                key={experience.id}
                className={`animate-fade-in-up ${
                  index === 0 ? 'animate-delay-100' :
                  index === 1 ? 'animate-delay-200' :
                  index === 2 ? 'animate-delay-300' :
                  index === 3 ? 'animate-delay-400' :
                  index === 4 ? 'animate-delay-500' :
                  index === 5 ? 'animate-delay-600' :
                  index === 6 ? 'animate-delay-700' :
                  index === 7 ? 'animate-delay-800' :
                  ''
                }`}
              >
                <ExperienceCard
                  id={experience.id}
                  name={experience.name}
                  location={experience.location}
                  description={experience.description}
                  imageUrl={experience.imageUrl}
                  price={experience.startingPrice}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

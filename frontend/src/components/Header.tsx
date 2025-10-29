import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import logo from '../assets/image.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white dark:bg-dark-bg shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-dark-border transition-colors animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
            src={logo}
            alt="Highway Delite"
            className="h-8 sm:h-10 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => navigate('/')}
          />

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* Optional: Add navigation items here if needed */}
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                className="text-secondary-light dark:text-gray-300 hover:text-secondary dark:hover:text-white transition-all duration-200 text-sm sm:text-base font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

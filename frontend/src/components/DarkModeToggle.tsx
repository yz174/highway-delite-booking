import { useDarkMode } from '../hooks/useDarkMode';
import moonIcon from '../assets/moon.png';
import brightnessIcon from '../assets/brightness.png';

export const DarkModeToggle = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <img src={brightnessIcon} alt="Light mode" className="w-5 h-5 invert brightness-0" />
      ) : (
        <img src={moonIcon} alt="Dark mode" className="w-5 h-5" />
      )}
    </button>
  );
};

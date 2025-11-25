import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'user_preferences';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        setDarkMode(preferences.darkMode || false);
      }
    } catch (error) {
      console.error('Failed to load dark mode preference:', error);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    console.log('Dark mode changed:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for storage changes (when settings are updated)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const preferences = JSON.parse(stored);
          setDarkMode(preferences.darkMode || false);
        }
      } catch (error) {
        console.error('Failed to sync dark mode:', error);
      }
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-window updates
    window.addEventListener('preferencesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferencesUpdated', handleStorageChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    
    // Update localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const preferences = stored ? JSON.parse(stored) : {};
      preferences.darkMode = newValue;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      
      // Dispatch custom event for same-window updates
      window.dispatchEvent(new Event('preferencesUpdated'));
    } catch (error) {
      console.error('Failed to save dark mode:', error);
    }
  };

  const value: ThemeContextType = {
    darkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
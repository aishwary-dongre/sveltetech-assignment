import { useState, useEffect } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types/settings.types';

const STORAGE_KEY = 'user_preferences';

export const useSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = (newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('preferencesUpdated'));
      
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  };

  // Update a specific preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    return savePreferences(newPreferences);
  };

  // Reset to defaults
  const resetPreferences = () => {
    return savePreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    loading,
    savePreferences,
    updatePreference,
    resetPreferences,
  };
};
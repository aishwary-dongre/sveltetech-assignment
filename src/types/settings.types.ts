export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  timezone: string;
  emailDigest: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  darkMode: false,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  language: 'en',
  timezone: 'UTC',
  emailDigest: 'daily',
};
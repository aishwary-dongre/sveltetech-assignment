import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

interface AppState {
  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;

  // API retry count
  retryCount: number;
  incrementRetry: () => void;
  resetRetry: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Notifications
        notifications: [],
        addNotification: (message, type) => {
          const id = `${Date.now()}-${Math.random()}`;
          const notification: Notification = {
            id,
            message,
            type,
            timestamp: Date.now(),
          };
          set((state) => ({
            notifications: [...state.notifications, notification],
          }));
          
          // Auto-remove after 5 seconds
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          }, 5000);
        },
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),

        // Loading
        isLoading: false,
        setIsLoading: (loading) => set({ isLoading: loading }),

        // Error
        error: null,
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Retry
        retryCount: 0,
        incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
        resetRetry: () => set({ retryCount: 0 }),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          // Only persist notifications
          notifications: state.notifications,
        }),
      }
    )
  )
);
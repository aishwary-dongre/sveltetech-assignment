import { useAppStore } from '../store/appStore';

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

class APIError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Enhanced fetch with retry logic and error handling
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new APIError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText
        );
      }

      const data = await response.json();
      
      // Reset retry count on success
      useAppStore.getState().resetRetry();
      
      return data as T;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        break;
      }

      // If we have retries left, wait and try again
      if (attempt < retries) {
        useAppStore.getState().incrementRetry();
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  // If we got here, all retries failed
  const errorMessage = lastError?.message || 'Network request failed';
  useAppStore.getState().setError(errorMessage);
  throw lastError;
}

/**
 * GET request with retry
 */
export async function apiGet<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request with retry
 */
export async function apiPost<T>(
  url: string,
  data: any,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT request with retry
 */
export async function apiPut<T>(
  url: string,
  data: any,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE request with retry
 */
export async function apiDelete<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'DELETE',
    ...options,
  });
}

/**
 * Hook to handle API errors gracefully
 */
export function useApiError() {
  const { error, setError, clearError, addNotification } = useAppStore();

  const handleError = (error: Error) => {
    setError(error.message);
    addNotification(error.message, 'error');
  };

  const retry = async <T,>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      clearError();
      const result = await apiCall();
      addNotification('Request successful!', 'success');
      return result;
    } catch (err) {
      handleError(err as Error);
      return null;
    }
  };

  return {
    error,
    handleError,
    clearError,
    retry,
  };
}
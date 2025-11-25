import { useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { apiGet } from '../utils/api';
import { useAppStore } from '../store/appStore';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification, retryCount } = useAppStore();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<User[]>(
        'https://jsonplaceholder.typicode.com/users',
        { retries: 3, retryDelay: 1000 }
      );
      setUsers(data);
      
      if (retryCount > 0) {
        addNotification(`Successfully loaded users after ${retryCount} retries`, 'success');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};
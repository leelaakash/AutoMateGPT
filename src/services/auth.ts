import { User, AuthState } from '../types';

const AUTH_STORAGE_KEY = 'automate_gpt_auth';

export const signIn = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // Simple validation
      if (!name.trim() || !email.trim() || !password.trim()) {
        reject(new Error('All fields are required'));
        return;
      }

      if (!email.includes('@')) {
        reject(new Error('Please enter a valid email address'));
        return;
      }

      if (password.length < 6) {
        reject(new Error('Password must be at least 6 characters'));
        return;
      }

      const user: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        signedInAt: Date.now()
      };

      // Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      resolve(user);
    }, 1000);
  });
};

export const signOut = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const getAuthState = (): AuthState => {
  const user = getCurrentUser();
  return {
    isAuthenticated: !!user,
    user
  };
};
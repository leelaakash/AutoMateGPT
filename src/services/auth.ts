import { User, AuthState } from '../types';

const AUTH_STORAGE_KEY = 'automate_gpt_auth';
const USERS_STORAGE_KEY = 'automate_gpt_users';

// Get all users from storage
const getStoredUsers = (): Array<User & { password: string }> => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save users to storage
const saveUsers = (users: Array<User & { password: string }>): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

// Hash password (simple implementation for demo)
const hashPassword = (password: string): string => {
  // In production, use proper password hashing like bcrypt
  return btoa(password + 'salt_key_automate_gpt');
};

// Verify password
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const signUp = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Validation
        if (!name.trim() || !email.trim() || !password.trim()) {
          reject(new Error('All fields are required'));
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          reject(new Error('Please enter a valid email address'));
          return;
        }

        if (password.length < 8) {
          reject(new Error('Password must be at least 8 characters long'));
          return;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
          reject(new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number'));
          return;
        }

        const users = getStoredUsers();
        
        // Check if user already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error('An account with this email already exists'));
          return;
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: Date.now().toString(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          signedInAt: Date.now(),
          password: hashPassword(password)
        };

        users.push(newUser);
        saveUsers(users);

        // Store current session
        const userForSession: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          signedInAt: newUser.signedInAt
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userForSession));
        resolve(userForSession);
      } catch (error) {
        reject(new Error('Sign up failed. Please try again.'));
      }
    }, 1000);
  });
};

export const signIn = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!email.trim() || !password.trim()) {
          reject(new Error('Email and password are required'));
          return;
        }

        const users = getStoredUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          reject(new Error('No account found with this email address'));
          return;
        }

        if (!verifyPassword(password, user.password)) {
          reject(new Error('Incorrect password'));
          return;
        }

        // Update sign in time
        user.signedInAt = Date.now();
        saveUsers(users);

        // Store current session
        const userForSession: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          signedInAt: user.signedInAt
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userForSession));
        resolve(userForSession);
      } catch (error) {
        reject(new Error('Sign in failed. Please try again.'));
      }
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

// Password reset functionality
export const resetPassword = (email: string, newPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getStoredUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

        if (userIndex === -1) {
          reject(new Error('No account found with this email address'));
          return;
        }

        if (newPassword.length < 8) {
          reject(new Error('Password must be at least 8 characters long'));
          return;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
          reject(new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number'));
          return;
        }

        users[userIndex].password = hashPassword(newPassword);
        saveUsers(users);
        resolve(true);
      } catch (error) {
        reject(new Error('Password reset failed. Please try again.'));
      }
    }, 1000);
  });
};
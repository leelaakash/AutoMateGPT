import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { getAuthState } from './services/auth';
import { AuthState, User } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>(getAuthState());
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // Check authentication state on app load
    setAuthState(getAuthState());
  }, []);

  const handleSignIn = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user
    });
  };

  const handleSignOut = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  };

  if (!authState.isAuthenticated) {
    return (
      <>
        <HomePage onSignInClick={() => setShowSignIn(true)} />
        <AuthModal
          isOpen={showSignIn}
          onClose={() => setShowSignIn(false)}
          onSignIn={handleSignIn}
        />
      </>
    );
  }

  return (
    <Dashboard
      user={authState.user!}
      onSignOut={handleSignOut}
    />
  );
}

export default App;
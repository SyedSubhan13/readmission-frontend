import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Check if authentication is enabled from environment variable
const USE_AUTH = import.meta.env.VITE_USE_AUTH === 'true';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // If authentication is disabled, directly render children
  if (!USE_AUTH) {
    return <>{children}</>;
  }

  // Otherwise, use Clerk's auth check
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" state={{ from: location }} replace />
      </SignedOut>
    </>
  );
}

// Custom hook to access user data and auth functions
export function useAuth() {
  const navigate = useLocation();
  
  // If authentication is disabled, provide a mock user
  if (!USE_AUTH) {
    return {
      user: {
        id: 'dev-user',
        firstName: 'Development',
        lastName: 'User',
        fullName: 'Development User',
        email: 'dev@example.com',
        imageUrl: '/placeholder-user.jpg',
      },
      loading: false,
      signOut: () => {
        console.log('Sign out clicked (development mode)');
        // Even in dev mode, navigate to home page
        window.location.href = '/';
      }
    };
  }

  // Otherwise, use Clerk's auth
  const { user, isLoaded: loaded } = useUser();
  const clerk = useClerk();

  return {
    user,
    loading: !loaded,
    signOut: async () => {
      try {
        await clerk.signOut();
        // Force redirect to home page after signout
        window.location.href = '/';
      } catch (error) {
        console.error('Error signing out:', error);
        // Fallback redirect
        window.location.href = '/';
      }
    }
  };
} 
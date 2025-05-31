"use client"; // Mark this component as a client component

import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

/**
 * AuthSessionProvider component to wrap the application with NextAuth.js SessionProvider.
 * This ensures that the session context is available to all client components.
 * It is marked as a client component to prevent "React Context is unavailable in Server Components" errors.
 */
export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

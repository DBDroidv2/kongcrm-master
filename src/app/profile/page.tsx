'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading session...</p>
      </div>
    );
  }

  // If session is not available (though `required: true` should handle it),
  // or if user is somehow undefined after loading.
  if (!session?.user) {
     // This case should ideally be handled by onUnauthenticated,
     // but as a fallback, we can show a message or redirect again.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <p className="text-lg text-red-600 mb-4">User data not available. Redirecting to login...</p>
            {/* Optional: add a manual redirect button if needed, though redirect in onUnauthenticated is preferred */}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-3 rounded-md">
              {session.user.name || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-3 rounded-md">
              {session.user.email || 'Not provided'}
            </p>
          </div>
          {/* You can add more user details here if available in the session token */}
        </div>
        <p className="mt-6 text-xs text-gray-500 text-center">
          Session ID: {(session as any).id || 'N/A'}
        </p>
      </div>
    </div>
  );
}

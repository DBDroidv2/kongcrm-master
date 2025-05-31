"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Get session status

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  // if (status === 'loading') { // Optional: show a loading state or null
  //   return null;
  // }

  return (
    // Sidebar container with 90's styling
    <div className="hidden md:flex md:flex-shrink-0 border-r-4 border-cyan-500 shadow-xl">
      <div className="flex flex-col w-64 bg-blue-950"> {/* Darker blue background */}
        <div className="flex flex-col h-0 flex-1">
          {/* Sidebar header with KongCRM title */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-800 border-b-2 border-cyan-500">
            <Link href="/" className="text-2xl text-cyan-300 font-extrabold tracking-wider drop-shadow-md">KongCRM</Link>
          </div>
          {/* Navigation section */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-blue-950 py-4">
            {status === 'authenticated' ? (
              <nav className="flex-1 px-2 space-y-1">
                {/* Dashboard Link */}
                <Link
                  href="/"
                  className={`${isActive('/') === 'bg-gray-900 text-white' ? 'bg-cyan-700 text-white border-2 border-cyan-300 shadow-inner' : 'text-cyan-300 hover:bg-blue-700 hover:text-white border-2 border-blue-900 hover:border-cyan-500'} group flex items-center px-2 py-2 text-sm font-bold rounded-md transition-all duration-200`}
                >
                  <svg className="mr-3 flex-shrink-0 h-6 w-6 text-cyan-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>

                {/* Customers Link */}
                <Link
                  href="/customers"
                  className={`${isActive('/customers') === 'bg-gray-900 text-white' ? 'bg-cyan-700 text-white border-2 border-cyan-300 shadow-inner' : 'text-cyan-300 hover:bg-blue-700 hover:text-white border-2 border-blue-900 hover:border-cyan-500'} group flex items-center px-2 py-2 text-sm font-bold rounded-md transition-all duration-200`}
                >
                  <svg className="mr-3 flex-shrink-0 h-6 w-6 text-cyan-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Customers
                </Link>

                {/* Activities Link */}
                <Link
                  href="/activities"
                  className={`${isActive('/activities') === 'bg-gray-900 text-white' ? 'bg-cyan-700 text-white border-2 border-cyan-300 shadow-inner' : 'text-cyan-300 hover:bg-blue-700 hover:text-white border-2 border-blue-900 hover:border-cyan-500'} group flex items-center px-2 py-2 text-sm font-bold rounded-md transition-all duration-200`}
                >
                  <svg className="mr-3 flex-shrink-0 h-6 w-6 text-cyan-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Activities
                </Link>
                {/* Profile Link */}
                <Link
                  href="/profile"
                  className={`${isActive('/profile') === 'bg-gray-900 text-white' ? 'bg-cyan-700 text-white border-2 border-cyan-300 shadow-inner' : 'text-cyan-300 hover:bg-blue-700 hover:text-white border-2 border-blue-900 hover:border-cyan-500'} group flex items-center px-2 py-2 text-sm font-bold rounded-md transition-all duration-200`}
                >
                  <svg className="mr-3 flex-shrink-0 h-6 w-6 text-cyan-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
              </nav>
            ) : (
              <div className="px-2 py-4 text-center bg-blue-900 border-t-2 border-cyan-500">
                <p className="text-cyan-400 text-sm font-medium">
                  Please <Link href="/login" className="text-pink-400 hover:text-pink-300 font-bold">Login</Link> or <Link href="/register" className="text-pink-400 hover:text-pink-300 font-bold">Register</Link> to access features.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

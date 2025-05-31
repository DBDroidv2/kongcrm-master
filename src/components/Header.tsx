"use client";

import { signOut, useSession } from "next-auth/react";
import Image from 'next/image'; // Import the Image component for optimized images

export default function Header() {
  const { data: session, status } = useSession();

  return (
    // Header with a 90's theme: dark blue background, neon cyan text, chunky borders
    <header className="bg-blue-900 border-b-4 border-cyan-500 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* KongCRM logo/title with neon text */}
              <span className="text-cyan-300 text-2xl font-extrabold tracking-wider drop-shadow-md">KongCRM</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {status === "authenticated" ? (
                <>
                  {/* Welcome message with neon text */}
                  <span className="text-cyan-300 mr-4 text-sm font-medium">
                    Welcome, {session?.user?.name || "User"}
                  </span>
                  {/* Navigation links with 90's button style */}
                  <a
                    href="/customers"
                    className="text-cyan-300 hover:bg-cyan-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium border-2 border-cyan-500 hover:border-white transition-all duration-200"
                  >
                    Customers
                  </a>
                  <a
                    href="/activities"
                    className="text-cyan-300 hover:bg-cyan-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-2 border-2 border-cyan-500 hover:border-white transition-all duration-200"
                  >
                    Activities
                  </a>
                  {/* Logout button with a vibrant 90's pink */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="ml-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md border-2 border-pink-400 hover:border-white transition-all duration-200 shadow-md"
                  >
                    Logout
                  </button>
                  <div className="relative ml-3">
                    <a href="/profile">
                      <button
                        type="button"
                        className="max-w-xs bg-blue-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-cyan-300 border-2 border-cyan-500 shadow-md"
                        title="Go to profile"
                      >
                        <span className="sr-only">Open user menu</span>
                        <Image // Use Next.js Image component for optimized image loading
                          className="h-8 w-8 rounded-full border-2 border-cyan-400"
                          src={`https://ui-avatars.com/api/?name=${session?.user?.name || 'A'}&background=0D8ABC&color=fff`}
                          alt="User"
                          width={32} // Specify width for the Image component
                          height={32} // Specify height for the Image component
                        />
                      </button>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Login/Register links with 90's button style */}
                  <a
                    href="/login"
                    className="text-cyan-300 hover:bg-cyan-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium border-2 border-cyan-500 hover:border-white transition-all duration-200"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="text-cyan-300 hover:bg-cyan-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-2 border-2 border-cyan-500 hover:border-white transition-all duration-200"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

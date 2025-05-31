"use client";

import { signOut, useSession } from "next-auth/react";
import Image from 'next/image'; // Import the Image component for optimized images

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">KongCRM</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {status === "authenticated" ? (
                <>
                  <span className="text-gray-300 mr-4">
                    Welcome, {session?.user?.name || "User"}
                  </span>
                  <a
                    href="/customers"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Customers
                  </a>
                  <a
                    href="/activities"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-2"
                  >
                    Activities
                  </a>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                  <div className="relative ml-3">
                    <a href="/profile">
                      <button
                        type="button"
                        className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        title="Go to profile"
                      >
                        <span className="sr-only">Open user menu</span>
                        <Image // Use Next.js Image component for optimized image loading
                          className="h-8 w-8 rounded-full"
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
                  <a
                    href="/login"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-2"
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

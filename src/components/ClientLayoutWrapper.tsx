"use client";

import { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingAnimation isLoading={isLoading} />
      {!isLoading && children}
    </>
  );
}

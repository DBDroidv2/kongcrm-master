'use client';

import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Map common errors to more user-friendly messages
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
        } else if (result.error === "Callback") {
           setError("Login failed due to a callback error. Please try again.");
        }
        else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push('/'); // Redirect to home page or dashboard
      } else {
        // Fallback for unexpected signIn results without a specific error
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (err: any) { // Catching network or other unexpected errors
      console.error('Login submission error:', err);
      setError('An unexpected error occurred during login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Don&apos;t have an account? <a href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Register here</a>
      </p>
    </div>
  );
}

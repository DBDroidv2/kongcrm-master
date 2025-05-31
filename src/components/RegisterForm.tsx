'use client';

import React, { useState, FormEvent } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'Registration successful! You can now login.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        if (data.errors) {
          // Handle Zod validation errors
          const errorMessages = Object.values(data.errors).flat().join(' ');
          setError(errorMessages || data.message || 'Registration failed.');
        } else {
          setError(data.message || 'An unknown error occurred.');
        }
      }
    } catch (err: any) {
      console.error('Registration fetch error:', err);
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
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
        {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
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
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <a href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Login here</a>
      </p>
    </div>
  );
}

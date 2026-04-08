'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check password immediately
    if (password === ADMIN_PASSWORD) {
      // Store session token in localStorage
      const token = btoa(`admin-${Date.now()}`);
      localStorage.setItem('admin_token', token);
      // Use window.location for instant redirect
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid password');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border/40 rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-primary/20 p-4 rounded-full">
              <Lock className="text-primary" size={32} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-display font-bold text-center mb-2 text-primary">VEKTOR</h1>
          <p className="text-center text-muted-foreground mb-8">Admin Panel</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-600/10 border border-red-600/30 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Secure admin area. Password required to access.
          </p>
        </div>
      </div>
    </div>
  );
}

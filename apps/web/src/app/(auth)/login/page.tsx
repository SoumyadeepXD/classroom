'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { GraduationCap, LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch<{
        accessToken: string;
        user: { id: string; email: string; displayName: string; systemRole: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(res);
      router.push('/');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to sign in. Please verify your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1f22] p-4">
      <div className="w-full max-w-md bg-[#2b2d31] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/30 mb-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your Classroom Platform account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-[#1e1f22] border border-gray-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1e1f22] border border-gray-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Need an account?{' '}
          <Link href="/register" className="text-brand-500 hover:underline font-medium">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

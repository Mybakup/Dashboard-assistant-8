import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, UserCircle, Settings } from 'lucide-react';
import type { UserRole } from '../types';

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [role, setRole] = useState<UserRole>('assistant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary mock login with role selection
    setUser({
      id: '1',
      email: 'user@example.com',
      role: role,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date().toISOString(),
      department: 'Medical Assistance',
      phoneNumber: '+33123456789',
      isActive: true
    });
    
    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Mybakup assistance
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Medical Assistance Platform
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setRole('assistant')}
              className={`flex items-center px-4 py-2 rounded-md ${
                role === 'assistant'
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200'
              } border`}
            >
              <UserCircle className="w-5 h-5 mr-2" />
              Assistant
            </button>
            <button
              type="button"
              onClick={() => setRole('manager')}
              className={`flex items-center px-4 py-2 rounded-md ${
                role === 'manager'
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200'
              } border`}
            >
              <Shield className="w-5 h-5 mr-2" />
              Manager
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center px-4 py-2 rounded-md ${
                role === 'admin'
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200'
              } border`}
            >
              <Settings className="w-5 h-5 mr-2" />
              Admin
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
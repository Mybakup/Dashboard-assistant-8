import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserCircle, PlusCircle, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export function Navigation() {
  const { user, setUser } = useAuthStore();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <PlusCircle className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Mybakup assistance</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              {user.role === 'manager' && (
                <>
                  <Link
                    to="/team"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <Users className="h-5 w-5" />
                    <span>Team</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </>
              )}

              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.firstName} {user.lastName}</span>
                  <span className="text-sm text-gray-500">({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar(){
  const nav = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  };

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* hide brand link on auth pages to avoid duplicate header on login/register */}
          {!(location.pathname === '/login' || location.pathname === '/register') && (
            <Link to="/" className="text-xl font-bold text-brand dark:text-indigo-300">StudentDash</Link>
          )}
          <nav className="hidden md:flex gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Link to="/classes" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Classes</Link>
            <Link to="/classes/new" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Create Class</Link>
            <Link to="/students" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Students</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(d => !d)} title="Toggle theme" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
            {dark ? '🌙' : '☀️'}
          </button>
          {user && <div className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">Hi, {user.name}</div>}
          <button onClick={handleLogout} className="px-3 py-1 bg-red-100 text-red-700 rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}

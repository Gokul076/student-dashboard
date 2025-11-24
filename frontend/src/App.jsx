import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPageNew';
import CreateStudent from './pages/CreateStudent';
import StudentProfile from './pages/StudentProfile';
import CreateClass from './pages/CreateClass';
import ClassesList from './pages/ClassesList';
import ClassDetail from './pages/ClassDetail';
import Navbar from './components/Navbar';

import { verifyToken } from './api/api';

function PrivateRoute({ children }) {
  // children will only render when tokenVerified is true
  return children;
}

export default function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await verifyToken();
      if (!mounted) return;
      if (!u) {
        // no valid token: ensure user sees login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setChecking(false);
        // If currently at '/', redirect to login
        if (window.location.pathname === '/' || window.location.pathname === '/dashboard') {
          nav('/login', { replace: true });
        }
      } else {
        setUser(u);
        // persist user copy (optional)
        localStorage.setItem('user', JSON.stringify(u));
        setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [nav]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-2">Verifying session…</div>
          <div className="loader border-4 border-t-4 rounded-full w-8 h-8 animate-spin border-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* decorative blobs for advanced background */}
      <div className="bg-blob blob-left" aria-hidden />
      <div className="bg-blob blob-right" aria-hidden />
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
      <Route path="/students/new" element={<PrivateRoute><CreateStudent /></PrivateRoute>} />
      <Route path="/students/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />

      <Route path="/classes" element={<PrivateRoute><ClassesList /></PrivateRoute>} />
      <Route path="/classes/new" element={<PrivateRoute><CreateClass /></PrivateRoute>} />
      <Route path="/classes/:id" element={<PrivateRoute><ClassDetail /></PrivateRoute>} />

      {/* fallback */}
          <Route path="*" element={<Navigate to={localStorage.getItem('token') ? '/' : '/login'} />} />
        </Routes>
      </main>
    </div>
  );
}

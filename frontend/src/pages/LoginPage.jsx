import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const emailValid = validateEmail(email);
  const passwordValid = password.length >= 6;

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!emailValid) throw new Error('Please enter a valid email');
      if (!passwordValid) throw new Error('Password must be at least 6 characters');
      const res = await api.post('/auth/login',{ email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      nav('/');
    } catch(err){
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 advanced-ui">
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col justify-center px-8">
            <div className="text-white w-full rounded-2xl p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl">
              <h1 className="text-4xl font-extrabold mb-3">StudentDash</h1>
              <p className="text-indigo-100/90">Visualize student progress, compare classes and discover learning insights with modern analytics.</p>
              <div className="mt-6">
                <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" /> Live analytics
                </div>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            onSubmit={submit}
            className="relative w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1 text-gray-800">Welcome back</h2>
              <p className="text-sm text-gray-600">Sign in to continue to Student Dashboard</p>
            </div>

          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@school.edu" className={`mt-1 mb-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${email && !emailValid ? 'border-red-300' : ''}`} />
          {email && !emailValid && <div className="text-sm text-red-600 mb-2">Please enter a valid email address.</div>}

        <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative password-field">
              <input value={password} onChange={e=>setPassword(e.target.value)} type={show ? 'text' : 'password'} required placeholder="••••••••" className={`mt-1 mb-2 w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${password && !passwordValid ? 'border-red-300' : ''}`} />
              <button
                type="button"
                onClick={() => setShow(s=>!s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                title={show ? 'Hide password' : 'Show password'}
                className="show-btn"
              >
                {show ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10 0-1.073.167-2.104.475-3.07M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {password && !passwordValid && <div className="text-sm text-red-600 mb-2">Password must be at least 6 characters.</div>}

            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading || !emailValid || !passwordValid} className={`btn-primary w-full py-2 rounded-lg text-white font-medium ${loading || !emailValid || !passwordValid ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-sm text-gray-400">or continue with</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" className="py-2 rounded-lg border bg-white text-gray-700 btn-social">Google</button>
              <button type="button" className="py-2 rounded-lg border bg-white text-gray-700 btn-social">GitHub</button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-indigo-700 font-semibold">Register</Link>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RegisterPage(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const emailValid = validateEmail(email);
  const nameValid = name.trim().length >= 2;

  const passwordScore = (value) => {
    let score = 0;
    if (!value) return 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(score, 4);
  };
  const pScore = passwordScore(password);
  const passwordValid = pScore >= 2;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!nameValid) throw new Error('Please enter your full name');
      if (!emailValid) throw new Error('Please enter a valid email');
      if (!passwordValid) throw new Error('Password is too weak');
      if (!passwordsMatch) throw new Error('Passwords do not match');
      await api.post('/auth/register',{ name, email, password, role: 'admin' });
      alert('Registered! Please login.');
      nav('/login');
    } catch(err){
      setError(err?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2 px-8">
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              onSubmit={submit}
              className="relative w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1 text-gray-800">Create an account</h2>
                <p className="text-sm text-gray-600">Start managing students and classes</p>
              </div>

              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Asha Kumari" className={`mt-1 mb-4 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${!nameValid && name ? 'border-red-300' : ''}`} />

              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className={`mt-1 mb-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${email && !emailValid ? 'border-red-300' : ''}`} />
              {email && !emailValid && <div className="text-sm text-red-600 mb-2">Enter a valid email address.</div>}

              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative password-field">
                <input value={password} onChange={e=>setPassword(e.target.value)} type={show ? 'text' : 'password'} required placeholder="Choose a strong password" className={`mt-1 mb-2 w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${password && !passwordValid ? 'border-red-300' : ''}`} />
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

              <div className="mb-3">
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div style={{ width: `${(pScore/4)*100}%` }} className={`h-2 ${pScore >= 3 ? 'bg-emerald-500' : pScore === 2 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                </div>
                <div className="text-xs text-gray-500 mt-1">Password strength: {pScore >= 3 ? 'Strong' : pScore === 2 ? 'Moderate' : 'Weak'}</div>
              </div>

              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type={show ? 'text' : 'password'} required placeholder="Repeat password" className={`mt-1 mb-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${confirmPassword && !passwordsMatch ? 'border-red-300' : ''}`} />
              {confirmPassword && !passwordsMatch && <div className="text-sm text-red-600 mb-2">Passwords do not match.</div>}
              {confirmPassword && passwordsMatch && <div className="text-sm text-emerald-600 mb-2">Passwords match</div>}

              {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
              <button type="submit" disabled={loading || !nameValid || !emailValid || !passwordValid || !passwordsMatch} className={`btn-primary w-full py-2 rounded-lg text-white font-medium ${loading || !nameValid || !emailValid || !passwordValid || !passwordsMatch ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {loading ? 'Creating…' : 'Create account'}
              </button>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="text-sm text-gray-400">or continue with</div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" className="py-2 rounded-lg border bg-white text-gray-700">Google</button>
                <button type="button" className="py-2 rounded-lg border bg-white text-gray-700">GitHub</button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-indigo-700 font-semibold">Sign in</Link>
              </div>
            </motion.form>
          </div>

          <div className="hidden md:flex flex-col justify-center px-8 md:order-1">
            <div className="text-white w-full rounded-2xl p-10 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 shadow-xl">
              <h1 className="text-4xl font-extrabold mb-3">Join StudentDash</h1>
              <p className="text-indigo-100/90">Create an account to start tracking students, importing marks and unlocking analytics</p>
              <div className="mt-6">
                <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" /> Secure & private
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

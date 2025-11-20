import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/');
    } catch (err) {
      alert(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/><br/>

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/><br/>

        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

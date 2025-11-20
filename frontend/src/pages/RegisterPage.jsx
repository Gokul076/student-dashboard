import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password, role: 'admin' });
      alert('Registered! Now login.');
      nav('/login');
    } catch (err) {
      alert(err?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br/><br/>

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

        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

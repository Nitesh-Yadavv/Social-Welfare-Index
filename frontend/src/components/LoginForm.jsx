// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ NEW: Import Link

const LoginForm = ({ onLoginSuccess }) => {
  // ... (all states and handleSubmit function remain the same)
  const [email, setEmail] = useState('test@rtu.ac.in');
  const [password, setPassword] = useState('apple@#1234');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess();
      } else {
        setError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Check if the server is running.');
      console.error(err);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <form 
        onSubmit={handleSubmit} 
        className="p-10 bg-white rounded-xl shadow-2xl w-96 max-w-sm transform hover:scale-[1.01] transition duration-300"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-700">Student Login 🚀</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email (Hint: student@rtu.ac.in)</label>
          <input
            type="email"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition duration-300 ease-in-out hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-600/70"
        >
          Sign In
        </button>

        {/* ✅ NEW: Link to Signup Page */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? 
          <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500 ml-1">
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
};

export default LoginForm;
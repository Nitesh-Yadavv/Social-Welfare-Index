// src/components/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('12345');
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
        // Store user data in local storage (basic auth)
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
    // Updated container with a subtle purple gradient background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <form 
        onSubmit={handleSubmit} 
        // Updated form styling: rounded-xl, shadow-2xl, and padding
        className="p-10 bg-white rounded-xl shadow-2xl w-96 max-w-sm transform hover:scale-[1.01] transition duration-300"
      >
        {/* Title text color updated to deep purple */}
        <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-700">Student Login 🚀</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email (Hint: student@example.com)</label>
          <input
            type="email"
            // Input styling updated with focus ring
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password (Hint: 12345)</label>
          <input
            type="password"
            // Input styling updated with focus ring
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
        
        {/* Submit Button: Purple gradient and shadow effect */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition duration-300 ease-in-out hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-600/70"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
// frontend/src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store admin info (optional)
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        // Redirect to the admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Check if the server is running.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <form 
        onSubmit={handleSubmit} 
        className="p-10 bg-white rounded-xl shadow-2xl w-96 max-w-sm"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Admin Login</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username (admin)</label>
          <input
            type="text"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password (password)</label>
          <input
            type="password"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold shadow-lg"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
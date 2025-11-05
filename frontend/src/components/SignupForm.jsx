// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [studentIdPic, setStudentIdPic] = useState(null); // State for the file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Create FormData for multipart/form-data ---
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('roll_no', rollNo);
    formData.append('mobile_no', mobileNo);
    formData.append('student_id_pic', studentIdPic);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        // IMPORTANT: Do NOT set Content-Type header
        // The browser will set it automatically for FormData
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setError('');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      setError('An error occurred. Check if the server is running.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10">
      <form 
        onSubmit={handleSubmit} 
        encType="multipart/form-data" // Standard for file uploads
        className="p-10 bg-white rounded-xl shadow-2xl w-96 max-w-sm"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-700">Create Account</h2>
        
        {/* Success Message */}
        {success && (
          <p className="text-green-600 bg-green-100 p-3 rounded-lg text-sm mb-4 font-medium">
            {success} Redirecting to login...
          </p>
        )}
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">RTU Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="student@rtu.ac.in"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">University Roll No.</label>
          <input type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mobile No. (Optional)</label>
          <input type="tel" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Student ID Card Photo</label>
          <input type="file" onChange={(e) => setStudentIdPic(e.target.files[0])}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" required />
        </div>
        
        <button type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition duration-300 hover:from-purple-700 hover:to-indigo-700">
          Sign Up
        </button>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? 
          <Link to="/" className="font-medium text-purple-600 hover:text-purple-500 ml-1">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
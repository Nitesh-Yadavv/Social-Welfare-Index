// frontend/src/components/AddActivityModal.jsx
import React, { useState } from 'react';

const AddActivityModal = ({ studentId, onClose, onActivityAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('social'); // Default category
  const [proof, setProof] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof) {
      setError('Please upload a proof file.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('proof', proof);

    try {
      const response = await fetch('http://localhost:5000/api/activities/add', {
        method: 'POST',
        body: formData, // No content-type header needed for FormData
      });

      const data = await response.json();

      if (data.success) {
        onActivityAdded(data.activity); // Pass the new activity back to the dashboard
        onClose(); // Close the modal
      } else {
        setError(data.message || 'Failed to add activity.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Activity</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            >
              <option value="social">Social</option>
              <option value="technical">Technical</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
              <option value="ncc">NCC</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Upload Proof (PDF, JPG, PNG)</label>
            <input 
              type="file" 
              onChange={(e) => setProof(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" 
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:from-purple-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
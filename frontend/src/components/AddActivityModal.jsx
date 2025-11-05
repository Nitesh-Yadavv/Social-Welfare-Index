import React, { useState } from 'react';

const AddActivityModal = ({ studentId, onClose, onActivityAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('social');
  
  // ✅ --- NEW STATE ---
  const [clubName, setClubName] = useState(''); 
  
  const [proof, setProof] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (form validation remains the same) ...
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('proof', proof);
    
    // ✅ --- ADD TO FORMDATA ---
    // Send the club name, or "N/A" if it's blank
    formData.append('club_name', clubName || 'N/A');

    try {
      // ... (fetch logic remains the same) ...
      const response = await fetch('http://localhost:5000/api/activities/add', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        onActivityAdded(data.activity);
        onClose();
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
    // ... (modal backdrop and wrapper) ...
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ... (close button and title) ... */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Activity</h2>
        
        <form onSubmit={handleSubmit}>
          {/* ... (error message) ... */}
          
          {/* ... (Activity Name input) ... */}
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

          {/* ... (Category select) ... */}
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

          {/* ✅ --- NEW INPUT FIELD --- */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Club Name <span className="text-gray-400">(if any)</span>
            </label>
            <input 
              type="text" 
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder='e.g., "Coding Club" (leave blank for "N/A")'
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
            />
          </div>

          {/* ... (Upload Proof input) ... */}
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

          {/* ... (Submit button) ... */}
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
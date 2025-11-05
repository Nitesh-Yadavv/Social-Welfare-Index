// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchPending = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/pending-activities');
      const data = await response.json();
      if (data.success) {
        setPending(data.activities);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('Server error fetching activities.');
    }
  }, []);

  useEffect(() => {
    // Basic auth check (can be improved later)
    if (!localStorage.getItem('admin_user')) {
      navigate('/admin');
    }
    fetchPending();
  }, [navigate, fetchPending]);

  const handleAction = async (activityId, action) => {
    const endpoint = action === 'approve' ? 'approve' : 'reject';
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}/${activityId}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        // Remove the approved/rejected item from the list
        setPending(prev => prev.filter(act => act.id !== activityId));
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('Server error processing action.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Logout
        </button>
      </nav>

      {message && <p className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">{message}</p>}

      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 border-b">Pending Activities ({pending.length})</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pending.length > 0 ? pending.map(act => (
                <tr key={act.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{act.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{act.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{act.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a 
                      href={`http://localhost:5000/uploads/${act.proof_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View Proof
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleAction(act.id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(act.id, 'reject')}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No pending activities found. Great job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
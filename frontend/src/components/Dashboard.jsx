// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AddActivityModal from './AddActivityModal';
import TopNavBar from './TopNavBar'; // ✅ NEW: Import TopNavBar

// ❌ OLD: We no longer import StudentOverviewCard

const Dashboard = ({ onLogout }) => {
  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null); // ✅ NEW: State for dashboard stats
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Fetch Activities (Unchanged) ---
  const fetchActivities = useCallback(async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities?student_id=${studentId}`);
      const data = await response.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  }, []);

  // ✅ --- NEW: Fetch Dashboard Stats ---
  const fetchStats = useCallback(async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard-stats?student_id=${studentId}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // --- useEffect (Updated) ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setStudent(userData);
      
      // Fetch both sets of data
      fetchActivities(userData.id);
      fetchStats(userData.id);
    } else {
      onLogout();
    }
  }, [fetchActivities, fetchStats, onLogout]); // Add fetchStats to dependency array

  // --- Logout Handler (Unchanged) ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  // --- Activity Added Handler (Unchanged) ---
  const handleActivityAdded = (newActivity) => {
    setActivities([newActivity, ...activities]);
    // Re-fetch stats to get new totals
    fetchStats(student.id);
  };

  // ✅ --- Updated Loading State ---
  // Wait for all data to be loaded
if (!student || !activities || !stats) {
    return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ... (TopNavBar remains the same) ... */}
      <TopNavBar student={student} stats={stats} onLogout={handleLogout} />

      <main className="pt-40 p-10">
        <div className="flex space-x-8">
          {/* Left Side: Activity List */}
          <div className="flex-grow w-2/3">
            {/* ... (Sub-header and Add Activity Button) ... */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Activity Summary</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition"
              >
                &#x271A; Add New Activity
              </button>
            </div>

            {/* --- Activity Table (Updated) --- */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    {/* ✅ --- NEW HEADER --- */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.category}</td>
                        {/* ✅ --- NEW CELL --- */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.club_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {/* ... (status logic) ... */}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.points}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* ✅ --- ColSpan updated to 6 --- */}
                      <td colSpan="6" className="text-center p-6 text-gray-500">
                        You haven't added any activities yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* ... (Right Side: Upcoming Events) ... */}
          {/* --- Right Side: Upcoming Events --- */}
          <div className="w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Upcoming Events</h2>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-500">No upcoming events found.</p>
              {/* Later, this will be a list of events from the DB */}
            </div>
          </div>
          
        </div>
      </main>

      {/* ... (Modal rendering) ... */}
      {isModalOpen && (
        <AddActivityModal 
          studentId={student.id}
          onClose={() => setIsModalOpen(false)}
          onActivityAdded={handleActivityAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;
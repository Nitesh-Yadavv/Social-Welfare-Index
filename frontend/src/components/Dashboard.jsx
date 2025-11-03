// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';

const Dashboard = ({ onLogout }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // This endpoint currently fetches ALL activities, not just the user's
        // For production, you'd want an endpoint like /api/students/{user.id}/activities
        const response = await fetch('http://localhost:5000/api/activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) return <div className="p-8 text-center text-purple-600">Loading activities...</div>;

  return (
    // Updated container with a subtle purple gradient background
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-purple-200">
          <h1 className="text-3xl font-extrabold text-purple-800">Welcome, {user?.name || 'Student'}! 🎉</h1>
          {/* Logout Button: Dark purple background */}
          <button
            onClick={handleLogout}
            className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg transition duration-300 ease-in-out hover:bg-purple-700 hover:shadow-xl"
          >
            Logout
          </button>
        </header>

        {/* Activities Section */}
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Your Engagement Index</h2>

        <div className="shadow-lg rounded-xl overflow-hidden">
          <ul className="divide-y divide-purple-100">
            {activities.map((activity) => (
              <li 
                key={activity.id} 
                className="p-4 md:p-6 flex justify-between items-center bg-white transition duration-200 ease-in-out hover:bg-purple-50"
              >
                <div>
                  {/* Activity Name */}
                  <p className="text-xl font-medium text-gray-900">{activity.name}</p>
                  {/* Points */}
                  <p className="text-sm text-purple-500 font-medium">
                    Points: <span className="font-semibold text-purple-700">{activity.points}</span>
                  </p>
                </div>
                {/* Status Badge: Conditional styling for Active/Completed */}
                <span className={`
                  px-4 py-1 text-sm font-bold rounded-full 
                  ${
                    activity.status === 'Active' 
                      ? 'bg-indigo-200 text-indigo-800 border-2 border-indigo-400' 
                      : 'bg-green-100 text-green-700 border-2 border-green-300'
                  }
                `}>
                  {activity.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
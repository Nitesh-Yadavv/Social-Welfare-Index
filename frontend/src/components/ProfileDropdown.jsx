// frontend/src/components/ProfileDropdown.jsx
import React from 'react';
import { PowerIcon } from '@heroicons/react/24/solid'; // npm install @heroicons/react

const ProfileDropdown = ({ student, stats, onLogout }) => {
  
  // Use UI-Avatars if no photo, or construct URL
  const imageUrl = student.student_id_pic_url
    ? `http://localhost:5000/uploads/${student.student_id_pic_url}`
    : `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random&color=fff`;

  // Helper for displaying stats
  const StatItem = ({ label, value }) => (
    <div className="text-center">
      <div className="text-xl font-bold text-purple-700">{value}</div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="absolute top-20 right-8 w-96 bg-white rounded-xl shadow-2xl z-40 overflow-hidden border border-gray-200">
      {/* --- Top Info Section --- */}
      <div className="flex items-center p-6 space-x-4">
        <img
          className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
          src={imageUrl}
          alt={student.name}
        />
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
          <p className="text-sm text-gray-500">{student.roll_no}</p>
        </div>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-4 gap-2 border-y border-gray-200 bg-gray-50 px-6 py-4">
        <StatItem label="Total Points" value={stats.total_points} />
        <StatItem label="Ranking" value={`#${stats.ranking}`} />
        <StatItem label="Total Activities" value={stats.total_activities} />
        <StatItem label="Social Activities" value={stats.social_activities} />
      </div>
      
      {/* --- Contact Info --- */}
      <div className="p-6 text-sm text-gray-600 space-y-2">
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Mobile:</strong> {student.mobile_no || 'N/A'}</p>
      </div>

      {/* --- Logout Button --- */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 text-left p-4 bg-gray-100 hover:bg-red-100 text-red-600 font-medium transition duration-150"
      >
        <PowerIcon className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
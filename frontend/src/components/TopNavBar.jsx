// frontend/src/components/TopNavBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProfileDropdown from './ProfileDropdown';

const TopNavBar = ({ student, stats, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get first letter of name for the profile icon
  const profileInitial = student.name ? student.name[0].toUpperCase() : '?';
  
  // Calculate Social Welfare Index (as a percentage, max 100)
  const socialIndex = Math.min(stats.social_points, 100);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav 
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-700 to-indigo-600 h-20 px-8 shadow-lg z-30 flex items-center justify-between"
    >
      
      {/* --- Left Side: Social Welfare Index --- */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">Social Welfare Index</h1>
        <div className="w-64">
          <div className="flex justify-between text-sm font-medium text-purple-200 mb-1">
            <span>Social Points</span>
            <span>{socialIndex} / 100</span>
          </div>
          {/* Darker track for the progress bar */}
          <div className="w-full bg-purple-900 bg-opacity-50 rounded-full h-2.5">
            {/* White fill for contrast */}
            <div 
              className="bg-white h-2.5 rounded-full" 
              style={{ width: `${socialIndex}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Profile --- */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2"
        >
          {/* Profile text is now white */}
          <span className="text-sm font-medium text-white hidden sm:block">Profile</span>
          {/* Inverted circle: White background, purple text */}
          <div className="w-10 h-10 rounded-full bg-white text-purple-700 flex items-center justify-center text-lg font-bold">
            {profileInitial}
          </div>
        </button>

        {/* --- Render Dropdown --- */}
        {isDropdownOpen && (
          <ProfileDropdown 
            student={student} 
            stats={stats} 
            onLogout={onLogout} 
          />
        )}
      </div>
    </nav>
  );
};

export default TopNavBar;
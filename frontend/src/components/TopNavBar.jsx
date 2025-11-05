// frontend/src/components/TopNavBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProfileDropdown from './ProfileDropdown.jsx';

const TopNavBar = ({ student, stats, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const profileInitial = student.name ? student.name[0].toUpperCase() : '?';
  
  // ✅ --- SWI Formula Calculation ---
  const calculateSWI = () => {
    const { Ps, Pt, Ns, Nt, Vs, D } = stats;

    // Handle potential divide-by-zero errors
    const term1 = 0.5 * (Pt > 0 ? Ps / Pt : 0);
    const term2 = 0.25 * (Ns > 0 ? Vs / Ns : 0);
    const term3 = 0.15 * D;
    const term4 = 0.1 * (Nt > 0 ? Ns / Nt : 0);
    
    const swi_score = 100 * (term1 + term2 + term3 + term4);
    
    // Round it and make sure it doesn't go over 100
    return Math.min(Math.round(swi_score), 100);
  };

  // The calculated score (e.g., 53)
  const socialIndexScore = calculateSWI();
  // ----------------------------------------

  // ... (useEffect for dropdown remains the same) ...
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
      
      {/* --- ✅ Left Side: Progress Bar is Back! --- */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">Social Welfare Index</h1>
        <div className="w-64">
          <div className="flex justify-between text-sm font-medium text-purple-200 mb-1">
            <span>Social Index Score</span>
            {/* It now shows the calculated score */}
            <span>{socialIndexScore} / 100</span>
          </div>
          <div className="w-full bg-purple-900 bg-opacity-50 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full" 
              // The width is now your smart formula's result
              style={{ width: `${socialIndexScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Profile (Unchanged) --- */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2"
        >
          <span className="text-sm font-medium text-white hidden sm:block">Profile</span>
          <div className="w-10 h-10 rounded-full bg-white text-purple-700 flex items-center justify-center text-lg font-bold">
            {profileInitial}
          </div>
        </button>

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
// frontend/src/components/StudentOverviewCard.jsx
import React from 'react';

const StudentOverviewCard = ({ student, activities }) => {
  
  // Calculate total activities
  const totalActivities = activities ? activities.length : 0;

  // Construct the image URL
  // If no pic, use a service (ui-avatars) to generate an avatar from their name
  const imageUrl = student.student_id_pic_url
    ? `http://localhost:5000/uploads/${student.student_id_pic_url}`
    : `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random&color=fff`;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8 flex items-center space-x-6">
      
      {/* Left Side: Profile Circle */}
      <div className="flex-shrink-0">
        <img
          className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
          src={imageUrl}
          alt={student.name}
        />
      </div>

      {/* Middle: Student Info */}
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
        <p className="text-sm text-gray-500 font-medium">{student.roll_no}</p>
        
        <div className="flex space-x-4 mt-2 text-gray-600 text-xs">
          <span>{student.email}</span>
          <span>&bull;</span>
          <span>{student.mobile_no || 'No mobile provided'}</span>
        </div>
      </div>

      {/* Right Side: Engagement Stats */}
      <div className="flex-shrink-0 text-center">
        <div className="bg-purple-100 p-4 rounded-lg">
          <span className="block text-4xl font-bold text-purple-700">
            {totalActivities}
          </span>
          <span className="block text-sm font-medium text-purple-600">
            Total Activities
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentOverviewCard;
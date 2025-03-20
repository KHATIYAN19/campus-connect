import React from 'react';
import { FaClock, FaUserCircle } from 'react-icons/fa';

const MessageComponent = ({ topic, userImage, userName, collegeName, message, batch, timeAgo }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-8">
      {/* Topic and Metadata */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {topic}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <FaClock className="text-indigo-500" />
            {timeAgo} days ago
          </span>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Batch: {batch}
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-indigo-100"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500">{collegeName}</p>
          </div>
        </div>
      </div>

      {/* Full Message */}
      <div className="prose max-w-none text-gray-700 mb-6">
        {message}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          Posted on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default MessageComponent;
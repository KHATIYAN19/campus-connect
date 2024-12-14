import React from 'react';
import { FaTrash, FaClock } from 'react-icons/fa';

const MessageComponent = ({ userImage, userName, collegeName, message, batch, timeAgo }) => {
  const role = localStorage.getItem('role');
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 w-[90%] min-h-[20rem] mx-auto font-serif hover:scale-105 transition-transform duration-300">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        {/* User Info */}
        <div className="flex items-center">
          <img
            src={userImage}
            alt={`${userName}'s profile`}
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div className="ml-4">
            <h2 className="font-semibold text-gray-800 text-lg">{userName}</h2>
            <p className="text-sm text-gray-500">{collegeName}</p>
          </div>
        </div>
        {/* Time & Delete Icon */}
        <div className="flex items-center space-x-2 text-gray-600">
          <FaClock className="text-[#98652e]" />
          <span className="text-sm">{timeAgo} days ago</span>
          {/* {
            role==='admin'?(<button className="text-red-500 hover:text-red-700 transition">
              <FaTrash />
            </button>):(<></>)
          } */}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Message */}
      <p className="text-gray-800 text-lg  min-h-[10rem] leading-relaxed mb-3">{message}</p>

     

      {/* Divider Above Batch */}
      <hr className="my-3 border-gray-300" />

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-white bg-[#98652e] px-3 py-1 rounded-full border border-gray-200">
          Batch: {batch}
        </span>
      </div>
    </div>
  );
};

export default MessageComponent;

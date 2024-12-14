import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import MessageComponent from '../pages/MessageComponent';
import InterviewExperiences from '../pages/InterviewExperiences';
import Messages from '../pages/Messages';
const Homepage = () => {

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 space-y-8">
      {/* JobCard Section */}
      <div className="bg-pink-50 shadow-lg rounded-2xl p-6">
        <JobCard />
      </div>
  
      {/* InterviewExperiences Section */}
      <div className="bg-green-50 shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Interview Experiences
        </h2>
        <InterviewExperiences show={false} />
      </div>
  
      {/* Latest Notice Section */}
      <div className="bg-yellow-50 shadow-lg rounded-2xl p-6">
        {/* <h2 className="text-center text-2xl sm:text-3xl font-bold text-yellow-800 mb-4">
          Latest Notice
        </h2> */}
        <Messages show={false} />
      </div>
    </div>
  );
  
  
};

export default Homepage;

import React from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import MessageComponent from '../pages/MessageComponent';
import InterviewExperiences from '../pages/InterviewExperiences';
import Messages from '../pages/Messages';
import icon from '../Assets/mainpic.webp';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#b65f] via-purple-300 to-[#6a006c] p-4 sm:p-8 space-y-8">
      {/* Top Section: Image and Description */}
      <div className="flex flex-col md:flex-row items-center bg-opacity-80 shadow-lg rounded-2xl p-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Image Section */}
        <div className="flex-1">
          <img
            src={icon} // Replace with your image path
            alt="Project Visual"
            className="w-26 h-26 h-auto rounded-full shadow-md border border-[#80006c]"
          />
        </div>
        {/* Description Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#80006c] mb-4">Welcome!</h1>
          <p className="text-lg text-black">
            Placement Connect is your go-to app for all placement-related updates and opportunities at your college. Stay informed about the latest job postings, interview experiences, and important notices to help you ace your career journey.
          </p>
        </div>
      </div>

      {/* JobCard Section */}
      <div className="bg-white bg-opacity-80 shadow-lg rounded-2xl p-6">
        <JobCard />
      </div>

      {/* Interview Experiences Section */}
      <div className="bg-white bg-opacity-80 shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#3a5311] mb-4">
          Interview Experiences
        </h2>
        <InterviewExperiences show={false} />
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 bg-[#568303] text-white rounded-full font-semibold hover:bg-green-600 transition duration-300">
            Share Your Experience
          </button>
        </div>
      </div>

      {/* Latest Notices Section */}
      <div className="bg-white bg-opacity-80 shadow-lg rounded-2xl p-6">
        <div className="grid items-center">
          {/* Each message is displayed as a card */}
          <Messages show={false} />
          {/* Add more <Messages /> components if needed */}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import React from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import MessageComponent from '../pages/MessageComponent';
import InterviewExperiences from '../pages/InterviewExperiences';
import Messages from '../pages/Messages';
import icon from '../Assets/mainpic.webp';
import { Link } from 'react-router-dom';

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
      <section className="relative w-full h-[75vh] bg-cover bg-center rounded-2xl " style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/choice-worker-concept-illustrated_52683-44076.jpg?semt=ais_hybrid)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl" ></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-8">
                <h1 className="text-5xl font-bold leading-tight mb-4 animate__animated animate__fadeInUp">Share Your Recent Interview Experience</h1>
                <p className="text-lg mb-6 max-w-lg mx-auto animate__animated animate__fadeInUp animate__delay-1s">Your experience could inspire others!<br/>Did you recently attend an interview? Whether it was a campus placement, internship, or a full-time role, your story matters. Share the challenges you faced, the questions you tackled, and the lessons you learned.</p>
                <Link to="/experience" className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105">Share Your Experience </Link>
              </div>
      </section>





      <section className="py-16 bg-gray-100 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Easy Student Registration</h3>
              <p className="text-gray-700">
                Register your details and instantly get access to a wide range of campus placement opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ">
              <h3 className="text-xl font-semibold mb-4 text-green-600">Browse Top Companies</h3>
              <p className="text-gray-700">
                Explore leading companies and apply to job openings that match your skills and career goals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-yellow-600">Track Your Applications</h3>
              <p className="text-gray-700">
                Keep track of your job applications and monitor the status of your interview process.
              </p>
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 bg-indigo-600 text-white rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Step 1: Register</h3>
              <p className="text-gray-700">Create your profile with necessary details and your resume to get started.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-yellow-500">Step 2: Apply</h3>
              <p className="text-gray-700">Browse job listings and apply to roles that match your qualifications and aspirations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-green-600">Step 3: Interview</h3>
              <p className="text-gray-700">Prepare for interviews with companies and land your dream job or internship!</p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-center rounded-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Have Any Query ?</h2>
          <p className="text-xl mb-6">If you have any Query then Contact us our team help you to solve your query.</p>
          <Link to="/contact" className="bg-white text-indigo-600 py-3 px-8 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105">Contact</Link>
        </div>
      </section>
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

      <section className="py-16 bg-gray-900 text-white rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 animate__animated animate__fadeInUp">About Campus Connect</h2>
          <p className="text-lg mb-8 animate__animated animate__fadeInUp animate__delay-1s">
            Campus Connect is designed to simplify campus placements. We bridge the gap between students and top recruiters, helping students access opportunities at leading companies.
          </p>
          <div className="flex justify-center gap-12 mt-6 animate__animated animate__fadeInUp animate__delay-2s">
            <img src="https://via.placeholder.com/150" alt="Company Logos" className="w-16 h-16 rounded-full object-cover"/>
            <img src="https://via.placeholder.com/150" alt="Job Opportunities" className="w-16 h-16 rounded-full object-cover"/>
            <img src="https://via.placeholder.com/150" alt="Student Profiles" className="w-16 h-16 rounded-full object-cover"/>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 py-8 rounded-2xl">
              <div className="max-w-7xl mx-auto px-6 text-center text-white">
                <p>&copy; {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
                <div className="mt-4">
                  <Link to="/terms" className="text-white hover:text-indigo-300">Terms & Conditions</Link> | 
                  <Link to="/privacy" className="text-white hover:text-indigo-300"> Privacy Policy</Link>
                </div>
              </div>
      </footer>
    </div>
  );
};

export default Homepage;

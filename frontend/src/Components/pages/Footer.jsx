import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/choice-worker-concept-illustrated_52683-44076.jpg?semt=ais_hybrid)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-8">
          <h1 className="text-5xl font-bold leading-tight mb-4 animate__animated animate__fadeInUp">Unlock Your Career with Campus Connect</h1>
          <p className="text-lg mb-6 max-w-lg mx-auto animate__animated animate__fadeInUp animate__delay-1s">A powerful platform connecting students to top companies for seamless campus placements. Your dream job is just one click away.</p>
          <Link to="/register" className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105">Get Started</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 text-white">
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

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Easy Student Registration</h3>
              <p className="text-gray-700">
                Register your details and instantly get access to a wide range of campus placement opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
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

      {/* How It Works Section */}
      <section className="py-16 bg-indigo-600 text-white">
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

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-6">Join Campus Connect today and start applying to top companies for your dream job. It's easy and free!</p>
          <Link to="/register" className="bg-white text-indigo-600 py-3 px-8 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105">Register Now</Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-8">
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

export default Footer;

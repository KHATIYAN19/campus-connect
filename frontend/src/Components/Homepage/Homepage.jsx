import React from 'react';
import Navbar from '../shared/Navbar';
import { Link } from 'react-router-dom';
import { FaBuilding, FaCalendarAlt, FaChartBar, FaUserTie, FaBriefcase, FaInfoCircle } from 'react-icons/fa';

const Homepage = () => {
  const primaryColor = 'indigo';
  const secondaryColor = 'purple';
  const accentColor = 'pink';
  const textColorPrimary = 'gray-700';
  const textColorSecondary = 'white';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${primaryColor}-100 via-${secondaryColor}-200 to-${accentColor}-100 p-4 sm:p-8 space-y-12`}>
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="College Campus Placement"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        <div className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-300 via-${secondaryColor}-400 to-${accentColor}-300 opacity-70`}></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white py-24 px-6">
          <h1 className="text-5xl font-bold leading-tight mb-6 animate__animated animate__fadeInDown">
            Your Gateway to Top Campus Placements at [Your College Name]
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-1s">
            Connecting our talented students with leading companies for successful career placements.
          </p>
          <Link
            to="/jobs"
            className={`bg-${primaryColor}-600 text-${textColorSecondary} py-3 px-8 rounded-full font-semibold hover:bg-${primaryColor}-700 transition duration-300 transform hover:scale-105 animate__animated animate__pulse animate__delay-2s animate__infinite`}
          >
            Explore Our Placement Companies
          </Link>
        </div>
      </section>

      {/* Top Section: Welcome to Placements */}
      <div className="bg-white bg-opacity-90 shadow-lg rounded-3xl p-8 flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
        {/* Image Section */}
        <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden shadow-md border-4 border-purple-300">
          <img
            src="https://images.unsplash.com/photo-1542739674-b4344319093d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Placement Welcome"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Description Section */}
        <div className="flex-grow text-center md:text-left">
          <h2 className={`text-3xl font-bold text-${secondaryColor}-700 mb-4`}>Welcome to the Placement Portal of [Your College Name]</h2>
          <p className={`text-lg text-${textColorPrimary} leading-relaxed`}>
            At [Your College Name], we are committed to providing our students with the best opportunities to launch their careers. Our dedicated placement cell works tirelessly to invite top companies for campus recruitment, ensuring our students have a platform to showcase their skills and secure promising futures.
          </p>
          <div className="mt-6">
            <Link to="https://www.glbitm.org/training-and-placements/" className={`inline-block bg-gradient-to-r from-${secondaryColor}-500 to-${primaryColor}-500 text-${textColorSecondary} py-2 px-6 rounded-full font-semibold hover:bg-${primaryColor}-600 transition duration-300`}>
              Learn About Our Placement Cell <FaInfoCircle className="inline-block ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Key Features Section (Now focused on College Placements) */}
      <section className={`py-16 bg-gradient-to-br from-${accentColor}-100 to-gray-100 rounded-3xl shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-8 text-${primaryColor}-700`}>Key Highlights of Placements at [Your College Name]</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-${primaryColor}-100 text-${primaryColor}-500 rounded-full`}>
                <FaBuilding className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-${primaryColor}-600`}>Top Visiting Companies</h3>
              <p className={`text-${textColorPrimary} leading-relaxed`}>
                We regularly host recruitment drives for leading companies across various sectors.
              </p>
              <Link to="/placements/companies" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-2">View Companies</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-${secondaryColor}-100 text-${secondaryColor}-500 rounded-full`}>
                <FaCalendarAlt className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-${secondaryColor}-600`}>Placement Schedule</h3>
              <p className={`text-${textColorPrimary} leading-relaxed`}>
                Stay updated on the schedule of upcoming campus recruitment drives and company visits.
              </p>
              <Link to="/placements/schedule" className="text-sm font-semibold text-purple-600 hover:text-purple-800 mt-2">See Schedule</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-${accentColor}-100 text-${accentColor}-500 rounded-full`}>
                <FaChartBar className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-${accentColor}-600`}>Impressive Placement Statistics</h3>
              <p className={`text-${textColorPrimary} leading-relaxed`}>
                Explore our year-on-year placement records and success stories.
              </p>
              <Link to="/placements/statistics" className="text-sm font-semibold text-pink-600 hover:text-pink-800 mt-2">View Stats</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visiting Companies Section */}
      <section className={`py-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-8 text-${primaryColor}-700`}>Our Esteemed Placement Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Replace these with actual company logos or names */}
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/HashedIn.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company A" className="max-h-10 max-w-full object-contain" />
              <p>HashedIn</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/Thoughtworks.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company B" className="max-h-10 max-w-full object-contain" />
              <p>ThoughtWorks</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/Amazon.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company C" className="max-h-10 max-w-full object-contain" />
              <p>Amazon</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/Google.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company D" className="max-h-10 max-w-full object-contain" />
              <p>Google</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/Juspay.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company E" className="max-h-10 max-w-full object-contain" />
              <p>Juspay</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center gap-5">
              <img src="https://img.logo.dev/Autodesk.com?token=pk_LhuGWkxESfCNeTIfkWoI8w" alt="Company F" className="max-h-10 max-w-full object-contain" />
              <p>AutoDesk</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="https://www.glbitm.org/our-recruiters/" className={`inline-block bg-gradient-to-r from-${primaryColor}-500 to-${secondaryColor}-500 text-${textColorSecondary} py-2 px-6 rounded-full font-semibold hover:bg-${secondaryColor}-600 transition duration-300`}>
              See All Our Placement Partners
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Statistics Section */}
      <section className={`py-16 bg-gradient-to-br from-${secondaryColor}-600 to-${primaryColor}-600 text-${textColorSecondary} rounded-3xl shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Placement Success at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`bg-${textColorSecondary} text-${textColorPrimary} p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300`}>
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-${secondaryColor}-200 text-${secondaryColor}-600 rounded-full`}>
                <FaUserTie className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-${secondaryColor}-700`}>2025 Placement Rate</h3>
              <p className="text-3xl font-bold">[90]%</p>
            </div>
            <div className={`bg-${textColorSecondary} text-${textColorPrimary} p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300`}>
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-yellow-200 text-yellow-600 rounded-full`}>
                <FaBriefcase className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-yellow-600`}>Total Offers in 2025</h3>
              <p className="text-3xl font-bold">1800+</p>
            </div>
            <div className={`bg-${textColorSecondary} text-${textColorPrimary} p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300`}>
              <div className={`flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-green-200 text-green-600 rounded-full`}>
                <FaChartBar className="text-2xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-green-600`}>Average Salary Package</h3>
              <p className="text-3xl font-bold">₹ 11.2 LPA</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/placements/statistics" className={`inline-block bg-gradient-to-r from-${accentColor}-500 to-${primaryColor}-500 text-${textColorSecondary} py-2 px-6 rounded-full font-semibold hover:bg-${primaryColor}-600 transition duration-300`}>
              See Detailed Placement Statistics
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-16 bg-gradient-to-br from-${accentColor}-200 to-${secondaryColor}-200 text-white rounded-3xl shadow-lg text-center`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">Ready to Explore Your Career Opportunities?</h2>
          <p className="text-xl mb-6">Students, connect with top companies. Recruiters, find your next generation of talent.</p>
          <div className="mt-4 space-x-4">
            <Link
              to="/students/registration"
              className={`bg-${primaryColor}-600 text-${textColorSecondary} py-3 px-8 rounded-full font-semibold hover:bg-${primaryColor}-700 transition duration-300 transform hover:scale-105`}
            >
              Student Registration
            </Link>
            <Link
              to="/recruiters/registration"
              className={`bg-white text-${primaryColor}-700 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105`}
            >
              Recruiter Registration
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section (Now about the College) */}
      <section className={`py-16 bg-gradient-to-br from-${secondaryColor}-700 to-${primaryColor}-700 text-${textColorSecondary} rounded-3xl shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <div className="md:flex items-center gap-16">
            <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1519682337058-a941234f7a3a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="College Building" className="rounded-xl shadow-md" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">About [Your College Name]</h2>
              <p className="text-lg leading-relaxed mb-8">
                [Your College Name] has a long-standing tradition of academic excellence and a strong commitment to the career development of its students. Our placement cell works diligently to foster relationships with leading companies across various industries, providing our students with unparalleled placement opportunities.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                We focus on holistic development, ensuring our graduates are not only academically strong but also equipped with the necessary skills and professionalism to excel in their chosen careers. Our placement record is a testament to our dedication and the quality of our students.
              </p>
              <Link to="https://www.glbitm.org/" className={`bg-${textColorSecondary} text-${primaryColor}-700 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition duration-300`}>
                Learn More About Our College
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={`bg-gray-900 py-8 rounded-3xl shadow-md text-center text-gray-300`}>
        <div className="max-w-7xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} [Your College Name]. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link to="/terms" className="hover:text-indigo-300">Terms & Conditions</Link>
            <span className="text-gray-500">|</span>
            <Link to="/privacy" className="hover:text-indigo-300">Privacy Policy</Link>
            <span className="text-gray-500">|</span>
            <Link to="/contact" className="hover:text-indigo-300">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
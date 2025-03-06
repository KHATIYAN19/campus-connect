import React from "react";
import { NavLink } from "react-router-dom";  // Import NavLink from react-router-dom
import mainpic from "../Assets/main2.png";
import icon from "../Assets/connect.png";

function Main() {
  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-[#b65f] to-[#6a006c] text-white p-4">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src={icon} // Use your brand logo here
              alt="Logo"
              className="w-12 h-13"
            />
            <h1 className="text-3xl font-bold">Placement Connect</h1>
          </div>
          <div className="space-x-4">
            <NavLink to="/login">
              <button className="bg-gradient-to-r from-[#b65f] to-[#6a006c] text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 hover:opacity-80 duration-300">
                Login
              </button>
            </NavLink>
            <NavLink to="/signup">
              <button className="bg-gradient-to-r from-[#b65f] to-[#6a006c] text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 hover:opacity-80 duration-300">
                Sign Up
              </button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Image and Content Section */}
      <section className="flex items-center justify-between p-12 bg-gradient-to-r from-[#b65f] to-[#6a006c]">
        {/* Image Section */}
        <div className="flex-1">
          <img
            src={mainpic} // Use your image here
            alt="Hero"
            className="w-full h-96 object-cover rounded-lg transition-all duration-500 transform hover:scale-105 hover:opacity-90"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 pl-12 text-white">
          <h2 className="text-5xl font-semibold mb-4 transition-all transform hover:translate-x-4">
            Welcome to Placement Connect
          </h2>
          <p className="text-xl mb-6 transition-all transform hover:translate-x-4">
            Your go-to app for all placement-related activities and opportunities.
            Stay ahead with real-time updates and easy access to placement information!
          </p>
          <NavLink to="/homepage">
            <button className="bg-gradient-to-r from-[#80004c] to-[#6a006c] text-white px-6 py-3 text-sm font-semibold rounded-full transition-all hover:bg-[#6a006c] hover:opacity-90 transform hover:scale-105 duration-300">
              Get Started
            </button>
          </NavLink>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-gradient-to-r from-[#b65f] to-[#6a006c] text-white py-8 text-center rounded-b-lg shadow-xl">
        <h3 className="text-xl font-medium mb-2 transition-all transform hover:scale-105">
          Contact Us
        </h3>
        <p className="text-md mb-4 transition-all transform hover:scale-105">
          Have any questions? We are here to help you!
        </p>
        <NavLink to="/contact">
          <button className="bg-gradient-to-r from-[#80004c] to-[#6a006c] text-white px-6 py-3 text-sm font-semibold rounded-full transition-all hover:bg-[#6a006c] hover:opacity-90 transform hover:scale-105 duration-300">
            Reach Out
          </button>
        </NavLink>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-[#80004c] to-[#6a006c] text-white py-6 mt-0">
        <div className="text-center">
          <p>&copy; 2024 Placement Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Main;

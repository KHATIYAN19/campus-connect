import React from 'react';
import mainpic from '../Assets/mainpic.webp';
import { NavLink } from 'react-router-dom';
import homepage from '../Homepage/Homepage';

function Main() {
    return (
        <div className="bg-white min-h-screen flex flex-col justify-between items-center rounded-lg">

            {/* Main Content */}
            <main className="flex flex-col lg:flex-row items-center justify-center w-full flex-1 px-20 lg:space-x-16 bg-gradient-to-r from-purple-400 to-pink-400">
                <div className="text-center lg:text-left lg:mr-8">
                    {/* Enhanced Welcome Message with Gradient Text */}
                    <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-700 mb-6 transition duration-500 transform hover:scale-105">
                        Welcome to Placement <span className='text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-purple-900'>Connect</span>
                    </h2>
                    <p className="text-lg text-gray-700 mb-6 transition duration-300 hover:text-purple-950 font-medium break-words max-w-full">
                        Your seamless gateway to career opportunities and cutting-edge technology. Join us and accelerate your future today.
                    </p>


                    {/* "Click Here" or "Know More" Link */}
                    <NavLink
                        to="/homepage"
                        className="text-white bg-gradient-to-r from-neutral-800 to-pink-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-full transition duration-300 text-lg shadow-2xl transform hover:scale-105"
                    >
                        Click Here to Know More
                    </NavLink>
                </div>
                <div className="relative mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
                    <div className="w-full max-w-lg h-auto bg-gradient-to-br from-[#4d002d] to-[#e60088] rounded-full flex items-center justify-center shadow-lg overflow-hidden relative border-4 border-transparent transition-all duration-300 hover:border-[#b3006a]">
                        <div className="absolute w-full h-full bg-purple-500 bg-opacity-30 rounded-full animate-pulse"></div>
                        <img
                            src={mainpic}
                            alt="App Logo"
                            className="rounded-full w-full h-auto transform transition duration-300 hover:scale-105"
                        />
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="w-full bg-gradient-to-r from-purple-400 to-pink-400 py-6 text-center rounded-b-lg">
                <p className="text-[#33001e] font-semibold transition duration-300 hover:text-[#4d002d]">Contact Me</p>
                <p className="text-gray-900 transition duration-300 hover:text-[#4d002d]">Email: contact@myapp.com</p>
                <p className="text-gray-900 transition duration-300 hover:text-[#4d002d]">Phone: +1 234 567 890</p>
            </footer>
        </div>
    );

}

export default Main;

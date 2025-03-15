import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../LoginSignUp/axios.js';
import { LogOut, Trash2, User2 } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/logout');
      if (response) {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Logout Successfully");
        navigate("/login");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteClick = () => setShowPopup(true);
  const handleCancel = () => setShowPopup(false);
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete('http://localhost:8080/deleteAccount');
      if (response) {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Account Deleted!");
        setShowPopup(false);
        navigate("/login");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setShowPopup(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-200 to-cyan-200 shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 shadow-md border-2 border-white">
                <AvatarImage
                  src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png"
                  alt="Placement Connect Logo"
                />
              </Avatar>
              <h1 className="text-xl md:text-3xl font-bold text-teal-700 font-serif tracking-tight">
                Placement<span className="text-orange-500">Connect</span>
              </h1>
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links for Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <div className="flex items-center space-x-6">
                {['/', '/Jobs', '/notices', '/experience', '/contact'].map((path, index) => (
                  <Link
                    key={index}
                    to={path}
                    className={`text-gray-700 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                      location.pathname === path ? 'bg-orange-100 text-teal-700 font-semibold' : ''
                    }`}
                  >
                    {path === '/'
                      ? 'Home'
                      : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                ))}
                {role === 'admin' && (
                  <>
                    <Link
                      to="/jobs/post"
                      className={`text-gray-700 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/jobs/post' ? 'bg-orange-100 text-teal-700 font-semibold' : ''
                      }`}
                    >
                      Add-Drive
                    </Link>
                    <Link
                      to="/blocks"
                      className={`text-gray-700 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/blocks' ? 'bg-orange-100 text-teal-700 font-semibold' : ''
                      }`}
                    >
                      Block
                    </Link>
                    <Link
                      to="/notice/post"
                      className={`text-gray-700 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/notice/post' ? 'bg-orange-100 text-teal-700 font-semibold' : ''
                      }`}
                    >
                      Add-Notice
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Auth Buttons (Login/Signup or User Profile) */}
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full text-teal-600 hover:bg-teal-100 hover:text-teal-700 font-semibold">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 rounded-full text-white font-semibold">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1">
                    <img
                      className="object-cover w-10 h-10 shadow-md border border-white"
                      src={user.image}
                      alt={user.name}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-md border border-gray-200 bg-white shadow-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="rounded-full overflow-hidden w-12 h-12 shadow-md border border-white">
                      <img
                        className="object-cover w-full h-full"
                        src={user.image}
                        alt={user.name}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-700">Welcome, {user.name}</h4>
                      <p className="text-sm text-gray-500">Placement Connect User</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-teal-700 rounded-md transition duration-150"
                    >
                      <User2 className="w-5 h-5 text-teal-500" />
                      View Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-teal-700 rounded-md transition duration-150 w-full text-left"
                    >
                      <LogOut className="w-5 h-5 text-teal-500" />
                      Logout
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 rounded-md transition duration-150 w-full text-left"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                      Delete Account
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user && (
            <>
              {['/', '/Jobs', '/notices', '/experience', '/contact'].map((path, index) => (
                <Link
                  key={index}
                  to={path}
                  className={`bg-orange-100 text-teal-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                    location.pathname === path ? 'bg-orange-200 font-semibold' : ''
                  }`}
                >
                  {path === '/'
                    ? 'Home'
                    : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              ))}
              {role === 'admin' && (
                <>
                  <Link
                    to="/jobs/post"
                    className={`bg-orange-100 text-teal-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/jobs/post' ? 'bg-orange-200 font-semibold' : ''
                    }`}
                  >
                    Add-Drive
                  </Link>
                  <Link
                    to="/blocks"
                    className={`bg-orange-100 text-teal-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/blocks' ? 'bg-orange-200 font-semibold' : ''
                    }`}
                  >
                    Block
                  </Link>
                  <Link
                    to="/notice/post"
                    className={`bg-orange-100 text-teal-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/notice/post' ? 'bg-orange-200 font-semibold' : ''
                    }`}
                  >
                    Add-Notice
                  </Link>
                </>
              )}
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-100 hover:text-orange-700 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-orange-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600 transition duration-300"
              >
                Signup
              </Link>
            </>
          )}
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="rounded-full overflow-hidden w-10 h-10 shadow-md border border-white">
                  <img
                    className="object-cover w-full h-full"
                    src={user.image}
                    alt={user.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-teal-700">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">User</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-teal-700 transition duration-300"
                >
                  View Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-teal-700 transition duration-300 w-full text-left"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition duration-300 w-full text-left"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <p className="text-lg font-semibold mb-6 text-gray-700">
              Are you absolutely sure you want to <span className="text-red-600">delete</span> your account? This action is irreversible!
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="w-4 h-4 inline-block mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
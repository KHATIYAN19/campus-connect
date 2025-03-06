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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            <AvatarImage
              src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png"
              alt="@shadcn"
            />
          </Avatar>
          <h1 className="text-xl md:text-4xl text-black font-serif">
            Placement<span className="text-[#66003c] font-bold">Connect</span>
          </h1>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:flex flex-col md:flex-row items-center gap-4 md:gap-12 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent z-10 shadow-lg md:shadow-none`}
        >
          {user && (
            <ul className="flex flex-col md:flex-row font-medium items-center gap-2 md:gap-1 w-full md:w-auto">
              {['/', '/Jobs', '/notices', '/experience','/contact'].map((path, index) => (
                <li key={index} className="w-full md:w-auto">
                  <Link
                    to={path}
                    className={`${
                      location.pathname === path
                        ? 'border-b-2 border-blue-500 w-1/2 md:w-auto'
                        : ''
                    } block py-2 px-3 hover:border-b-2 hover:border-blue-500 transition-all text-center`}
                  >
                    {path === '/'
                      ? 'Home'
                      : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
                
              ))}
             
              {role === 'admin' && (
                <>
                  <li className="w-full md:w-auto">
                    <Link
                      to="/jobs/post"
                      className={`${
                        location.pathname === '/jobs/post'
                          ? 'border-b-2 border-blue-500 w-1/2 md:w-auto'
                          : ''
                      } block py-2 px-3 hover:border-b-2 hover:border-blue-500 transition-all`}
                    >
                      Add-Drive
                    </Link>
                  </li>
                  <li className="w-full md:w-auto">
                    <Link
                      to="/blocks"
                      className={`${
                        location.pathname === '/blocks'
                          ? 'border-b-2 border-blue-500 w-1/2 md:w-auto'
                          : ''
                      } block py-2 px-3 hover:border-b-2 hover:border-blue-500 transition-all`}
                    >
                      Block
                    </Link>
                  </li>
                  <li className="w-full md:w-auto">
                    <Link
                      to="/notice/post"
                      className={`${
                        location.pathname === '/notice/post'
                          ? 'border-b-2 border-blue-500 w-1/2 md:w-auto'
                          : ''
                      } block py-2 px-3 hover:border-b-2 hover:border-blue-500 transition-all`}
                    >
                      Add-Notice
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {/* Auth Buttons (Login/Signup or User Profile) */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#66003c] hover:bg-[#33001e] rounded text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer mx-auto">
                  <img
                    className="object-cover w-full h-full"
                    src={user.image}
                    alt="@profileImage"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-xl bg-white shadow-md">
                <div className="flex gap-2 space-y-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden mx-auto">
                    <img
                      className="object-cover w-full h-full"
                      src={user.image}
                      alt="@profileImage"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-[#4d002d]">Welcome to Placement Connect</h4>
                    <p className="text-sm text-[#33001e] font-normal">Hey {user.name}</p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Button variant="link">
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <LogOut />
                      <Button variant="link" onClick={logoutHandler}>
                        Logout
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Trash2 />
                      <Button variant="link" onClick={handleDeleteClick}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-xl p-6 w-80 text-center">
                        <p className="text-lg font-semibold mb-6 text-gray-700">
                          Are you sure you want to delete?
                        </p>
                        <div className="flex justify-between mt-4">
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                            onClick={handleConfirmDelete}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};



export default Navbar;

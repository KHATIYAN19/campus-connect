import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../LoginSignUp/axios.js';
import { BookOpen, Briefcase, LogOut, Trash2, User2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { logout } from "../redux/authSlice";
import { useDispatch } from 'react-redux';

const Navbar = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/logout');
      if (response) {
        dispatch(logout());
        toast.success("Logout Successfully");
        navigate("/login");
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-md`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 shadow-xl border-3 border-yellow-400">
                <AvatarImage
                  src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png"
                  alt="Placement Connect Logo"
                />
              </Avatar>
              <h1 className="text-xl md:text-3xl font-bold text-white font-serif tracking-tight">
                Placement<span className="text-yellow-300">Connect</span>
              </h1>
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-300"
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
                    className={`text-white hover:bg-purple-300 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                      location.pathname === path ? 'bg-purple-300 text-white font-semibold' : ''
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
                      className={`text-white hover:bg-purple-300 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/jobs/post' ? 'bg-purple-300 text-white font-semibold' : ''
                      }`}
                    >
                      Add-Drive
                    </Link>
                    <Link
                      to="/blocks"
                      className={`text-white hover:bg-purple-300 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/blocks' ? 'bg-purple-300 text-white font-semibold' : ''
                      }`}
                    >
                      Block
                    </Link>
                    <Link
                      to="/notice/post"
                      className={`text-white hover:bg-purple-300 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                        location.pathname === '/notice/post' ? 'bg-purple-300 text-white font-semibold' : ''
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
                  <Button variant="outline" className="rounded-full text-white hover:bg-purple-300 hover:text-purple-900 font-semibold border-white">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-yellow-300 hover:bg-yellow-400 rounded-full text-purple-900 font-semibold">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-1">
                    <img
                      className="object-cover w-10 h-10 shadow-xl border-3 border-yellow-400"
                      src={user.image}
                      alt={user.name}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-md border border-gray-200 bg-white shadow-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="rounded-full overflow-hidden w-12 h-12 shadow-xl border-3 border-yellow-400">
                      <img
                        className="object-cover w-full h-full"
                        src={user.image}
                        alt={user.name}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-700">Welcome, {user.name}</h4>
                      <p className="text-sm text-gray-500">Placement Connect User</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-700 rounded-md transition duration-150"
                    >
                      <User2 className="w-5 h-5 text-purple-500" />
                      View Profile
                    </Link>
                    {role === 'admin' && (
                      <>
                        <Link
                          to="/student/search"
                          className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-700 rounded-md transition duration-150"
                        >
                          <BookOpen className="w-5 h-5 text-purple-500" />
                          Student Records
                        </Link>
                        <Link
                          to="/company/search"
                          className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-700 rounded-md transition duration-150"
                        >
                          <Briefcase className="w-5 h-5 text-purple-500" />
                          Placed Students
                        </Link>
                      </>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-700 rounded-md transition duration-150 w-full text-left"
                    >
                      <LogOut className="w-5 h-5 text-purple-500" />
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
                  className={`bg-purple-100 text-purple-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                    location.pathname === path ? 'bg-purple-200 font-semibold' : ''
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
                    className={`bg-purple-100 text-purple-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/jobs/post' ? 'bg-purple-200 font-semibold' : ''
                    }`}
                  >
                    Add-Drive
                  </Link>
                  <Link
                    to="/blocks"
                    className={`bg-purple-100 text-purple-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/blocks' ? 'bg-purple-200 font-semibold' : ''
                    }`}
                  >
                    Block
                  </Link>
                  <Link
                    to="/notice/post"
                    className={`bg-purple-100 text-purple-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      location.pathname === '/notice/post' ? 'bg-purple-200 font-semibold' : ''
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
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-300 hover:text-purple-900 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-300 text-purple-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400 transition duration-300"
              >
                Signup
              </Link>
            </>
          )}
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="rounded-full overflow-hidden w-10 h-10 shadow-xl border-3 border-yellow-400">
                  <img
                    className="object-cover w-full h-full"
                    src={user.image}
                    alt={user.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.name}</div>
                  <div className="text-sm font-medium text-gray-300">User</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-300 hover:text-purple-900 transition duration-300"
                >
                  View Profile
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to="/student/search"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-300 hover:text-purple-900 transition duration-300"
                    >
                      Student Records
                    </Link>
                    <Link
                      to="/company/search"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-300 hover:text-purple-900 transition duration-300"
                    >
                      Placed Students
                    </Link>
                  </>
                )}
                <button
                  onClick={logoutHandler}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-300 hover:text-purple-900 transition duration-300 w-full text-left"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-100 hover:text-red-800 transition duration-300 w-full text-left"
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
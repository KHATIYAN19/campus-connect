import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import axios from '../LoginSignUp/axios.js';
import { logout } from "../redux/authSlice";
import {
    BookOpen, Briefcase, LogOut, Trash2, User2,
    Menu, X,
    UserPlus,
    LogIn,
    ClipboardList
} from 'lucide-react';

const NavLink = ({ to, currentPath, children, isMobile = false }) => {
    const isActive = currentPath === to;
    const baseClasses = `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out`;
    const desktopInactive = `text-gray-600 hover:text-orange-600 hover:bg-orange-50/50`;
    const desktopActive = `text-orange-700 font-semibold border-b-2 border-orange-600`;
    const mobileBase = `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-in-out`;
    const mobileInactive = `text-gray-700 hover:bg-orange-50 hover:text-orange-700`;
    const mobileActive = `bg-orange-100 text-orange-800 font-semibold`;

    const classes = isMobile
        ? `${mobileBase} ${isActive ? mobileActive : mobileInactive}`
        : `${baseClasses} ${isActive ? desktopActive : desktopInactive}`;

    return (
        <Link to={to} className={classes}>
            {children}
        </Link>
    );
};

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const role = user?.role;
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
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
        const loadingToast = toast.loading("Logging out...");
        try {
            const response = await axios.get('http://localhost:8080/logout');
            toast.dismiss(loadingToast);
            if (response) {
                dispatch(logout());
                toast.success("Logout Successfully");
                navigate("/login");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const handleDeleteClick = () => setShowDeletePopup(true);
    const handleCancelDelete = () => setShowDeletePopup(false);
    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        try {
            toast.error("Currently this functionality is blocked by admin");
            setShowDeletePopup(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete account");
            setShowDeletePopup(false);
        }
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { path: '/Jobs', label: 'Jobs' },
        { path: '/notices', label: 'Notices' },
        { path: '/experience', label: 'Experience' },
    ];

    const adminLinks = [
        { path: '/jobs/post', label: 'Add Drive' },
        { path: '/blocks', label: 'Block Users' },
        { path: '/notice/post', label: 'Add Notice' },
        { path: '/students', label: 'Students' },
    ];

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out transform ${visible ? 'translate-y-0' : '-translate-y-full'
                    } bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100`}
            >
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <Avatar className="w-9 h-9 md:w-10 md:h-10 shadow-sm border border-orange-100">
                                    <AvatarImage
                                        src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png"
                                        alt="Placement Connect Logo"
                                    />
                                </Avatar>
                                <h1 className="text-lg md:text-xl font-bold text-orange-700 font-serif tracking-tight">
                                    Placement<span className="text-orange-500">Connect</span>
                                </h1>
                            </Link>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 p-1 rounded-md"
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>

                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            {navLinks.map(link => (
                                <NavLink key={link.path} to={link.path} currentPath={location.pathname}>
                                    {link.label}
                                </NavLink>
                            ))}
                            {user && role === 'student' && (
                                <>
                                    <NavLink to="/mocks" currentPath={location.pathname}>Mocks</NavLink>
                                    <NavLink to="/interviews" currentPath={location.pathname}>Interviews</NavLink>
                                    <NavLink to="/contact" currentPath={location.pathname}>Contact</NavLink>
                                    <NavLink to="/discuss" currentPath={location.pathname}>Discuss</NavLink>
                                </>
                            )}
                            {user && role === 'admin' && adminLinks.map(link => (
                                <NavLink key={link.path} to={link.path} currentPath={location.pathname}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1 text-gray-600 hover:text-orange-600 py-2 px-3 rounded-full text-sm font-medium transition duration-300 hover:bg-orange-50/50"
                                    >
                                        <LogIn size={16} /> Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center gap-1 bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-orange-700 transition duration-300 shadow-sm"
                                    >
                                        <UserPlus size={16} /> Signup
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="hidden lg:block text-sm text-gray-700 font-medium">{user.name}</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1">
                                                <Avatar className="w-9 h-9 shadow-sm border-2 border-orange-200 hover:border-orange-400 transition">
                                                    <AvatarImage
                                                        src={user.image || undefined}
                                                        alt={user.name || 'User'}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'; }}
                                                    />
                                                </Avatar>
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-60 rounded-lg border border-gray-100 bg-white shadow-lg p-2 z-[60]">
                                            <div className="mt-1 space-y-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition duration-150"
                                                >
                                                    <User2 className="w-4 h-4 text-orange-500" />
                                                    View Profile
                                                </Link>
                                                {role === 'student' && (
                                                    <Link
                                                        to="/mymocks"
                                                        className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition duration-150"
                                                    >
                                                        <ClipboardList className="w-4 h-4 text-orange-500" />
                                                        My Mocks
                                                    </Link>
                                                )}
                                                {role === 'admin' && (
                                                    <>
                                                        <Link to="/student/search" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition duration-150">
                                                            <BookOpen className="w-4 h-4 text-orange-500" />
                                                            Student Records
                                                        </Link>
                                                        <Link to="/company/search" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition duration-150">
                                                            <Briefcase className="w-4 h-4 text-orange-500" />
                                                            Placed Students
                                                        </Link>
                                                    </>
                                                )}
                                                <hr className="my-1 border-gray-100" />
                                                <button
                                                    onClick={logoutHandler}
                                                    className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-md transition duration-150 w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4 text-orange-500" />
                                                    Logout
                                                </button>
                                                <button
                                                    onClick={handleDeleteClick}
                                                    className="flex items-center gap-2 py-2 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition duration-150 w-full text-left"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                    Delete Account
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-100 bg-white shadow-md`} id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <NavLink key={link.path} to={link.path} currentPath={location.pathname} isMobile={true}>
                                {link.label}
                            </NavLink>
                        ))}
                        {user && role === 'student' && (
                            <>
                                <NavLink to="/mocks" currentPath={location.pathname} isMobile={true}>Mocks</NavLink>
                                <NavLink to="/interviews" currentPath={location.pathname} isMobile={true}>Interviews</NavLink>
                                <NavLink to="/contact" currentPath={location.pathname} isMobile={true}>Contact</NavLink>
                                <NavLink to="/discuss" currentPath={location.pathname} isMobile={true}>Discuss</NavLink>
                            </>
                        )}
                        {user && role === 'admin' && adminLinks.map(link => (
                            <NavLink key={link.path} to={link.path} currentPath={location.pathname} isMobile={true}>
                                {link.label}
                            </NavLink>
                        ))}

                        {!user ? (
                            <div className="mt-3 space-y-2 px-1">
                                <Link
                                    to="/login"
                                    className="block w-full text-center bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block w-full text-center bg-orange-600 text-white hover:bg-orange-700 px-3 py-2 rounded-md text-base font-medium transition duration-300"
                                >
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-4 pb-3 border-t border-gray-200 mt-3">
                                <div className="flex items-center px-2">
                                    <div className="flex-shrink-0">
                                        <Avatar className="w-10 h-10 shadow-sm border border-orange-200">
                                            <AvatarImage
                                                src={user.image || undefined}
                                                alt={user.name || 'User'}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'; }}
                                            />
                                        </Avatar>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <NavLink to="/profile" currentPath={location.pathname} isMobile={true}>
                                        View Profile
                                    </NavLink>
                                    {role === 'student' && (
                                        <NavLink to="/mymocks" currentPath={location.pathname} isMobile={true}>
                                            My Mocks
                                        </NavLink>
                                    )}
                                    {role === 'admin' && (
                                        <>
                                            <NavLink to="/student/search" currentPath={location.pathname} isMobile={true}>
                                                Student Records
                                            </NavLink>
                                            <NavLink to="/company/search" currentPath={location.pathname} isMobile={true}>
                                                Placed Students
                                            </NavLink>
                                        </>
                                    )}
                                    <button
                                        onClick={logoutHandler}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition duration-150"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 transition-opacity z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl mx-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you absolutely sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 font-medium text-sm"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 font-medium text-sm flex items-center gap-1"
                                onClick={handleConfirmDelete}
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-16">
            </div>
        </>
    );
};
export default Navbar;
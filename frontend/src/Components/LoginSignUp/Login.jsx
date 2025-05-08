import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js'; 

import toast, { Toaster } from 'react-hot-toast'; 
import { Button } from '../ui/button';
import { z } from 'zod';
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { Mail, Lock, Loader2 } from 'lucide-react'; // Added Lucide icons

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setIsSubmitting(true); // Start loading
    const loadingToast = toast.loading("Logging in..."); // Add loading toast

    try {
      loginSchema.parse({ email, password }); // Validate input
      const response = await axios.post('http://localhost:8080/login', { email, password });
      toast.dismiss(loadingToast); // Dismiss loading toast

      const logind = response.data.success;
      if (logind) {
        const { token, user } = response.data;
        dispatch(login({ token, user }));
        // Use react-hot-toast
        toast.success('WELCOME BACK ' + (response.data.user?.name?.toUpperCase() || 'User'));
        navigate('/'); // Navigate to home or dashboard
      } else {
        // Use react-hot-toast
        toast.error(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.dismiss(loadingToast); // Dismiss loading toast
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, curr) => {
          // Use optional chaining for path
          if (curr.path?.[0]) {
            acc[curr.path[0]] = curr.message;
          }
          return acc;
        }, {});
        setErrors(formattedErrors);
        // Optionally show a generic form error toast
        // toast.error("Please check the form for errors.");
      } else {
        // Use react-hot-toast
        toast.error(error.response?.data?.message || 'An error occurred during login.');
        console.error("Login error:", error); // Keep console log for debugging
      }
    } finally {
        setIsSubmitting(false); // Stop loading
    }
  };

  // Input change handlers to clear specific errors on edit
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
        setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
     if (errors.password) {
        setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
     }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-100 p-4 sm:p-6 font-sans">
        {/* Add Toaster component */}
       <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center text-3xl font-bold text-orange-600 mb-8 tracking-tight">LOGIN</div>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
             <label htmlFor="email-login" className="sr-only">Email</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-login"
                  type="email" // Use type="email" for better validation/mobile experience
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition duration-200`}
                  aria-invalid={!!errors.email} // Accessibility
                  disabled={isSubmitting} // Disable during submit
                />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 px-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password-login" className="sr-only">Password</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password-login"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition duration-200`}
                  aria-invalid={!!errors.password} // Accessibility
                  disabled={isSubmitting} // Disable during submit
                />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 px-1">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-800 transition duration-200">
            <NavLink to="/reset-password">Forgot Password?</NavLink>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit" // Ensure button type is submit
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base rounded-lg py-3 font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
              disabled={isSubmitting} // Disable button when submitting
            >
               {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : null}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?
          <span
            className="text-orange-600 pl-1.5 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate('/signup')} // Use navigate for consistency
          >
            Signup Now
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import './LoginSignUp.css';
import { useNavigate } from 'react-router-dom';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const ResetPasswordToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Zod schema for validation
  const schema = z
    .object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
      confirmPassword: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const ResetHandler = async (e) => {
    e.preventDefault();

    // Validate inputs
    const formData = { email, password, confirmPassword };
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      // Map errors to their respective fields
      const fieldErrors = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(fieldErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes

    try {
      const response = await axios.post(`http://localhost:8080/reset-password/${token}`, {
        email,
        password,
        confirmPassword,
      });
      console.log(response.data);
      const success = response.data.success;
      if (success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-2 sm:px-6 lg:px-8">
      <form
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md space-y-6"
        onSubmit={ResetHandler}
      >
        <div className="mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#80004c]">
            Reset Password
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center border rounded-xl overflow-hidden">
            <img
              src={email_icon}
              alt="Email Icon"
              className="p-3 w-10 sm:w-12 h-10 sm:h-12"
            />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 outline-none text-gray-700"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center border rounded-xl overflow-hidden">
            <img
              src={password_icon}
              alt="Password Icon"
              className="p-3 w-10 sm:w-12 h-10 sm:h-12"
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 outline-none text-gray-700"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center border rounded-xl overflow-hidden">
            <img
              src={password_icon}
              alt="Confirm Password Icon"
              className="p-3 w-10 sm:w-12 h-10 sm:h-12"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 outline-none text-gray-700"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center space-y-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#80004c] to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            Submit
          </button>
          <NavLink
            to="/login"
            className="text-[#80004c] hover:underline font-medium"
          >
            Back to Login
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordToken;

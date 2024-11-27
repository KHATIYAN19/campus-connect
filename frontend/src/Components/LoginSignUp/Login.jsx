import React, { useState } from 'react';
import './LoginSignUp.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { z } from 'zod';

// Zod validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs using Zod
    try {
      loginSchema.parse({ email, password });

      // If validation passes, make the API request
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });

      const login = response.data.success;
      if (login) {
        localStorage.setItem('isLogin', true);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        toast.success('WELCOME BACK ' + response.data.user.name.toUpperCase());
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center text-2xl font-semibold text-gray-800 mb-6">LOGIN</div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <div className="flex items-center border-b-2 border-gray-300">
              <img src={email_icon} alt="email_icon" className="w-6 h-6 mr-2" />
              <input
                type="text"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-none focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <div className="flex items-center border-b-2 border-gray-300">
              <img src={password_icon} alt="password_icon" className="w-6 h-6 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-none focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-2">{errors.password}</p>}
          </div>

          <div className="text-left text-sm font-medium text-yellow-800 mt-2">
            <NavLink to="/reset-password">Forgot Password?</NavLink>
          </div>

          <div className="flex justify-center items-center mt-6">
            <Button className="w-full bg-yellow-600 text-lg rounded-xl py-3 text-white font-bold hover:bg-yellow-500 focus:outline-none">
              Submit
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          Don't have an account?
          <span
            className="text-yellow-800 pl-4 cursor-pointer font-semibold hover:text-yellow-600"
            onClick={() => navigate('/signup')}
          >
            Signup
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

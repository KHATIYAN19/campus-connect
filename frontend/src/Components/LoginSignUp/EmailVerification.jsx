// EmailVerification.jsx (Frontend)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const location = useLocation(); // Get query parameters (token)
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null); // To store verification status
  const [error, setError] = useState(null); // To store error message

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyEmail(token);
    } else {
      setError('Token is missing');
    }
  }, [location.search]);

  // Function to verify email using the token
  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`http://localhost:8080/verify-email?token=${token}`);
      if (response.status === 200) {
        setIsVerified(true);
      }
    } catch (error) {
      setError('Invalid or expired token');
    }
  };

  const goToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {isVerified === null && <p className="text-lg text-gray-700">Verifying your email...</p>}

        {isVerified && (
          <div>
            <h1 className="text-2xl font-semibold text-green-500">Email Verified Successfully!</h1>
            <p className="mt-2 text-gray-600">Your email has been verified. You can now log in.</p>
            <button
              onClick={goToLogin}
              className="mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Go to Login
            </button>
          </div>
        )}

        {error && (
          <div>
            <h1 className="text-2xl font-semibold text-red-500">Verification Failed</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={goToLogin}
              className="mt-4 py-2 px-6 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

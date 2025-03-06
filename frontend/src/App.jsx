import React, { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './Components/LoginSignUp/Login.jsx';
import SignupStudent from './Components/LoginSignUp/SignupStudent.jsx';
import SignupAdmin from './Components/LoginSignUp/SignupAdmin.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
import JobPost from './Components/LoginSignUp/JobPost.jsx';
import Navbar from './Components/shared/Navbar.jsx';
import Jobs from './Components/Homepage/Jobs.jsx';
import ResetPassword from './Components/LoginSignUp/ResetPassword.jsx';
import AppliedJobs from './Components/Homepage/AppliedJobTable.jsx';
import Profile from './Components/Homepage/Profile.jsx';
import JobDescription from './Components/Homepage/JobDescription.jsx';
import ProtectedRoute from './protectedRoutes/ProtectedRoute.jsx';
import EmailVerification from './Components/LoginSignUp/EmailVerification.jsx';
import Blocked from './Components/pages/blocked.jsx';
import Messages from './Components/pages/messages.jsx';
import MessageBox from './Components/pages/MessageBox.jsx';
import JobApplicantsTable from './Components/Homepage/JobApplicantsTable.jsx';
import UserProfile from './Components/pages/UserProfile.jsx';
import Footer from './Components/pages/Footer.jsx';
import JobTable from './Components/pages/JobTable.jsx';
import InterviewExperiences from './Components/pages/InterviewExperiences.jsx';
import AdminProtectedRoute from './protectedRoutes/AdminProtectedRoute.jsx';

import ContactForm from './Components/pages/ContactForm.jsx';
import Main from './Components/pages/Main.jsx';
import ResetPasswordToken from './Components/LoginSignUp/ResetPasswordToken.jsx';

import ContactForms from './Components/Homepage/ContactForms.jsx';

function App() {
  const [admin, setAdmin] = useState(false);
  const isLogin = localStorage.getItem('isLogin'); // Check login status
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  // Check if the current path is '/main', so we can hide the Navbar
  const hideNavbar = location.pathname === '/main';

  return (
    <div className="font-serif" data-theme={theme}>
      {/* Conditionally render Navbar based on current route */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Redirect logged-out users to main page */}
        <Route
          path="/"
          element={isLogin ? <Navigate to="/homepage" replace /> : <Navigate to="/main" replace />}
        />

        {/* Main page */}
        <Route
          path="/main"
          element={
            isLogin ? (
              <Navigate to="/homepage" replace />
            ) : (
              <Main />
            )
          }
        />

        <Route path='/form' element={<ContactForms/>}/>
        <Route path='/verify-email' element={<EmailVerification />} />
        {/* Login and Signup Routes */}
        <Route path='/reset-password/:token' element={<ResetPasswordToken />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/login" element={isLogin ? <Homepage /> : <Login />} />
        <Route
          path="/signup"
          element={
            isLogin ? (
              <Homepage />
            ) : admin ? (
              <SignupAdmin setAdmin={setAdmin} />
            ) : (
              <SignupStudent setAdmin={setAdmin} />
            )
          }
        />

        {/* Protected routes for authenticated users */}
        <Route
          path="/applied-jobs"
          element={<ProtectedRoute element={<AppliedJobs />} />}
        />
        <Route
          path="/jobs"
          element={<ProtectedRoute element={<Jobs />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/description/:id"
          element={<ProtectedRoute element={<JobDescription />} />}
        />
        <Route
          path="/notices"
          element={<ProtectedRoute element={<Messages show={true} />} />}
        />
        <Route
          path="/user/profile/:id"
          element={<ProtectedRoute element={<UserProfile />} />}
        />
        <Route
          path="/experience"
          element={<ProtectedRoute element={<InterviewExperiences show={true} />} />}
        />

        {/* Admin-protected routes */}
        <Route
          path="/jobs/post"
          element={<AdminProtectedRoute element={<JobPost />} />}
        />
        <Route
          path="/blocks"
          element={<AdminProtectedRoute element={<Blocked />} />}
        />
        <Route
          path="/notice/post"
          element={<AdminProtectedRoute element={<MessageBox />} />}
        />
        <Route path="/footer" element={< Footer />} />
        <Route path="/contact" element={<ContactForm />} />
        
        <Route path="/homepage" element={<ProtectedRoute element={<Homepage />} />} />
      </Routes>
    </div>
  );
}

export default App;

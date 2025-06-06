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
import CompanySearch from './Components/pages/CompanySearch.jsx';
import StudentSearch from './Components/pages/StudentSearch.jsx';
import PostDetailPage from './Components/pages/PostDetailPage.jsx';
import ContactForms from './Components/Homepage/ContactForms.jsx';

import PlacementRecord from './Components/pages/PlacementRecord.jsx'
import UserUpdate from './Components/pages/UserUpdate.jsx';
import NotFoundPage from './Components/pages/NotFound.jsx';
import Community from './Components/pages/Community.jsx';
import { useSelector } from 'react-redux';
import UpdateAdmin from './Components/Homepage/UpdateAdmin.jsx';
import Student from './Components/pages/Student.jsx';
import { MyMocks } from './Components/pages/MyMocks.jsx';
import AllMocks from './Components/pages/MockInterview.jsx';
function App() {
  const isLogin  = useSelector((state) => state.auth.isAuthenticated);
  const user=useSelector((state)=>state.auth.user);
  const [admin, setAdmin] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const hideNavbar = location.pathname === '/main';
  return (
    <div className="font-serif" data-theme={theme}>
      {!hideNavbar && <Navbar />}
       <div className=''> 
       <Routes>
        <Route
          path="/"
          element={isLogin ? <Navigate to="/homepage" replace /> : <Navigate to="/homepage" replace />}
        />
        <Route
          path="/main"
          element={
            isLogin ? (
              <Navigate to="/homepage" replace />
            ) : (
              <Navigate to="/homepage" replace />

            )
          }
        />
        <Route path='/mymocks' element={<MyMocks/>}/>
        <Route path='/mocks' element={<AllMocks />} />
        <Route path='/form' element={<ContactForms/>}/>
        <Route path='/verify-email' element={<EmailVerification />} />
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
        
        <Route path="/homepage" element={ <Homepage/>} />

        <Route path="/company/search/" element={<CompanySearch/>}/>
        <Route path="/student/search/" element={<StudentSearch/>}/>
        <Route path="/discuss"  element={<Community/>}/>
        <Route path='/placement-stats' element={<PlacementRecord/>}/>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/post/description/:postId" element={<PostDetailPage />} />
         <Route path="/update/user" element={<UserUpdate></UserUpdate>}/>
         <Route path="/students" element={<Student/>}/>
      </Routes>
       </div>
     
    </div>
  );
}

export default App;

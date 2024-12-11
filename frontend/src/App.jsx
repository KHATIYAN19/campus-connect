import React, { useState } from 'react';
import Login from './Components/LoginSignUp/Login.jsx';
import SignupStudent from './Components/LoginSignUp/SignupStudent.jsx';
import SignupAdmin from './Components/LoginSignUp/SignupAdmin.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
import JobPost from './Components/LoginSignUp/JobPost.jsx';
import Navbar from './Components/shared/Navbar.jsx';
import Jobs from './Components/Homepage/Jobs.jsx';
import { Route,Routes } from 'react-router-dom';
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
import ThemeOptions from './Components/shared/ThemeOptions.jsx';
function App() {
  const[admin,setAdmin]=useState(false);
  const isLogin = localStorage.getItem('isLogin');


  const [theme, setTheme] = useState('light'); 
    return (    
         <div className='font-serif'  data-theme={theme}>
           <Navbar></Navbar>
        <Routes>

        <Route path="/login" element={isLogin?(<Homepage/>):(<Login/>)}/><Route/>
        <Route path='/signup' element={isLogin?(<Homepage/>):(admin?(<SignupAdmin setAdmin={setAdmin}/>):(<SignupStudent setAdmin={setAdmin}/>))}></Route>
        
     
          <Route path="/verify-email" element={<EmailVerification/>} />
          <Route path="/reset-password" element={<ResetPassword/>}/>
          
           <Route path="/" element={<Homepage />} />
        
           <Route path="/themes" element={<ThemeOptions setTheme={setTheme} />} />

        <Route
          path="/applied-jobs"
          element={<ProtectedRoute element={<AppliedJobs />} />}
        />
        <Route
          path="/navbar"
          element={<ProtectedRoute element={<Navbar />} />}
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
          path="/footer"
          element={<ProtectedRoute element={<Footer />} />}
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
     
          

          <Route path="/applicantTable" element={<JobApplicantsTable/>}/>
          <Route path="/jobtable" element={<JobTable/>}/>
         
       </Routes>    
       </div>
    );
}

export default App;

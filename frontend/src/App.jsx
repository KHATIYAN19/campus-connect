import React, { useState } from 'react';
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
import JobPost from './Components/LoginSignUp/JobPost.jsx';
import Navbar from './Components/shared/Navbar.jsx';
import Jobs from './Components/Homepage/Jobs.jsx';
import { Route,Routes } from 'react-router-dom';
import ResetPassword from './Components/LoginSignUp/ResetPassword.jsx';
import AppliedJobs from './Components/Homepage/AppliedJobTable.jsx';
import Profile from './Components/Homepage/Profile.jsx';
import JobDescription from './Components/Homepage/JobDescription.jsx';



function App() {
    return (
        <Routes>
         <Route path="/" element={<Homepage/>}/>
        
         <Route path="/signup" element={<Signup/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/reset-password" element={<ResetPassword/>}/>
         <Route path="/jobs/post" element={<JobPost/>}/>
         <Route path="/navbar" element={<Navbar/>}/>
         <Route path="/jobs" element={<Jobs/>}/>

         <Route path="/" element={<AppliedJobs/>}/>
         <Route path="/profile" element={<Profile/>}/>
         <Route path="/description/:id" element={<JobDescription/>}/>
       </Routes>   
    );
}

export default App;

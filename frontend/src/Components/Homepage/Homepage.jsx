import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import MessageComponent from '../pages/MessageComponent';
import InterviewExperiences from '../pages/InterviewExperiences';
import Messages from '../pages/Messages';
const Homepage = () => {

  return (
    <div>
      <JobCard />
      {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      </div>
      </div>
     </div> */}
     <div> 
      <InterviewExperiences show={false}/>
     </div>
     <div>
       <h2 className=' text-center text-green-500  bg-gray-100 text-3xl'>Latest Notice</h2>
       <Messages show={false}/>
     </div>
     </div>
     
  );
};

export default Homepage;

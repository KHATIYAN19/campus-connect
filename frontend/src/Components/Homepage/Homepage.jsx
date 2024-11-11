import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';


const Homepage = () => {

  return (
    <div>
      <Navbar />
      <JobCard />
    </div>
  );
};

export default Homepage;

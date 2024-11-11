import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import Jobs from './Jobs';


const Homepage = () => {

  return (
    <div>
      <Navbar />
      <JobCard />
      <Jobs />
    </div>
  );
};

export default Homepage;

import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
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

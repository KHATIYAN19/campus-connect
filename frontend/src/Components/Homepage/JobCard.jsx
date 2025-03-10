import React from 'react'
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import LatestJobs from './LatestJobs';
import axios from "../LoginSignUp/axios.js"



const JobCard = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/jobs/getall").then((res) => {
      setJobs(res.data.Jobs);
    })
  }, []);
  return (
    <div className="max-w-7xl mx-auto my-28 px-10">
      <h1 className="text-4xl font-bold text-center text-pink-950 mb-10">Latest Jobs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.slice(0, 6).map((item, idx) => (
          <div key={idx} className="bg-[#ffe6ee] shadow-lg rounded-2xl p-6 flex flex-col h-full">
            {/* Rendering the LatestJobs component directly with the job data */}
            <LatestJobs data={item} />
          </div>
        ))}
      </div>

    </div>


  );

}

export default JobCard;
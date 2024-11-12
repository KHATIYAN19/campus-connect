import React from 'react'
import { Button } from '../ui/button';
import { useState ,useEffect} from 'react';
import LatestJobs from './LatestJobs';
import axios from "../LoginSignUp/axios.js"
  


const JobCard = () => {
    const[jobs,setJobs]=useState([]);
    useEffect(()=>{
     axios.get("http://localhost:8080/jobs/getall").then((res)=>{
      setJobs(res.data.Jobs);
     })
    },[]);
    return (
        <div className='mx-w-7xl mx-auto my-28 px-10'>
            <h1 className='text-3xl font-bold text-center'>Latest Jobs</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                {
                     jobs.slice(0,6).map((item, idx) => <LatestJobs key={idx} data={item} />) 
                }
            </div>
        </div>
    )
}

export default JobCard;
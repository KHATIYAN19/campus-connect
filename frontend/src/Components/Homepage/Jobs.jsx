import React from 'react'
import JobDetails from './JobDetails';
import { useState ,useEffect} from 'react';
import axios from "../LoginSignUp/axios.js"
  
const jobArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {

    const[jobArray,setJobArray]=useState([]);
    useEffect(()=>{
     axios.get("http://localhost:8080/jobs/getall").then((res)=>{
        setJobArray(res.data.Jobs);
     })
    },[]);
    return (
        <div>
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    {
                        jobArray.length <= 0 ? <span>Job not available</span> : (
                            <div className='flex-1 h-[88vh]  overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {jobArray.map((item, idx) => (
                                        <div>
                                            <JobDetails data={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs;
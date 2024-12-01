import React, { useState, useEffect } from 'react';
import JobDetails from './JobDetails';
import axios from "../LoginSignUp/axios.js"

const Jobs = () => {
    const [jobArray, setJobArray] = useState([]);
    
    useEffect(() => {
        axios.get("http://localhost:8080/jobs/getall").then((res) => {
            setJobArray(res.data.Jobs);
            console.log(res.data.Jobs);
        })
    }, []);
    
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Available Job Opportunities</h1>
                    <p className="text-lg text-gray-600">Find your dream job here. Apply now!</p>
                </div>
                
                <div className="flex gap-6 justify-between">
                    {
                        jobArray.length <= 0 ? (
                            <span className="text-xl text-gray-600">No jobs available at the moment. Please check back later.</span>
                        ) : (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobArray.map((item, idx) => (
                                    <div key={idx} className="transition-all transform hover:scale-105 duration-300">
                                        <JobDetails data={item} />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs;

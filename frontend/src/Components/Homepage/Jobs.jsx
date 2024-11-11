import React from 'react'
import Navbar from '../shared/Navbar';
import JobDetails from './JobDetails';

const jobArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-8'>
                <div className='flex gap-5'>
                    {
                        jobArray.length <= 0 ? <span>Job not available</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {jobArray.map((item, idx) => (
                                        <div>
                                            <JobDetails />
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
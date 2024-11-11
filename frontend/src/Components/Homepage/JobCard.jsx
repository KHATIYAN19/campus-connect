import React from 'react'
import { Button } from '../ui/button';
import LatestJobs from './LatestJobs';

const jobs = [1,2,3,4,5,6,7,8,9];

const JobCard = () => {
    return (
        <div className='mx-w-7xl mx-auto my-28 px-10'>
            <h1 className='text-3xl font-bold text-center'>Latest Jobs</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                {
                    jobs.slice(0,6).map((item, idx) => <LatestJobs key={idx}/>)
                }
            </div>
        </div>
    )
}

export default JobCard;
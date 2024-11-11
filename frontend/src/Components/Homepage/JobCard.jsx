import React from 'react'
import { Button } from '../ui/button';
import LatestJobs from './LatestJobs';

const jobs = [1,2,3,4,5,6,7,8,9];

const JobCard = () => {
    return (
        <div className='mx-w-7xl mx-auto my-28'>
            <h1 className='text-4xl font-bold'>Job Opening</h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    jobs.slice(0,6).map((item, idx) => <LatestJobs/>)
                }
            </div>
        </div>
    )
}

export default JobCard;
import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const JobDescription = () => {
    const isApplied = true;
    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>Title</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>12 Positions</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>Intership</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>24Lpa</Badge>
                    </div>
                </div>
                <Button disabled={isApplied} className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed rounded-xl' : 'bg-yellow-700 rounded-xl hover:bg-yellow-800'}`}>{isApplied ? 'Already Applied' : 'Apply'}</Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description </h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>Frontend Developer</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>Bangalore</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, nobis!</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>0-2 years</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>24LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>6</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>12-11-2024</span></h1>
            </div>
        </div>
    )
}

export default JobDescription
import React from 'react'
import { Badge } from '../ui/badge'
import { NavLink } from 'react-router-dom';
const LatestJobs = ({data}) => {
 
  const user=JSON.parse(localStorage.getItem('user'));
  return (
     
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
        <NavLink to={`/description/${data._id}`}>
          <div>
        <h1 className='font-medium text-lg'>{data.company}</h1>
        <p className='text-sm text-gray-500'>India</p>
        <img src={data.logo} alt="" />
        </div>
        <div>
            <h1 className='font-bold text-lg my-2'>{data.position}</h1>
            <p className='text-sm text-gray-600'>{data.description.length>100?data.description.substring(0,100):data.description}</p>
        </div>
        <div className='flex items-center gap-2 mt-4'>
            <Badge className="text-yellow-600 font-bold" variant='ghost'> {data.numbers} Positions</Badge>
            <Badge className="text-yellow-600 font-bold" variant='ghost'>{data.position}</Badge>
            <Badge className="text-yellow-600 font-bold" variant='ghost'>{data.salary}</Badge>
        </div>
        </NavLink>
    </div> 
  )
}

export default LatestJobs
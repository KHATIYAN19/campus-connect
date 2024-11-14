import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "../LoginSignUp/axios.js"
import {mongoose} from "mongoose"
import { toast } from 'react-toastify'
const JobDetails = ({data}) => {
    const applied=JSON.parse(localStorage.getItem('user')).Applied;
    const[isApplied,setIsApplied]=useState(applied.includes(data._id));
    const role=localStorage.getItem('role');
    const id=data._id;
    
    const applyHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/jobs/apply/${id}`);
            const posted=response.data.success;
            if(posted){
                 toast.success("Applied Successfully");
                 setIsApplied(true);
                 navigate("/Jobs");
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }
    const navigate = useNavigate();
    const jobId = "abcdefgh";
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>2 days ago</p>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant='outline' size='icon'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='text-lg font-medium'>{data.company}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>
            <div className=''>
                <h1 className='font-bold text-lg my-2'>{data.position}</h1>
                <p className='text-sm text-gray-600'>{data.description.length>80?data.description.substring(0,50):data.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 '>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>{data.numbers}Positions</Badge>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>Intership</Badge>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>{data.salary}</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${data._id}`)} variant="outline" className='rounded-full'>Details</Button>
                {/* {
                  role==='student'? (<Button className='bg-yellow-600 rounded-3xl ' onClick={applyHandler} >Apply</Button>):(<div/>)
                } */}
                {
                 role==='student'? (<Button disabled={isApplied} onClick={applyHandler} className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed rounded-xl' : 'bg-yellow-700 rounded-xl hover:bg-yellow-800'}`}>{isApplied ? 'Applied' : 'Apply'}</Button>):(<></>)
                }   
                {/* {
                    isApplied?(<>true</>):(<>false</>)
                } */}
            
            </div>
        </div>
    )
}

export default JobDetails
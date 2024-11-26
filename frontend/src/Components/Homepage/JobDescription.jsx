import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../LoginSignUp/axios.js'
const JobDescription = () => {
    const [applied,setApplied]=useState('');
    const { id } = useParams();
    const [job, setJob] = useState('');
    const[isallow,setIsallow]=useState(true);
    const user=JSON.parse(localStorage.getItem('user'));
    const isAdmin=JSON.parse(localStorage.getItem('user')).role;
    const fetchApplications= async () => {
        console.log(user);
        try {
            const response = await axios.get(`http://localhost:8080/findapplication_id`);
            setApplied(response.data.applied);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    }; 
    // let isallow=false;
    const findAllow=()=>{
        console.log(job.tenth, "  ",user.profile.tenth)
        console.log(job.tweleth,"  ",user.profile.tweleth)
        console.log(job.graduationMarks," ",user.profile.graduationMarks)
           if(job.tenth<=user.profile.tenth&&job.tweleth<=user.profile.tweleth&&job.graduationMarks<=user.profile.graduationMarks){
               console.log("true");
                setIsallow(true);
           }
    }
    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/${id}`);
            setJob(response.data.job);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    
    useEffect(() => {
        fetchJobDetails();
        fetchApplications();
    }, []);
    useEffect(()=>{
        findAllow();
    })
    const Applied=applied.includes(job._id);
    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{job.company}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>{job.posi}</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>Intership</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>24Lpa</Badge>
                    </div>
                </div>
                {
                    isAdmin==='admin'?(<></>):(isallow?(Applied?(<Button  className='bg-gray-900 text-white rounded-xl '  disabled>Already Applied</Button>):(<Button className='bg-yellow-700 rounded-xl hover:bg-yellow-800'>Apply Now</Button>)):(<Button className='bg-slate-900 text-white rounded-xl ' disabled>Not Allow</Button>))
                }
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description </h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>Frontend Developer</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>Bangalore</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, nobis!</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>0-2 years</span></h1>
                <h1 className='font-bold my-1'>Batch: <span className='pl-4 font-normal text-gray-800'>2025</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>24LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>6</span></h1>
                <h1 className='font-bold my-1'>10+2 Percentage: <span className='pl-4 font-normal text-gray-800'>Above 60%</span></h1>
                <h1 className='font-bold my-1'>Graduation Percentage: <span className='pl-4 font-normal text-gray-800'>Above 70%</span></h1>
            </div>
        </div>
    )
}

export default JobDescription
import React from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { useState,useEffect } from 'react'
const haveResume = true;
import axios from '../LoginSignUp/axios.js'
import App from '@/App'
import { Button } from '../ui/button'
import UpdateStudent from './UpdateStudent'
import UpdateAdmin from './UpdateAdmin'
import JobTable from '../pages/JobTable'

const Profile = () => {
    const role=localStorage.getItem('role');
    const[profile,SetProfile]=useState([]);
    const [data,setData]=useState([]);
    const [adminData,setAdminData]=useState([]);
     useEffect(()=>{
       axios.get("http://localhost:8080/profile").then((res)=>{
       SetProfile(res.data.user);
       setData(res.data.data);
     })
    },[]);

        useEffect(()=>{
            axios.get("http://localhost:8080/jobs/get/myjobs").then((res)=>{
                setAdminData(res.data.jobs);
                console.log(res.data.jobs)
        })}
        ,[]);
    const [open, setOpen] = useState(false);
    return (
        <div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className='h-24 w-24'>
                            <AvatarImage src={profile.image} />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{profile.name}</h1>
                            <p>GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT</p>
                            {role==='student'?(<p>Student</p>):(<p>Admin</p>)}
                        </div>
                    </div>
                    <Button onClick={()=>setOpen(true)} className='text-right' variant='outline'><Pen/> </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{profile.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{profile.phone}</span>
                    </div>
                </div>
                { role === 'student' ? (<div className='flex w-full max-w-sm items-center gap-1.5'>
                    <Label className='text-md font-bold'>Resume:-</Label>
                    {
                        true ? <a href={profile.resume} target='_blank' className='text-blue-500 text-md font-bold w-full hover:underline cursor-pointer'>xyz</a> : <span>NA</span>
                    }
                </div>) : (<div></div>)}
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2x'>
                {role==='student'?(<h1 className='font-bold text-lg my-5'>Applied Jobs</h1>):(<h1 className='font-bold text-lg my-5'>Posted Jobs</h1>)}
                {role=='student'?(<JobTable admin={false} jobData={data}/>):(<JobTable admin={true} jobData={adminData}/>)}
            </div>
           
            <UpdateAdmin open={role === 'admin' && open} setOpen={setOpen} />
            {<UpdateStudent open={role === 'student' && open} setOpen={setOpen} />}
        </div>
    )
}
export default Profile;
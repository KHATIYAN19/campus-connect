import React from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import AppliedJobTable from './AppliedJobTable'
import { useState,useEffect } from 'react'
const skills = ["Html", "Css", "Python", "reactjs"];
const haveResume = true;
import axios from '../LoginSignUp/axios.js'
import App from '@/App'
const Profile = () => {
    const role=localStorage.getItem('role');
    const[profile,SetProfile]=useState([]);
    const [data,setData]=useState([]);
     useEffect(()=>{
       axios.get("http://localhost:8080/profile").then((res)=>{
       SetProfile(res.data.user);
       setData(res.data.data);
     })
    },[]);
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
                <div className='my-5'>
                   {
                    role==='student'?( <div><h1>Skills</h1>
                        <div className='flex items-center gap-1'>
                            {
                                skills.length !== 0 ? skills.map((item, idx) => <Badge className='bg-black text-white hover:text-black' key={idx}>{item}</Badge>) : <span>NA</span>
                            }
                        </div></div>):(<div></div>)
                   }
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className='text-md font-bold'>Resume</Label>
                    {
                        haveResume ? <a href="https:www.google.com" target='_blank' className='text-blue-500 w-full hover:underline cursor-pointer'>xyz</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2x'>
                {role==='student'?(<h1 className='font-bold text-lg my-5'>Applied Jobs</h1>):(<h1 className='font-bold text-lg my-5'>Posted Jobs</h1>)}
                {role=='student'?(<AppliedJobTable data={data}/>):(<></>)}
            </div>
        </div>
    )
}
export default Profile
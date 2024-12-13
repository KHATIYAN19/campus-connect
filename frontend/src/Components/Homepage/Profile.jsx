import React from 'react'
import Navbar from '../shared/Navbar'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { useState, useEffect } from 'react'
import axios from '../LoginSignUp/axios.js'
import App from '@/App'
import { Button } from '../ui/button'
import UpdateStudent from './UpdateStudent'
import UpdateAdmin from './UpdateAdmin'
import JobTable from '../pages/JobTable'

const Profile = () => {
    const role = localStorage.getItem('role');
    const [profile, SetProfile] = useState([]);
    const [data, setData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8080/profile").then((res) => {
            SetProfile(res.data.user);
            setData(res.data.data);
        })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/jobs/get/myjobs").then((res) => {
            setAdminData(res.data.jobs);
            console.log(res.data.jobs)
        })
    }
        , []);
    const [open, setOpen] = useState(false);
    return (
        <div>
            <div className='max-w-4xl mx-auto bg-white border border-[#88004c] shadow-lg rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            <img
                                className="object-cover w-full h-full"
                                src={profile.image}
                                alt="@profileImage"
                            />
                        </div>
                        <div>
                            <h1 className='font-medium text-xl'>{profile.name}</h1>
                            <p>GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT</p>
                            {role === 'student' ? (<p>Student</p>) : (<p>Admin</p>)}
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className='text-right' variant='outline'><Pen /> </Button>
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
                {role === 'student' ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Label className="text-md font-medium">Bio:</Label>
                            {profile?.profile?.bio ? (
                                <p className="text-gray-600">{profile.profile.bio}</p>
                            ) : (
                                <span className="text-gray-500">NA</span>
                            )}
                        </div>
                        {
                            role==='student'?(<div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-1">
                                    <strong className="font-medium text-gray-700">10th % : </strong>
                                    <span className="text-gray-600">{profile?.profile?.tenth || 'NA'}%</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <strong className="font-medium text-gray-700">12th % :</strong>
                                    <span className="text-gray-600">{profile?.profile?.tweleth || 'NA'}%</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <strong className="font-medium text-gray-700">Graduation % :</strong>
                                    <span className="text-gray-600">{profile?.profile?.graduationMarks || 'NA'}%</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-md font-medium">Degree:</Label>
                            {profile.degree ? (
                                <p className="text-gray-600">{profile?.profile?.degree}</p>
                            ) : (
                                <span className="text-gray-500">NA</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-md font-medium">Resume:</Label>
                            {profile?.profile?.resume ? (
                                <a
                                    href={profile?.profile?.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 font-bold hover:underline"
                                >
                                    View Resume
                                </a>
                            ) : (
                                <span className="text-gray-500">NA</span>
                            )}
                        </div>
                            </div>):(<></>)
                        }
                    </div>
                ) : null}



            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2x'>
                {role === 'student' ? (<h1 className='font-bold text-lg my-5'>Applied Jobs</h1>) : (<h1 className='font-bold text-lg my-5'>Posted Jobs</h1>)}
                {role == 'student' ? (<JobTable admin={false} jobData={data} />) : (<JobTable admin={true} jobData={adminData} />)}
            </div>

            <UpdateAdmin open={role === 'admin' && open} setOpen={setOpen} />
            {<UpdateStudent open={role === 'student' && open} setOpen={setOpen} />}
        </div>
    )
}
export default Profile;
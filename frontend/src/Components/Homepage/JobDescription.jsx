import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../LoginSignUp/axios.js'
import { Avatar } from '../ui/avatar'
import UserTable from '../pages/userTable'
const JobDescription = () => {
    const [applied, setApplied] = useState('');
    const { id } = useParams();
    const [job, setJob] = useState('');
    const [isallow, setIsallow] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = JSON.parse(localStorage.getItem('user')).role;

    const [showPopup, setShowPopup] = useState(false);
    const [studentData] = useState(JSON.parse(localStorage.getItem('user')));
    const[users,setUser]=useState('');
    const fetchApplications = async () => {
        console.log(user);
        try {
            const response = await axios.get(`http://localhost:8080/findapplication_id`);
            setApplied(response.data.applied);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    // let isallow=false;
    const findAllow = () => {
        // console.log(job.tenth, "  ", user.profile.tenth)
        // console.log(job.tweleth, "  ", user.profile.tweleth)
        // console.log(job.graduationMarks, " ", user.profile.graduationMarks)
        // if (job.tenth <= user.profile.tenth && job.tweleth <= user.profile.tweleth && job.graduationMarks <= user.profile.graduationMarks) {
        //     console.log("true");
        //     setIsallow(true);
        // }
    }
    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/${id}`);
            const response2=await axios.get(`jobs/applications/${id}`);
            console.log(response2.data.data)
             setUser(response2.data.data);
            setJob(response.data.job);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleApplyClick = () => {
        setShowPopup(true);
    };

    const handleCancelClick = () => {
        setShowPopup(false);
    };

    const handleConfirmApply = () => {
        applyHandler(new Event('apply'));
        setShowPopup(false);
    };

    const handleEditProfileClick = () => {
        navigate('/profile')
    };


    useEffect(() => {
        fetchJobDetails();
        fetchApplications();
    }, []);
    useEffect(() => {
        findAllow();
    })
    const Applied = applied.includes(job._id);


    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{job.company}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        {job.companyProfile && (
                            <Avatar
                                src={job.companyProfile}
                                alt="Company Logo"
                                className="w-12 h-12 rounded-full object-cover shadow-md"
                            />
                        )}
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>{job.posi}</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>Intership</Badge>
                        <Badge className="text-yellow-600 font-bold" variant='ghost'>24Lpa</Badge>
                    </div>
                </div>
                {
                    isAdmin === 'admin' ? (<></>) : (isallow ? (Applied ? (<Button className='bg-gray-900 text-white rounded-xl ' disabled>Already Applied</Button>) : (<Button className='bg-yellow-700 rounded-xl hover:bg-yellow-800' onClick={handleApplyClick}>Apply Now</Button>)) : (<Button className='bg-slate-900 text-white rounded-xl ' disabled>Not Allow</Button>))
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
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-300 p-8 rounded-3xl shadow-xl max-w-lg w-full">
                        <h2 className="text-3xl font-bold text-yellow-800 text-center mb-6">Review Your Profile</h2>
                        <div className="bg-white p-6 rounded-2xl shadow-md max-h-[400px] overflow-y-auto">
                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Name:</strong> {studentData?.name || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Email:</strong> {studentData?.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Phone:</strong> {studentData?.phone || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Bio:</strong> {studentData?.profile?.bio || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>10th Marks:</strong> {studentData?.profile?.tenth || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>12th Marks:</strong> {studentData?.profile?.tweleth || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Graduation Marks:</strong> {studentData?.profile?.graduationMarks || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <p className="font-medium text-gray-700 mb-4">
                                <strong>Resume:</strong>
                                <a
                                    href={studentData?.profile?.resume || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 ml-2"
                                >
                                    View Resume
                                </a>
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 mt-4 text-center">
                            If you want to update your profile, please go to <strong className="cursor-pointer text-blue-600"
                            onClick={handleEditProfileClick}
                            >Edit Profile</strong>.
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full"
                                onClick={handleConfirmApply}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                   
                </div>
            )}
            <div>
               {
                    isAdmin==='admin'?(<UserTable applies={users}/>):(<></>)
               }
            </div>
        </div>
    )
}

export default JobDescription
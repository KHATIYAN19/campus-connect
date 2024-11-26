import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "../LoginSignUp/axios.js"
// import {mongoose} from "mongoose"
import { toast } from 'react-toastify'
const JobDetails = ({ data }) => {
    const applied = JSON.parse(localStorage.getItem('user')).Applied;
    const [isApplied, setIsApplied] = useState(applied.includes(data._id));
    const role = localStorage.getItem('role');
    const id = data._id;

    const [showPopup, setShowPopup] = useState(false);
    const [studentData] = useState(JSON.parse(localStorage.getItem('user')));

    const applyHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/jobs/apply/${id}`);
            const posted = response.data.success;
            if (posted) {
                toast.success("Applied Successfully");
                setIsApplied(true);
                navigate("/Jobs");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }
    const navigate = useNavigate();
    const jobId = "abcdefgh";

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
        navigate('/profile');
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 my-4'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>2 days ago</p>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant='outline' size='icon'>
                    <Avatar>
                        <AvatarImage src={data.logo} alt="@shadcn" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='text-lg font-medium'>{data.company}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>
            <div className=''>
                <h1 className='font-bold text-lg my-2'>{data.position}</h1>
                <p className='text-sm text-gray-600'>{data.description.length > 80 ? data.description.substring(0, 50) : data.description}</p>
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
                    role === 'student' ? (<Button disabled={isApplied} onClick={handleApplyClick} className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed rounded-xl' : 'bg-yellow-700 rounded-xl hover:bg-yellow-800'}`}>{isApplied ? 'Applied' : 'Apply'}</Button>) : (<></>)
                }
                {/* {
                    isApplied?(<>true</>):(<>false</>)
                } */}

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
                                        <strong>Bio:</strong> {studentData?.bio || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>10th Marks:</strong> {studentData?.marks?.tenth || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>12th Marks:</strong> {studentData?.marks?.twelth || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-700">
                                        <strong>Graduation Marks:</strong> {studentData?.marks?.graduation || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <p className="font-medium text-gray-700 mb-4">
                                <strong>Resume:</strong>
                                <a
                                    href={studentData?.resume || "#"}
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


        </div>
    )
}

export default JobDetails;
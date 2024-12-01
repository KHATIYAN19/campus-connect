import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "../LoginSignUp/axios.js"
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
        <div className="p-8 rounded-xl shadow-2xl bg-white border border-gray-200 my-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-600">Posted 2 days ago</p>
            </div>
            <div className="flex items-center gap-6 my-6">
                <Button className="p-3" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={data.logo} alt="@companyLogo" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{data.company}</h1>
                    <p className="text-sm text-gray-500">{data.location || 'India'}</p>
                </div>
            </div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.position}</h1>
                <p className="text-base text-gray-600">{data.description.length > 100 ? data.description.substring(0, 150) + '...' : data.description}</p>
            </div>
            <div className="flex items-center gap-6 mt-6">
                <Badge className="text-yellow-600 font-semibold px-4 py-2 bg-yellow-50 rounded-lg" variant="outline">{data.numbers} Positions</Badge>
                <Badge className="text-yellow-600 font-semibold px-4 py-2 bg-yellow-50 rounded-lg" variant="outline">Internship</Badge>
                <Badge className="text-yellow-600 font-semibold px-4 py-2 bg-yellow-50 rounded-lg" variant="outline">{data.salary}</Badge>
            </div>
            <div className="flex items-center gap-8 mt-8">
                <Button onClick={() => navigate(`/description/${data._id}`)} variant="outline" className="rounded-lg px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors">
                    View Details
                </Button>
                {
                    role === 'student' ? (
                        <Button disabled={isApplied} onClick={handleApplyClick} className={`rounded-lg px-8 py-3 ${isApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}>
                            {isApplied ? 'Applied' : 'Apply'}
                        </Button>
                    ) : null
                }
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-300 p-8 rounded-3xl shadow-xl max-w-lg w-full">
                        <h2 className="text-3xl font-bold text-yellow-800 text-center mb-6">Review Your Profile</h2>
                        <div className="bg-white p-8 rounded-2xl shadow-lg max-h-[400px] overflow-y-auto">
                            <div className="space-y-6">
                                <div className="flex justify-between text-gray-700">
                                    <strong>Name:</strong> {studentData?.name || "N/A"}
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>Email:</strong> {studentData?.email || "N/A"}
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>Phone:</strong> {studentData?.phone || "N/A"}
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>Bio:</strong> {studentData?.profile?.bio || "N/A"}
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>10th Marks:</strong> {studentData?.profile?.tenth || "N/A"}%
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>12th Marks:</strong> {studentData?.profile?.tweleth || "N/A"}%
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <strong>Graduation Marks:</strong> {studentData?.profile?.graduationMarks || "N/A"}%
                                </div>
                            </div>
                            <p className="font-medium text-gray-700 mb-4">
                                <strong>Resume:</strong>
                                <a href={studentData?.profile?.resume || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">
                                    View Resume
                                </a>
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 text-center">
                            Want to update your profile? Visit <strong className="cursor-pointer text-blue-600" onClick={handleEditProfileClick}>Edit Profile</strong>.
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full" onClick={handleCancelClick}>Cancel</Button>
                            <Button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full" onClick={handleConfirmApply}>Apply</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobDetails;

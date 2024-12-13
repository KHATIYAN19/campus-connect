import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { Avatar } from '../ui/avatar';
import UserTable from '../pages/userTable';
import { toast } from 'react-toastify';

const JobDescription = () => {
    const [applied, setApplied] = useState([]);
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [isAllow, setIsAllow] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';
    const [showPopup, setShowPopup] = useState(false);
    const [studentData] = useState(user || {});
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/findapplication_id`);
            setApplied(response.data.applied || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/${id}`);
            setJob(response.data.job);
            if (isAdmin === 'admin') {
                const response2 = await axios.get(`http://localhost:8080/jobs/applications/${id}`);
                setUser(response2.data.data);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const applyHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/jobs/apply/${id}`);
            if (response.data.success) {
                setApplied([...applied, id]);
                setShowPopup(false);
                toast.success('Applied Successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const findAllow = () => {
        if (job.tenth <= user.profile.tenth && job.tweleth <= user.profile.tweleth && job.graduationMarks <= user.profile.graduationMarks) {
            setIsAllow(true);
        }
    };

    const handleApplyClick = () => setShowPopup(true);
    const handleCancelClick = () => setShowPopup(false);

    useEffect(() => {
        fetchJobDetails();
        fetchApplications();
    }, []);

    useEffect(() => {
        isAdmin === 'student' ? findAllow() : '';
    });

    const Applied = applied.includes(job._id);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 rounded-xl shadow-2xl mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-900">{job.company}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <Avatar
                            src={job.logo}
                            alt="Company Logo"
                            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-purple-300"
                        />
                        
                    </div>
                </div>
                {!isAdmin && (
                    isAllow ? (
                        isApplied ? (
                            <Button
                                className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
                                disabled
                            >
                                Already Applied
                            </Button>
                        ) : (
                            <Button
                                className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-purple-700 hover:from-pink-600 hover:to-purple-800 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleApplyClick}
                            >
                                Apply Now
                            </Button>
                        )
                    ) : (
                        <Button
                            className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-lg cursor-not-allowed"
                            disabled
                        >
                            Not Allowed
                        </Button>
                    )
                )}
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description </h1>
            <div>
                <div className='my-8'>

                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{job.position}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{job.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{job.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>0-2 years</span></h1>
                <h1 className='font-bold my-1'>Batch: <span className='pl-4 font-normal text-gray-800'>2025</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{job.salary} LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{job.numbers}</span></h1>
                <h1 className='font-bold my-1'>10<sup>th</sup> Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.tenth}%</span></h1>
                <h1 className='font-bold my-1'>12<sup>th</sup> Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.tweleth}%</span></h1>
                <h1 className='font-bold my-1'>Graduation Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.graduationMarks}%</span></h1>
            </div>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-lg">
                <p className="text-center font-semibold">
                    Posted by: <a href="#" className="underline hover:text-yellow-300">{job.postedBy || 'N/A'}</a>
                </p>
            </div>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl max-w-md w-full">
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-4">Review Your Profile</h2>
                        <div className="mt-4 space-y-2 text-gray-700">
                            {Object.entries({
                                Name: studentData.name,
                                Email: studentData.email,
                                Phone: studentData.profile?.phone,
                                Bio: studentData.profile?.bio,
                                '10th Marks': `${studentData.profile?.tenth || 'N/A'}%`,
                                '12th Marks': `${studentData.profile?.tweleth || 'N/A'}%`,
                                'Graduation Marks': `${studentData.profile?.graduationMarks || 'N/A'}%`,
                            }).map(([key, value]) => (
                                <p key={key} className="text-sm sm:text-base">
                                    <strong>{key}:</strong> {value || 'N/A'}
                                </p>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6 gap-4">
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full"
                                onClick={applyHandler}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {isAdmin && <UserTable applies={users} />}
        </div>
    );
};

export default JobDescription;

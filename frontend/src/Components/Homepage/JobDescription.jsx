import React, { useState, useEffect } from 'react';
import { HiUserGroup } from "react-icons/hi";
import { Button } from '../ui/button';
import { useParams } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import UserTable from '../pages/userTable';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";

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
    const [count, SetCount] = useState(0);
    const navigate = useNavigate();
    const fetchApplications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/applications/${id}`);          
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/${id}`);
            const response2 = await axios.get(`http://localhost:8080/findapplication_id`);
            setApplied(response2.data.applied);
            SetCount(response.data.job.applicants.length);
            setJob(response.data.job);
            if (isAdmin) {
                fetchApplications();
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
                SetCount(count + 1);
                setShowPopup(false);
                toast.success('Applied Successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    // const exportToExcel = () => {
    //     console.log(users)
    //     const worksheet = XLSX.utils.json_to_sheet(users);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    //     XLSX.writeFile(workbook, "StudentData.xlsx");
    //   };

    const findAllow = () => {
        if (
            job.tenth <= user.profile.tenth &&
            job.tweleth <= user.profile.tweleth &&
            job.graduationMarks <= user.profile.graduationMarks
        ) {
            setIsAllow(true);
        }
    };

    const handleApplyClick = () => setShowPopup(true);
    const handleCancelClick = () => setShowPopup(false);

    useEffect(() => {
        fetchJobDetails();
    }, []);

    useEffect(() => {
        if (user?.role === 'student') {
            findAllow();
        }
    }, [job]);

    const isApplied = applied.includes(job._id);
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-100 via-[#eab3c4] to-[#eb82fd] rounded-xl shadow-2xl mt-8">
       
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Company Logo */}
                    <div
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                        style={{
                            backgroundImage: `url(${job.logo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Company Name */}
                   <div  className='flex flex-col'>
                   <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-700 ml-4">{job.company}</h1>
                   <p className='text-sm ml-4'> Jobid-{job.jobid}</p>
                   </div>
                </div>
                
                {/* Applied Count Section */}
                <div className="flex items-center gap-2 border p-2 rounded-xl text-white bg-[#99005b]">
                    <div className="text-2xl"> 
                        <HiUserGroup />
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-md">Applied: <span className="text-md font-bold"> {count}</span></p>
                    </div>
                </div>
                
                {/* Apply Button */}
                {!isAdmin && (
                    isAllow ? (
                        isApplied ? (
                            <Button
                                className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-800 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
                                disabled
                            >
                                Already Applied
                            </Button>
                        ) : (
                            <Button
                                className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-800 to-purple-700 hover:from-pink-600 hover:to-purple-800 text-white font-semibold px-4 py-2 rounded-xl"
                                onClick={handleApplyClick}
                            >
                                Apply Now
                            </Button>
                        )
                    ) : (
                        <Button
                            className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-800 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
                            disabled
                        >
                            Not Allowed
                        </Button>
                    )
                )}
            </div>

            {/* Job Description */}
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div>
                <div className='my-8'>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{job.position}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{job.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{job.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>Freshers</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{job.salary} LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{job.numbers}</span></h1>
                    <h1 className='font-bold my-1'>10<sup>th</sup> Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.tenth}%</span></h1>
                    <h1 className='font-bold my-1'>12<sup>th</sup> Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.tweleth}%</span></h1>
                    <h1 className='font-bold my-1'>Graduation Percentage: <span className='pl-4 font-normal text-gray-800'>Above {job.graduationMarks}%</span></h1>
                </div>

                {/* "Posted by" Information for Students Only */}
                {user?.role === 'student' && (
                    <div className="mt-4 text-center text-gray-600">
                        <p className="text-sm font-semibold " onClick={()=>{navigate(`/user/profile/${job.postby._id}`)}}>Posted by: <span className='cursor-pointer border-b-2 '>{job?.postby?.name || 'N/A'}</span></p>
                    </div>
                )}
            </div>

            {/* Apply Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full">
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#80004c] mb-4">Review Your Profile</h2>
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
                                className="bg-red-700 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#568203] hover:bg-[#708238] text-white font-bold px-4 py-2 rounded-full"
                                onClick={applyHandler}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants Table for Admin */}
            {isAdmin && (
                <div className="mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#80004c] text-center mb-4">Applicants</h2>
                    {users.length > 0 ? (
                        <UserTable applies={users} />
                    ) : (
                        <p className="text-gray-600 text-center">No applicants for this job yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDescription;

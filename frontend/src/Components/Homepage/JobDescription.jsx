import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiBriefcase, HiLocationMarker, HiCurrencyRupee, HiAcademicCap, HiDocumentText } from "react-icons/hi";
import { Button } from '../ui/button';
import { useParams } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import UserTable from '../pages/userTable';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";

const JobDescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State management
    const [applied, setApplied] = useState([]);
    const [job, setJob] = useState({});
    const [isAllow, setIsAllow] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    
    // User data from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user?.role === 'admin';
    const studentData = user || {};

    // Fetch job applications (admin only)
    const fetchApplications = async () => {
        try {
            const response = await axios.get(`/jobs/applications/${id}`);
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        }
    };

    // Fetch job details and check applications
    const fetchJobDetails = async () => {
        try {
            const [jobResponse, appliedResponse] = await Promise.all([
                axios.get(`/jobs/${id}`),
                axios.get('/findapplication_id')
            ]);

            const { job } = jobResponse.data;
            const { applied } = appliedResponse.data;

            setApplied(applied);
            setCount(job.applicants?.length || 0);
            setJob(job);

            if (isAdmin) fetchApplications();
        } catch (error) {
            console.error('Error fetching job details:', error);
            toast.error('Failed to load job details');
        }
    };

    // Handle job application
    const applyHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/jobs/apply/${id}`);
            if (response.data.success) {
                setApplied([...applied, id]);
                setCount(prev => prev + 1);
                setShowPopup(false);
                toast.success('Application submitted successfully!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Application failed');
        }
    };

    // Check eligibility
    const checkEligibility = () => {
        if (!user?.profile || !job) return;
        
        const { tenth, tweleth, graduationMarks } = user.profile;
        setIsAllow(
            tenth >= job.tenth &&
            tweleth >= job.tweleth &&
            graduationMarks >= job.graduationMarks
        );
    };

    // Initial load
    useEffect(() => {
        fetchJobDetails();
    }, []);

    // Check eligibility when job or user changes
    useEffect(() => {
        if (user?.role === 'student') checkEligibility();
    }, [job, user]);

    // Application status checks
    const isApplied = applied.includes(job._id);
    const showApplyButton = !isAdmin && user?.role === 'student';
    const applicationStatus = !isAllow ? 'not-allowed' : isApplied ? 'applied' : 'can-apply';

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg mt-8 border border-purple-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
                {/* Company Info */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white p-1.5">
                        <img 
                            src={job.logo} 
                            alt={job.company} 
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{job.company}</h1>
                        <p className="text-purple-600 font-medium mt-1">Job ID: {job.jobid}</p>
                    </div>
                </div>

                {/* Application Controls */}
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <HiUserGroup className="text-2xl text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Applicants</p>
                            <p className="text-xl font-bold text-gray-800">{count}</p>
                        </div>
                    </div>

                    {showApplyButton && (
                        <div className="flex justify-end">
                            {applicationStatus === 'applied' ? (
                                <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl" disabled>
                                    🎉 Applied!
                                </Button>
                            ) : applicationStatus === 'can-apply' ? (
                                <Button 
                                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl transform transition-all duration-200 hover:scale-105"
                                    onClick={() => setShowPopup(true)}
                                >
                                    ⚡ Apply Now
                                </Button>
                            ) : (
                                <div className="bg-red-100 px-4 py-2 rounded-lg">
                                    <p className="text-red-600 font-medium">🚫 Eligibility criteria not met</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                    <HiDocumentText className="text-3xl text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={<HiBriefcase />} title="Position" value={job.position} />
                    <DetailItem icon={<HiLocationMarker />} title="Location" value={job.location} />
                    <DetailItem icon={<HiCurrencyRupee />} title="Salary" value={`${job.salary} LPA`} />
                    <DetailItem icon={<HiAcademicCap />} title="Experience" value="Freshers" />
                    
                    <div className="col-span-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                    </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="mt-8 bg-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Eligibility Criteria</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <CriteriaItem title="10th Percentage" value={`≥ ${job.tenth}%`} />
                        <CriteriaItem title="12th Percentage" value={`≥ ${job.tweleth}%`} />
                        <CriteriaItem title="Graduation Marks" value={`≥ ${job.graduationMarks}%`} />
                    </div>
                </div>

                {/* Posted By Section */}
                {user?.role === 'student' && job?.postby && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Posted by: {' '}
                            <span 
                                className="text-purple-600 font-medium cursor-pointer hover:underline"
                                onClick={() => navigate(`/user/profile/${job.postby._id}`)}
                            >
                                {job.postby.name}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Application Confirmation Modal */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-purple-100">
                        <div className="text-center mb-6">
                            <div className="mb-4">
                                <div className="bg-purple-100 w-max mx-auto p-3 rounded-full">
                                    <HiDocumentText className="text-3xl text-purple-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Profile</h2>
                            <p className="text-gray-500">Confirm your details before applying</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <ProfileDetailItem label="Name" value={studentData.name} />
                            <ProfileDetailItem label="Email" value={studentData.email} />
                            <ProfileDetailItem label="Phone" value={studentData.profile?.phone} />
                            <ProfileDetailItem label="10th Marks" value={`${studentData.profile?.tenth}%`} />
                            <ProfileDetailItem label="12th Marks" value={`${studentData.profile?.tweleth}%`} />
                            <ProfileDetailItem label="Graduation" value={`${studentData.profile?.graduationMarks}%`} />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button
                                variant="outline"
                                className="px-6 py-3 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white"
                                onClick={applyHandler}
                            >
                                Confirm & Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants Section (Admin Only) */}
            {isAdmin && (
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">👥 Applicants</h2>
                        <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                const worksheet = XLSX.utils.json_to_sheet(users);
                                const workbook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
                                XLSX.writeFile(workbook, "Applicants.xlsx");
                            }}
                        >
                            Export to Excel
                        </Button>
                    </div>
                    
                    {users.length > 0 ? (
                        <UserTable applies={users} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No applications received yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Reusable Components
const DetailItem = ({ icon, title, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-purple-600 mt-1">{icon}</span>
        <div>
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

const CriteriaItem = ({ title, value }) => (
    <div className="bg-white p-4 rounded-lg border border-purple-100 text-center">
        <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
        <p className="text-xl font-bold text-purple-600">{value}</p>
    </div>
);

const ProfileDetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-800 font-medium">{value || 'N/A'}</span>
    </div>
);

export default JobDescription;
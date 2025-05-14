import React, { useState, useEffect } from 'react';
import {
    HiUserGroup, HiBriefcase, HiLocationMarker,
    HiCurrencyRupee, HiAcademicCap, HiDocumentText,
    HiX, HiBadgeCheck, HiSelector
} from "react-icons/hi";
import { HiBuildingOffice } from 'react-icons/hi2';

import { Button } from '../ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const JobDescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applied, setApplied] = useState([]);
    const [job, setJob] = useState(null);
    const [isAllow, setIsAllow] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [marksError, setMarksError] = useState('');
    const [batchError, setBatchError] = useState('');
    const [placementPolicyError, setPlacementPolicyError] = useState('');
    const [applyError, setApplyError] = useState('');
    const [applyReason, setApplyReason] = useState('');

    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';
    const selectedUsers = users?.filter(user => user.status === 'selected') || [];

    const isApplied = applied?.includes(job?._id);

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`/application/${id}`);
            setUsers(response.data.applications || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        }
    };
    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const [jobResponse, appliedResponse] = await Promise.all([
                axios.get(`/jobs/${id}`),
                user?.role === 'student' ? axios.get('/application/u/myapplication') : Promise.resolve(null)
            ]);
            const { job: jobData } = jobResponse.data;
            setJob(jobData);
            setCount(users?.length || 0);

            if (appliedResponse?.data?.companies) {
                setApplied(appliedResponse.data.companies);
            }
            await fetchApplications();
        } catch (error) {
            toast.error('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };
    const toggleJobStatus = async () => {
        try {
            await axios.put(`/jobs/${id}/toggle`);
            setJob(prev => ({ ...prev, closed: !prev.closed }));
            toast.success(`Job ${job?.closed ? 'opened' : 'closed'} successfully`);
        } catch (error) {
            toast.error('Failed to update job status');
        }
    };
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const response = await axios.patch(`/application/changestatus`, {
                application_id: applicationId,
                status: newStatus
            });
            if (response.status === 200) {
                setUsers(prevUsers =>
                    prevUsers.map(app =>
                        app._id === applicationId ? { ...app, status: newStatus } : app
                    )
                );
                toast.success('Application status updated successfully!');
            } else {
                toast.error('Failed to update application status.');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update application status.');
        }
    };
    const applyHandler = async (e) => {
        e.preventDefault();
        setApplyError('');
        setApplyReason('');

        if (job?.closed) {
            setApplyError('Application Closed');
            setApplyReason('This job is closed, please contact the admin.');
            return;
        }

        if (marksError) {
            toast.error(marksError);
            return;
        }

        if (batchError) {
            toast.error(batchError);
            return;
        }

        if (placementPolicyError) {
            toast.error(placementPolicyError);
            return;
        }

        try {
            await axios.post(`/application/${id}`);
            setApplied(prev => [...prev, job?._id]);
            setCount(prev => prev + 1);
            setShowPopup(false);
            toast.success('Application submitted!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Application failed');
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    useEffect(() => {
        setCount(users?.length || 0);
    }, [users]);

    useEffect(() => {
        if (job && user?.role === 'student' && !isApplied) {
            const { tenth, tweleth, graduationMarks } = user.profile || {};
            let isMarksOk = true;
            let isBatchOk = true;
            setMarksError('');
            setBatchError('');
            setPlacementPolicyError('');

            if (tenth < job.tenth || tweleth < job.tweleth || graduationMarks < job.graduationMarks) {
                isMarksOk = false;
                setMarksError('Minimum marks criteria not fulfilled.');
            }

            if (job.batch !== user.year) {
                isBatchOk = false;
                setBatchError(`Batch mismatch. Required batch: ${job.batch}, Your batch: ${user.year}`);
            }

            setIsAllow(isMarksOk && isBatchOk);

            if (user?.maxoffer * 2 > job?.salary) {
                setPlacementPolicyError("You can't apply due to placement policies.");
            }
        } else {
            setIsAllow(true); 
            setMarksError('');
            setBatchError('');
            setPlacementPolicyError('');
        }
    }, [job, user, isApplied]);
    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (!job) return <div className="text-center p-8">Job not found</div>;
    const showApplyButton = !isAdmin && user?.role === 'student';
    const applicationStatus = job?.closed ? 'closed' : !isAllow ? 'not-allowed' : isApplied ? 'applied' : 'can-apply';
    const postedDate = job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A';
    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white py-12 px-6 sm:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full shadow-lg border-2 border-white bg-white p-2">
                            <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-full" />
                         
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{job.company}</h1>
                            <p className="text-lg opacity-80">Job ID: {job.jobid}</p>
                        </div>
                    </div>
                    <div>
                        {isAdmin ? (
                            <Button onClick={toggleJobStatus} className={`px-4 py-2 rounded-md font-semibold ${job?.closed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                                {job?.closed ? <><HiBadgeCheck className="inline-block mr-2" /> Open Job</> : <><HiSelector className="inline-block mr-2" /> Close Job</>}
                            </Button>
                        ) : showApplyButton && (
                            <>
                                {applicationStatus === 'applied' ? (
                                    <Button disabled className="bg-green-500 text-white font-semibold px-6 py-3 rounded-md shadow-md">
                                        <span className="flex items-center">
                                            <HiBadgeCheck className="mr-2" /> Applied
                                        </span>
                                    </Button>
                                ) : applicationStatus === 'can-apply' ? (
                                    <Button
                                        onClick={() => setShowPopup(true)}
                                        className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-orange-100"
                                        disabled={placementPolicyError === "You can't apply due to placement policies."}
                                    >
                                        <span className="flex items-center">
                                            <HiDocumentText className="mr-2" /> Apply Now
                                        </span>
                                    </Button>
                                ) : applicationStatus === 'closed' ? (
                                    <div className="bg-red-100 text-red-700 py-2 px-4 rounded-md text-sm font-medium">
                                        <HiX className="inline-block mr-1" /> Job Closed
                                        {applyError && <p className="text-xs mt-1">{applyError}</p>}
                                        {applyReason && <p className="text-xs opacity-70">{applyReason}</p>}
                                    </div>
                                ) : (
                                    <div className="bg-yellow-100 text-red-700 py-2 px-4 rounded-md text-sm font-medium">
                                        <HiExclamation className="inline-block mr-1" /> Not Eligible
                                        {marksError && <div className="bg-red-50 border border-red-300 text-red-700 px-2 py-1 rounded mt-1 text-xs">{marksError}</div>}
                                        {batchError && <div className="bg-red-50 border border-red-300 text-red-700 px-2 py-1 rounded mt-1 text-xs">{batchError}</div>}
                                        {placementPolicyError && <div className="bg-red-50 border border-red-300 text-red-700 px-2 py-1 rounded mt-1 text-xs">{placementPolicyError}</div>}
                                    </div>
                                )}
                                {placementPolicyError === "You can't apply due to placement policies." && applicationStatus !== 'closed' && (
                                    <p className="text-white text-sm mt-2">You can't apply due to placement policies.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="p-6 sm:p-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DetailItem icon={<HiBriefcase className="text-xl text-orange-500" />} title="Position" value={job.position} />
                        <DetailItem icon={<HiBuildingOffice className="text-xl text-orange-500" />} title="Company" value={job.company} />
                        <DetailItem icon={<HiLocationMarker className="text-xl text-orange-500" />} title="Location" value={job.location} />
                        <DetailItem icon={<HiCurrencyRupee className="text-xl text-orange-500" />} title="Salary" value={`${job.salary} LPA`} />
                        <DetailItem icon={<HiAcademicCap className="text-xl text-orange-500" />} title="Experience" value="Freshers" />
                        <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Posted Date" value={postedDate} />
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-orange-600 mt-1"><HiUserGroup className="text-xl" /></span>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Total Applicants</h4>
                                <p className="text-gray-800 font-medium">{count}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h2>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-6 mb-8 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4"><HiDocumentText className="inline-block mr-2 text-orange-500" /> Eligibility Criteria</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <CriteriaItem title="10th Percentage" value={`≥ ${job.tenth}%`} />
                            <CriteriaItem title="12th Percentage" value={`≥ ${job.tweleth}%`} />
                            <CriteriaItem title="Graduation Marks" value={`≥ ${job.graduationMarks}%`} />
                            <div className="sm:col-span-3 mt-4">
                                {batchError && <p className="text-red-500 text-sm">{batchError}</p>}
                                {marksError && <p className="text-red-500 text-sm">{marksError}</p>}
                            </div>
                        </div>
                    </div>
                    {user?.role === 'student' && job.postby && (
                        <div className="py-4 border-t border-gray-200 text-gray-600 text-sm">
                            Posted by: <span
                                className="text-orange-500 font-medium cursor-pointer hover:underline"
                                onClick={() => navigate(`/user/profile/${job.postby._id}`)}
                            >
                                {job.postby.name}
                            </span>
                        </div>
                    )}
                </div>
                {isAdmin && (
                    <div className="bg-gray-100 p-6 sm:p-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Management</h2>
                        {users?.length > 0 ? (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">All Applications</h3>
                                <StudentTable users={users} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                            </div>
                        ) : (
                            <div className="py-6 text-center text-gray-500">No applications received for this job yet.</div>
                        )}

                        {selectedUsers?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Students</h3>
                                <StudentTable users={selectedUsers} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                            </div>
                        )}
                        {selectedUsers?.length === 0 && users?.length > 0 && (
                            <div className="py-6 text-center text-gray-500">No students have been selected for this job yet.</div>
                        )}
                    </div>
                )}
                {!isAdmin && selectedUsers?.length > 0 && (
                    <div className="bg-gray-100 p-6 sm:p-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Students</h2>
                        <StudentTable users={selectedUsers} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                    </div>
                )}
                {!isAdmin && selectedUsers?.length === 0 && users?.length > 0 && (
                    <div className="bg-gray-100 p-6 sm:p-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Students</h2>
                        <div className="py-6 text-center text-gray-500">No students have been selected for this job yet.</div>
                    </div>
                )}
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4 border border-orange-200">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="mb-4">
                                <div className="bg-orange-100 w-max mx-auto p-3 rounded-full">
                                    <HiDocumentText className="text-3xl text-orange-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Profile</h2>
                            <p className="text-gray-500">Confirm your details before applying</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <ProfileDetailItem label="Name" value={user?.name} />
                            <ProfileDetailItem label="Email" value={user?.email} />
                            <ProfileDetailItem label="Phone" value={user?.profile?.phone} />
                            <ProfileDetailItem label="10th Marks" value={`${user?.profile?.tenth}%`} />
                            <ProfileDetailItem label="12th Marks" value={`${user?.profile?.tweleth}%`} />
                            <ProfileDetailItem label="Graduation" value={`${user?.profile?.graduationMarks}%`} />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button variant="outline"
                                className="px-6 py-3 border-gray-300 text-gray-600 hover:bg-gray-50"
                                onClick={() => setShowPopup(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 text-white"
                                onClick={applyHandler}
                                disabled={marksError || batchError || placementPolicyError || job?.closed}
                            >
                                Confirm & Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
const StudentTable = ({ users, onStatusChange, isAdmin }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'selected': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    const allPossibleStatuses = ['pending', 'selected', 'rejected'];
    return (
        <div className="overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {['Image', 'Name', 'Email', 'Phone', 'Degree', 'Status'].map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <img src={user?.student?.image} alt={user.student?.name}
                                    className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200" />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user?.student?.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user?.student?.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user?.student?.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user?.student?.profile?.graduationdegree}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {isAdmin ? (
                                    <div className="relative">
                                        <select
                                            value={user.status}
                                            onChange={(e) => onStatusChange(user._id, e.target.value)}
                                            className={`block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 shadow-sm appearance-none cursor-pointer ${getStatusStyle(user.status)}`}
                                        >
                                            {allPossibleStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(user.status)}`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
const DetailItem = ({ icon, title, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
        <span className="text-orange-500">{icon}</span>
        <div>
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

const CriteriaItem = ({ title, value }) => (
    <div className="bg-white p-4 rounded-md border border-orange-100 text-center">
        <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
        <p className="text-xl font-bold text-orange-600">{value}</p>
    </div>
);
const ProfileDetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-800 font-medium">{value || 'N/A'}</span>
    </div>
);
const HiExclamation = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.932 3.374h14.023c1.716 0 2.803-1.874 1.932-3.374M12 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);
export default JobDescription;
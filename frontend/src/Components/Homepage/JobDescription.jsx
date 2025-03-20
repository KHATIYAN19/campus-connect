import React, { useState, useEffect } from 'react';
import {
    HiUserGroup, HiBriefcase, HiLocationMarker,
    HiCurrencyRupee, HiAcademicCap, HiDocumentText,
    HiX, HiBadgeCheck, HiSelector
} from "react-icons/hi";
import { Button } from '../ui/button';
import { useParams } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JobDescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applied, setApplied] = useState();
    const [job, setJob] = useState(null);
    const [isAllow, setIsAllow] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState(); // Initialize as empty array
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [marksError, setMarksError] = useState('');
    const [batchError, setBatchError] = useState('');
    const [placementPolicyError, setPlacementPolicyError] = useState('');
    const [applyError, setApplyError] = useState('');
    const [applyReason, setApplyReason] = useState('');

    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';
    const selectedUsers = users?.filter(user => user.status === 'selected') ||[];

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`/application/${id}`);
            console.log(response);
            setUsers(response.data.applications ||[]);
        } catch (error) {
            console.log(error)
            toast.error('Failed to load applications');
        }
    };

    const fetchJobDetails = async () => {
        try {
            const [jobResponse, appliedResponse] = await Promise.all([
                axios.get(`/jobs/${id}`),
                user?.role === 'student' ? axios.get('/application/u/myapplication') : Promise.resolve(null)
            ]);

            const { job } = jobResponse.data;
            setJob(job);
            // Fix: Use the length of the users array for the count
            setCount(users?.length || 0);

            if (appliedResponse?.data?.companies) {
                setApplied(appliedResponse.data.companies);
            }

            await fetchApplications(); // Fetch applications for all users
        } catch (error) {
            toast.error('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const toggleJobStatus = async () => {
        try {
            const response = await axios.put(`/jobs/${id}/toggle`);
            setJob(prev => ({ ...prev, closed: !prev.closed }));
            toast.success(`Job ${job.closed ? 'opened' : 'closed'} successfully`);
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

        if (job.closed) {
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
            setApplied(prev => [...prev, job._id]);
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
        // Update count whenever users array changes
        setCount(users?.length || 0);
    }, [users]);

    useEffect(() => {
        if (job && user?.role === 'student') {
            const { tenth, tweleth, graduationMarks } = user.profile || {};
            let isMarksOk = true;
            let isBatchOk = true;
            setMarksError('');
            setBatchError('');

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
            } else {
                setPlacementPolicyError('');
            }
        }
    }, [job, user]);

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (!job) return <div className="text-center p-8">Job not found</div>;

    const isApplied = applied?.includes(job._id);
    const showApplyButton = !isAdmin && user?.role === 'student';
    const applicationStatus = job.closed ? 'closed' : !isAllow ? 'not-allowed' : isApplied ? 'applied' : 'can-apply';

    return (
        <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg mt-8 border border-blue-100">
            {/* Job Status Ribbon */}
            {job.closed && (
                <div className="absolute top-0 right-0 bg-rose-600 text-white px-6 py-2 rounded-bl-lg shadow-lg">
                    <span className="flex items-center gap-2">
                        <HiX className="w-5 h-5" /> Closed
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white p-1.5">
                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
                        {isAdmin && (
                            <button
                                onClick={toggleJobStatus}
                                className="absolute -mt-2 -mr-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                            >
                                {job.closed ? <HiBadgeCheck className="w-5 h-5" /> : <HiSelector className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{job.company}</h1>
                        <p className="text-blue-600 font-medium mt-1">Job ID: {job.jobid}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <HiUserGroup className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Applicants</p>
                            <p className="text-xl font-bold text-gray-800">{count}</p>
                        </div>
                    </div>

                    {showApplyButton && (
                        <div className="flex flex-col items-end">
                            {applicationStatus === 'applied' ? (
                                <Button disabled className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl">
                                    🎉 Applied!
                                </Button>
                            ) : applicationStatus === 'can-apply' ? (
                                <Button
                                    onClick={() => setShowPopup(true)}
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    ⚡ Apply Now
                                </Button>
                            ) : applicationStatus === 'closed' ? (
                                <div className="flex flex-col items-end">
                                    <div className="bg-rose-100 px-4 py-2 rounded-lg">
                                        <p className="text-rose-600 font-medium">🚫 Job Closed</p>
                                    </div>
                                    {applyError && <p className="text-red-500 mt-1">{applyError}</p>}
                                    {applyReason && <p className="text-gray-500 text-sm">{applyReason}</p>}
                                </div>
                            ) : (
                                <div className="bg-amber-100 px-4 py-2 rounded-lg">
                                    <p className="text-amber-600 font-medium">🚫 Eligibility criteria not met</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <HiDocumentText className="text-3xl text-blue-600" />
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

                <div className="mt-8 bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Eligibility Criteria</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <CriteriaItem title="10th Percentage" value={`≥ ${job.tenth}%`} />
                        <CriteriaItem title="12th Percentage" value={`≥ ${job.tweleth}%`} />
                        <CriteriaItem title="Graduation Marks" value={`≥ ${job.graduationMarks}%`} />
                    </div>
                </div>

                {user?.role === 'student' && job.postby && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Posted by: {' '}
                            <span className="text-blue-600 font-medium cursor-pointer hover:underline"
                                onClick={() => navigate(`/user/profile/${job.postby._id}`)}>
                                {job.postby.name}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-blue-100">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="mb-4">
                                <div className="bg-blue-100 w-max mx-auto p-3 rounded-full">
                                    <HiDocumentText className="text-3xl text-blue-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Profile</h2>
                            <p className="text-gray-500">Confirm your details before applying</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <ProfileDetailItem label="Name" value={user.name} />
                            <ProfileDetailItem label="Email" value={user.email} />
                            <ProfileDetailItem label="Phone" value={user.profile?.phone} />
                            <ProfileDetailItem label="10th Marks" value={`${user.profile?.tenth}%`} />
                            <ProfileDetailItem label="12th Marks" value={`${user.profile?.tweleth}%`} />
                            <ProfileDetailItem label="Graduation" value={`${user.profile?.graduationMarks}%`} />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button variant="outline"
                                className="px-6 py-3 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => setShowPopup(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white"
                                onClick={applyHandler}
                                disabled={marksError || batchError || placementPolicyError || job.closed}
                            >
                                Confirm & Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isAdmin && (
                <>
                    <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">👥 Applicants</h2>
                        </div>
                        {users?.length > 0 ? (
                            <StudentTable users={users} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                        ) : (
                            <div className="py-6 text-center text-gray-500">No applications received for this job yet.</div>
                        )}
                    </div>

                    {selectedUsers?.length > 0 ? (
                        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">🏆 Selected Students</h2>
                            </div>
                            <StudentTable users={selectedUsers} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                        </div>
                    ) : (
                        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">🏆 Selected Students</h2>
                            <div className="py-6 text-center text-gray-500">No students have been selected for this job yet.</div>
                        </div>
                    )}
                </>
            )}

            {!isAdmin && selectedUsers?.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">🏆 Selected Students</h2>
                    </div>
                    <StudentTable users={selectedUsers} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
                </div>
            )}
            {!isAdmin && selectedUsers?.length === 0 && (
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-50 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">🏆 Selected Students</h2>
                    <div className="py-6 text-center text-gray-500">No students have been selected for this job yet.</div>
                </div>
            )}
        </div>
    );
};

const StudentTable = ({ users, onStatusChange, isAdmin }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'selected': return 'bg-emerald-100 text-emerald-800 border-emerald-200'; // Green
            case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-200';   // Red
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';   // Yellow/Amber
            default: return 'bg-gray-100 text-gray-700 border-gray-200'; // Default style
        }
    };

    // Assuming possible status values are 'pending', 'selected', 'rejected', and potentially others
    const allPossibleStatuses = ['pending', 'selected', 'rejected']; // Add other possible statuses here

    return (
        <div className="overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {['Image', 'Name', 'Email', 'Phone', 'Degree', '10th %', '12th %', 'Graduation', 'Status'].map((header) => (
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
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user?.student?.profile?.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user?.student?.profile?.graduationdegree}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">{user?.student?.profile?.tenth}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">{user?.student?.profile?.tweleth}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">{user?.student?.profile?.graduationMarks}%</td>
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
import React, { useEffect, useState } from 'react';
import { Contact, Mail, Pen, User, Users, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';
import UpdateStudent from './UpdateStudent';
import UpdateAdmin from './UpdateAdmin';
import JobTable from '../pages/JobTable';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../LoginSignUp/axios.js';
import { login } from '../redux/authSlice';

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    console.log(user)
    const role = user.role;
    const [profile, setProfile] = useState(user);
    const [data, setData] = useState();
    const [adminData, setAdminData] = useState();
    const userFromRedux = useSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [adminDashboardData, setAdminDashboardData] = useState(null);
    const [selectedCompanies, setSelectedCompanies] = useState();

    useEffect(() => {
        if (role === 'admin') {
            axios.get('http://localhost:8080/application/dashboard')
                .then((res) => {
                    setAdminDashboardData(res.data);
                })
                .catch(error => {
                    console.error('Error fetching admin dashboard data:', error);
                });
            axios.get('http://localhost:8080/jobs/get/myjobs')
                .then((res) => {
                    setAdminData(res.data.jobs);
                })
                .catch(error => {
                    console.error('Error fetching admin jobs:', error);
                });
        } else {
            axios.get('application/myapplication')
                .then((res) => {
                    setData(res.data.applications);
                    const selectedApplications = res.data.applications.filter(
                        (app) => app.status === 'selected'
                    );
                    setSelectedCompanies(selectedApplications);
                })
                .catch(error => {
                    console.error('Error fetching student applications:', error);
                });
        }
    }, [role]);

    useEffect(() => {
        setProfile(userFromRedux);
    }, [userFromRedux]);

    const getGradientColor = (value, maxValue, startColor, endColor) => {
        const ratio = value / maxValue;
        const r = Math.ceil(parseInt(startColor.substring(1, 3), 16) * (1 - ratio) + parseInt(endColor.substring(1, 3), 16) * ratio);
        const g = Math.ceil(parseInt(startColor.substring(3, 5), 16) * (1 - ratio) + parseInt(endColor.substring(3, 5), 16) * ratio);
        const b = Math.ceil(parseInt(startColor.substring(5, 7), 16) * (1 - ratio) + parseInt(endColor.substring(5, 7), 16) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const maxGraduated = adminDashboardData ? Math.max(...adminDashboardData.graduatedStudentsByYear.map(i => i.count), 1) : 1;
    const maxUniqueSelected = adminDashboardData ? Math.max(...adminDashboardData.batchwiseUniqueSelectedStudents.map(i => i.totalUniqueSelectedStudents), 1) : 1;
    const maxTotalOffersBatch = adminDashboardData ? Math.max(...adminDashboardData.batchwiseTotalOffers.map(i => i.totalOffersInBatch), 1) : 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20"></div>
                    <div className="relative p-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                                    <img className="object-cover w-full h-full" src={profile.image} alt="@profileImage" />
                                </div>
                                <div>
                                    <h1 className="font-semibold text-3xl text-gray-800 mb-1">{profile.name}</h1>
                                    <p className="text-gray-600 mb-1">GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT</p>
                                    <p className="text-purple-600 font-medium">{role === 'student' ? 'Student' : 'Admin'}</p>
                                    {role === 'student' && <p className="text-gray-600">Batch: {profile?.year}</p>}
                                </div>
                            </div>
                            <Button onClick={() => setOpen(true)} className="text-purple-600 hover:bg-purple-100 transition-colors rounded-full" variant="outline">
                                <Pen className="mr-2" /> Edit Profile
                            </Button>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="text-purple-500" />
                                <span className="font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Contact className="text-purple-500" />
                                <span className="font-medium">{profile.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    {role === 'student' && (
                        <div className="space-y-4">
                            <div className="text-lg font-semibold text-gray-800">Bio</div>
                            <div className="bg-purple-50 rounded-xl p-4 text-gray-700">
                                {profile?.profile?.bio || <span className="text-gray-500">Not Available</span>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-purple-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">10th %:</span> {profile?.profile?.tenth || 'NA'}%
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">12th %:</span> {profile?.profile?.tweleth || 'NA'}%
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">Graduation %:</span> {profile?.profile?.graduationMarks || 'NA'}%
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-gray-700 md:col-span-2">
                                    <span className="font-medium">Degree:</span> {profile?.profile?.graduationdegree || 'NA'}
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-gray-700 md:col-span-1">
                                    <span className="font-medium">Resume:</span>{' '}
                                    {profile?.profile?.resume ? (
                                        <a href={profile?.profile?.resume} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                            View Resume
                                        </a>
                                    ) : (
                                        'NA'
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {role === 'admin' && (
                        <div className="space-y-4">
                            <div className="text-lg font-semibold text-gray-800">Bio</div>
                            <div className="bg-purple-50 rounded-xl p-4 text-gray-700">
                                {profile?.bio || <span className="text-gray-500">Not Available</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {role === 'student' && (
                <div className="max-w-4xl mx-auto bg-white rounded-3xl mt-8 shadow-2xl overflow-hidden p-8">
                    <h2 className="font-bold text-2xl text-gray-800 mb-4">Selected Companies</h2>
                    {selectedCompanies && selectedCompanies.length > 0 ? (
                        <ul className="space-y-4">
                            {selectedCompanies.map((application, index) => (
                                <li key={index} className="bg-purple-50 rounded-xl p-4 flex items-center shadow-sm border border-purple-100">
                                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                        <img src={application?.company?.logo} alt={`${application?.company?.company} Logo`} className="object-contain w-full h-full" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{application?.company?.company}</h3>
                                        <p className="text-gray-600 text-sm">{application?.company?.location}</p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="font-medium text-purple-700"><span className='text-green-500'>INR</span> {application?.company?.salary || 'NA'} LPA</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No companies selected yet.</p>
                    )}
                </div>
            )}
            {role === 'admin' && adminDashboardData && (
                <div className="max-w-6xl mx-auto bg-white rounded-3xl mt-8 shadow-2xl overflow-hidden p-8">
                    <h2 className="font-bold text-3xl text-gray-800 mb-8 text-indigo-700">Admin Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div className="bg-indigo-50 rounded-xl p-6 shadow-md border border-indigo-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-700 mb-2"><User className="inline-block mr-2" size={20} /> Total Admins</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalAdmins}</p>
                            </div>
                            <div className="text-indigo-400 text-5xl opacity-70"><User size={60} /></div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 shadow-md border border-green-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-green-700 mb-2"><Users className="inline-block mr-2" size={20} /> Total Students</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalStudents}</p>
                            </div>
                            <div className="text-green-400 text-5xl opacity-70"><Users size={60} /></div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 shadow-md border border-blue-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700 mb-2"><Briefcase className="inline-block mr-2" size={20} /> Total Offers</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalOffers}</p>
                            </div>
                            <div className="text-blue-400 text-5xl opacity-70"><Briefcase size={60} /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-purple-50 rounded-xl p-6 shadow-md border border-purple-100">
                            <h3 className="font-semibold text-xl text-purple-700 mb-4"><GraduationCap className="inline-block mr-2" size={20} /> Graduated Students by Year</h3>
                            {adminDashboardData.graduatedStudentsByYear.length > 0 ? (
                                <div className="space-y-3">
                                    {adminDashboardData.graduatedStudentsByYear.map((item) => (
                                        <div key={item.year} className="flex items-center gap-4">
                                            <span className="text-gray-700 font-medium">{item.year}:</span>
                                            <div className="rounded-full h-6 flex-grow overflow-hidden bg-purple-100">
                                                <div
                                                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full text-white font-semibold flex items-center justify-center"
                                                    style={{ width: `${(item.count / maxGraduated) * 100}%` }}
                                                >
                                                    {item.count}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No data available.</p>
                            )}
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-6 shadow-md border border-yellow-100">
                            <h3 className="font-semibold text-xl text-yellow-700 mb-4"><Briefcase className="inline-block mr-2" size={20} /> Unique Selected Students by Batch</h3>
                            {adminDashboardData.batchwiseUniqueSelectedStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {adminDashboardData.batchwiseUniqueSelectedStudents.map((item) => (
                                        <div key={item.batch} className="flex items-center gap-4">
                                            <span className="text-gray-700 font-medium">Batch {item.batch}:</span>
                                            <div className="rounded-full h-6 flex-grow overflow-hidden bg-yellow-100">
                                                <div
                                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full text-white font-semibold flex items-center justify-center"
                                                    style={{ width: `${(item.totalUniqueSelectedStudents / maxUniqueSelected) * 100}%` }}
                                                >
                                                    {item.totalUniqueSelectedStudents}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No data available.</p>
                            )}
                        </div>

                        <div className="bg-teal-50 rounded-xl p-6 shadow-md border border-teal-100">
                            <h3 className="font-semibold text-xl text-teal-700 mb-4"><Briefcase className="inline-block mr-2" size={20} /> Total Offers by Batch</h3>
                            {adminDashboardData.batchwiseTotalOffers.length > 0 ? (
                                <div className="space-y-3">
                                    {adminDashboardData.batchwiseTotalOffers.map((item) => (
                                        <div key={item.batch} className="flex items-center gap-4">
                                            <span className="text-gray-700 font-medium">Batch {item.batch}:</span>
                                            <div className="rounded-full h-6 flex-grow overflow-hidden bg-teal-100">
                                                <div
                                                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full text-white font-semibold flex items-center justify-center"
                                                    style={{ width: `${(item.totalOffersInBatch / maxTotalOffersBatch) * 100}%` }}
                                                >
                                                    {item.totalOffersInBatch}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl mt-8 shadow-2xl overflow-hidden p-8">
                <h1 className="font-bold text-2xl text-gray-800 mb-6">{role === 'student' ? 'Applied Jobs' : null}</h1>
                {role === 'student' ? <JobTable admin={false} jobData={data} /> : (null)}
            </div>
            <UpdateAdmin open={role === 'admin' && open} setOpen={setOpen} setUser={setProfile} />
            <UpdateStudent open={role === 'student' && open} setOpen={setOpen} setUser={setProfile} dispatch={dispatch} />
        </div>
    );
};

export default Profile;
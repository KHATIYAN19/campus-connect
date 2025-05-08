import React, { useEffect, useState } from 'react';
import { Contact, Mail, Pen, User, Users, Briefcase, GraduationCap, X, Loader2, ImagePlus, FileText, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import JobTable from '../pages/JobTable';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../LoginSignUp/axios.js';
import { login } from '../redux/authSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

const studentFormSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
    bio: z.string().optional(),
    graduationMarks: z.coerce.number().min(0, { message: 'Marks must be between 0 and 100' }).max(100, { message: 'Marks must be between 0 and 100' }).optional(),
    resume: z.string().url('Invalid URL').optional(),
});

const adminFormSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
    bio: z.string().optional(),
});

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const role = user.role;
    const [profile, setProfile] = useState(user);
    const [data, setData] = useState();
    const [adminData, setAdminData] = useState();
    const userFromRedux = useSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [adminDashboardData, setAdminDashboardData] = useState(null);
    const [selectedCompanies, setSelectedCompanies] = useState();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const initialValues = React.useRef({});

    const studentForm = useForm({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            phone: user?.phone || '',
            bio: user?.profile?.bio || '',
            graduationMarks: user?.profile?.graduationMarks || '',
            resume: user?.profile?.resume || '',
        },
    });

    const adminForm = useForm({
        resolver: zodResolver(adminFormSchema),
        defaultValues: {
            phone: user?.phone || '',
            bio: user?.bio || '',
        },
    });

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
        if (open && user) {
            if (role === 'student') {
                studentForm.reset({
                    phone: user.phone || '',
                    bio: user.profile?.bio || '',
                    graduationMarks: user.profile?.graduationMarks || '',
                    resume: user.profile?.resume || '',
                });
            } else if (role === 'admin') {
                adminForm.reset({
                    phone: user.phone || '',
                    bio: user.bio || '',
                });
            }
            initialValues.current = {
                phone: user.phone || '',
                bio: user.profile?.bio || user.bio || '',
                graduationMarks: user.profile?.graduationMarks || '',
                resume: user.profile?.resume || '',
            };
            setImage(null);
            setLoading(false);
        }
    }, [userFromRedux, open, role, studentForm, adminForm]);

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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const hasChanges = (values) => {
        return Object.keys(values).some((key) => values[key] !== initialValues.current[key]) || image !== null;
    };

    const onSubmitStudent = async (values) => {
        if (!hasChanges(values)) {
            toast.error('No changes detected');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('phone', values.phone);
            formData.append('bio', values.bio);
            formData.append('graduationMarks', values.graduationMarks);
            formData.append('resume', values.resume);
            formData.append('email', user.email);
            if (image) formData.append('image', image);
            const response = await axios.post('/update/user', formData);
            if (response.data.success) {
                toast.success('Profile updated successfully! ✨');
                setProfile(response.data.user);
                dispatch(
                    login({
                        user: response.data.user,
                        token: response.data.token || localStorage.getItem('token'),
                    })
                );
                setOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitAdmin = async (values) => {
        if (!hasChanges(values)) {
            toast.error('No changes detected');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("phone", values.phone);
            formData.append("bio", values.bio);
            formData.append("email", user.email);
            if (image) formData.append('image', image);

            const response = await axios.post('/update/admin', formData);

            if (response.data.success) {
                setProfile(response.data.user);
                toast.success('Profile updated successfully! 🌟');
                dispatch(login({
                    user: response.data.user,
                    token: response.data.token || localStorage.getItem("token")
                }));
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed 😢');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20"></div>
                    <div className="relative p-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                                    <img className="object-cover w-full h-full" src={profile.image} alt="@profileImage" />
                                </div>
                                <div>
                                    <h1 className="font-semibold text-3xl text-gray-800 mb-1">{profile.name}</h1>
                                    <p className="text-gray-600 mb-1">GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT</p>
                                    <p className="text-orange-600 font-medium">{role === 'student' ? 'Student' : 'Admin'}</p>
                                    {role === 'student' && <p className="text-gray-600">Batch: {profile?.year}</p>}
                                </div>
                            </div>
                            <Button onClick={() => setOpen(true)} className="text-orange-600 hover:bg-orange-100 transition-colors rounded-full" variant="outline">
                                <Pen className="mr-2" /> Edit Profile
                            </Button>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="text-orange-500" />
                                <span className="font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Contact className="text-orange-500" />
                                <span className="font-medium">{profile.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    {role === 'student' && (
                        <div className="space-y-4">
                            <div className="text-lg font-semibold text-gray-800">Bio</div>
                            <div className="bg-orange-50 rounded-xl p-4 text-gray-700">
                                {profile?.profile?.bio || <span className="text-gray-500">Not Available</span>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-orange-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">10th %:</span> {profile?.profile?.tenth || 'NA'}%
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">12th %:</span> {profile?.profile?.tweleth || 'NA'}%
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 text-gray-700">
                                    <span className="font-medium">Graduation %:</span> {profile?.profile?.graduationMarks || 'NA'}%
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 text-gray-700 md:col-span-2">
                                    <span className="font-medium">Degree:</span> {profile?.profile?.graduationdegree || 'NA'}
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 text-gray-700 md:col-span-1">
                                    <span className="font-medium">Resume:</span>{' '}
                                    {profile?.profile?.resume ? (
                                        <a href={profile?.profile?.resume} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
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
                            <div className="bg-orange-50 rounded-xl p-4 text-gray-700">
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
                                <li key={index} className="bg-orange-50 rounded-xl p-4 flex items-center shadow-sm border border-orange-100">
                                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                        <img src={application?.company?.logo} alt={`${application?.company?.company} Logo`} className="object-contain w-full h-full" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{application?.company?.company}</h3>
                                        <p className="text-gray-600 text-sm">{application?.company?.location}</p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="font-medium text-orange-700"><span className='text-green-500'>INR</span> {application?.company?.salary || 'NA'} LPA</span>
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
                    <h2 className="font-bold text-3xl text-gray-800 mb-8 text-orange-700">Admin Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div className="bg-orange-50 rounded-xl p-6 shadow-md border border-orange-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-orange-700 mb-2"><User className="inline-block mr-2" size={20} /> Total Admins</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalAdmins}</p>
                            </div>
                            <div className="text-orange-400 text-5xl opacity-70"><User size={60} /></div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6 shadow-md border border-orange-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-orange-700 mb-2"><Users className="inline-block mr-2" size={20} /> Total Students</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalStudents}</p>
                            </div>
                            <div className="text-orange-400 text-5xl opacity-70"><Users size={60} /></div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6 shadow-md border border-orange-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-orange-700 mb-2"><Briefcase className="inline-block mr-2" size={20} /> Total Offers</h3>
                                <p className="text-3xl font-bold text-gray-800">{adminDashboardData.totalOffers}</p>
                            </div>
                            <div className="text-orange-400 text-5xl opacity-70"><Briefcase size={60} /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-orange-50 rounded-xl p-6 shadow-md border border-orange-200">
                            <h3 className="font-semibold text-xl text-orange-700 mb-4"><GraduationCap className="inline-block mr-2" size={20} /> Graduated Students by Year</h3>
                            {adminDashboardData.graduatedStudentsByYear.length > 0 ? (
                                <div className="space-y-3">
                                    {adminDashboardData.graduatedStudentsByYear.map((item) => (
                                        <div key={item.year} className="flex items-center gap-4">
                                            <span className="text-gray-700 font-medium">{item.year}:</span>
                                            <div className="rounded-full h-6 flex-grow overflow-hidden bg-orange-100">
                                                <div
                                                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full text-white font-semibold flex items-center justify-center"
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

                        <div className="bg-orange-50 rounded-xl p-6 shadow-md border border-orange-200">
                            <h3 className="font-semibold text-xl text-orange-700 mb-4"><Briefcase className="inline-block mr-2" size={20} /> Unique Selected Students by Batch</h3>
                            {adminDashboardData.batchwiseUniqueSelectedStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {adminDashboardData.batchwiseUniqueSelectedStudents.map((item) => (
                                        <div key={item.batch} className="flex items-center gap-4">
                                            <span className="text-gray-700 font-medium">Batch {item.batch}:</span>
                                            <div className="rounded-full h-6 flex-grow overflow-hidden bg-orange-100">
                                                <div
                                                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full text-white font-semibold flex items-center justify-center"
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
                    </div>
                </div>
            )}
            {role === 'student' && (
                <div className="max-w-4xl mx-auto bg-white rounded-3xl mt-8 shadow-2xl overflow-hidden p-8">
                    <h1 className="font-bold text-2xl text-gray-800 mb-6">Applied Jobs</h1>
                    <JobTable admin={false} jobData={data} />
                </div>
            )}

            {/* Update Profile Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl p-8 shadow-2xl border border-orange-200">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-orange-600 text-center mb-6">
                            {role === 'student' ? '🎓 Update Profile' : '✨ Update Profile'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={role === 'student' ? studentForm.handleSubmit(onSubmitStudent) : adminForm.handleSubmit(onSubmitAdmin)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-orange-600">
                                <Phone className="h-5 w-5" />
                                <Label className="font-medium">Phone Number</Label>
                            </div>
                            <Input
                                {...(role === 'student' ? studentForm.register("phone") : adminForm.register("phone"))}
                                className="rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 h-12 px-4 text-orange-800 text-sm"
                                placeholder="Enter 10-digit phone number"
                            />
                            {(role === 'student' && studentForm.formState.errors.phone) || (role === 'admin' && adminForm.formState.errors.phone) ? (
                                <p className="text-red-400 text-sm mt-1 ml-1">
                                    {(role === 'student' ? studentForm.formState.errors.phone?.message : adminForm.formState.errors.phone?.message)}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-orange-600 font-medium">Profile Image</Label>
                            <label className="cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2 p-3 border-2 border-dashed border-orange-100 rounded-xl group-hover:border-orange-300 transition-all">
                                    <ImagePlus className="h-5 w-5 text-orange-400 group-hover:text-orange-500" />
                                    <span className="text-orange-500 text-xs">{image ? image.name : 'Upload'}</span>
                                </div>
                            </label>
                            {image && (
                                <div className="mt-2 relative w-full h-48 overflow-hidden rounded-md">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 text-red-400" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center gap-2 text-orange-600">
                                <Pen className="h-5 w-5" />
                                <Label className="font-medium">Bio</Label>
                            </div>
                            <textarea
                                {...(role === 'student' ? studentForm.register("bio") : adminForm.register("bio"))}
                                className="w-full rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 h-24 text-orange-800 placeholder-orange-300 text-sm"
                                placeholder="Share something about yourself..."
                            />
                            {(role === 'student' && studentForm.formState.errors.bio) || (role === 'admin' && adminForm.formState.errors.bio) ? (
                                <p className="text-red-400 text-sm mt-1 ml-1">
                                    {(role === 'student' ? studentForm.formState.errors.bio?.message : adminForm.formState.errors.bio?.message)}
                                </p>
                            ) : null}
                        </div>

                        {role === 'student' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <GraduationCap className="h-5 w-5" />
                                        <Label className="font-medium">Graduation Marks (%)</Label>
                                    </div>
                                    <Input
                                        type="number"
                                        {...studentForm.register("graduationMarks")}
                                        className="rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 h-12 px-4 text-orange-800 text-sm"
                                        placeholder="Enter your graduation marks"
                                    />
                                    {studentForm.formState.errors.graduationMarks && (
                                        <p className="text-red-400 text-sm mt-1 ml-1">
                                            {studentForm.formState.errors.graduationMarks?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <FileText className="h-5 w-5" />
                                        <Label className="font-medium">Resume URL</Label>
                                    </div>
                                    <Input
                                        {...studentForm.register("resume")}
                                        className="rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 h-12 px-4 text-orange-800 text-sm"
                                        placeholder="Enter your resume URL"
                                    />
                                    {studentForm.formState.errors.resume && (
                                        <p className="text-red-400 text-sm mt-1 ml-1">
                                            {studentForm.formState.errors.resume?.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 rounded-xl text-lg font-semibold shadow-lg hover:shadow-orange-200 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    'Save Changes 🌈'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
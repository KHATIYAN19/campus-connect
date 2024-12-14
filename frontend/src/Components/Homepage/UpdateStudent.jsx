import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../LoginSignUp/axios';

const UpdateStudent = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [tenth, setTenth] = useState(user?.profile?.tenth);
    const [tweleth, setTweleth] = useState(user?.profile?.tweleth);
    const [graduationMarks, setGraduationMarks] = useState(user?.profile?.graduationMarks);
    const [image, setImage] = useState('');
    const [bio, setBio] = useState(user?.profile?.bio);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [resume, setResume] = useState(user?.profile?.resume);
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        console.log(image);
    };
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('email', email);
        data.append('phone', phone);
        data.append('image', image);
        data.append('resume', resume);
        data.append('tenth', tenth);
        data.append('tweleth', tweleth);
        data.append('graduationMarks', graduationMarks);
        data.append('bio', bio);

        try {
            const response = await axios.post('http://localhost:8080/update/user', data);
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }

    }

    return (
        <div>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        role="dialog"
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 p-6 relative"
                    >
                        {/* Dialog Header */}
                        <div className="text-center mb-6">
                            <h2
                                id="dialog-title"
                                className="text-[#4d002d] text-lg font-bold"
                            >
                                Update Profile
                            </h2>
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitHandler}>
                            <div className="grid gap-4 py-4 text-gray-700">
                                {/* Phone Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="number" className="text-right">
                                        PhoneNo
                                    </Label>
                                    <Input
                                        id="number"
                                        name="number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Bio Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="bio" className="text-right">
                                        Bio
                                    </Label>
                                    <Input
                                        id="bio"
                                        name="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Tenth Marks Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="10th percentage" className="text-right">
                                        Tenth
                                    </Label>
                                    <Input
                                        id="10th percentage"
                                        name="10th percentage"
                                        type="number"
                                        min="50"
                                        max="100"
                                        value={tenth}
                                        onChange={(e) => setTenth(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Twelfth Marks Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="12-score" className="text-right">
                                        Twelfth
                                    </Label>
                                    <Input
                                        id="12-score"
                                        name="12-score"
                                        type="number"
                                        min="50"
                                        max="100"
                                        value={tweleth}
                                        onChange={(e) => setTweleth(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Graduation Marks Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="graduation-score" className="text-right">
                                        Graduation Marks
                                    </Label>
                                    <Input
                                        id="graduation-score"
                                        name="graduation-score"
                                        type="number"
                                        min="50"
                                        max="100"
                                        value={graduationMarks}
                                        onChange={(e) => setGraduationMarks(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Profile Image Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="image" className="text-right">
                                        Profile
                                    </Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        type="file"
                                        onChange={handleImageChange}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>

                                {/* Resume Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="file" className="text-right">
                                        Resume
                                    </Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="url"
                                        value={resume}
                                        onChange={(e) => setResume(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                    />
                                </div>
                            </div>

                            {/* Dialog Footer */}
                            <div className="mt-6">
                                {loading ? (
                                    <button
                                        disabled
                                        className="w-full bg-gray-500 text-white py-2 rounded-xl flex items-center justify-center"
                                    >
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Please wait
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="w-full bg-[#66003c] text-white py-2 rounded-xl hover:bg-[#4d002d]"
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default UpdateStudent;
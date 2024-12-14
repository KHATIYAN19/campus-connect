import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../LoginSignUp/axios';

const UpdateAdmin = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    //const { user } = useSelector(store => store.LoginSignUp);
    const user = JSON.parse(localStorage.getItem('user'));
    const [bio, setBio] = useState(user?.profile?.bio);
    const [phone, setPhone] = useState(user.phone);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        console.log(image);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("bio", bio);
        formData.append("email", user.email);
        formData.append('image', image);
        try {
            const response = await axios.post('http://localhost:8080/update/admin', formData);
            console.log(response, "res");
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setOpen(false);
                window.location.reload();

            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response.data.message);
        }
        setOpen(false);
    }

    return (
        <div>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div
                        role="dialog"
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        className="sm:max-w-[420px] bg-white rounded-2xl p-6 relative shadow-lg w-full max-w-md"
                    >
                        {/* Dialog Header */}
                        <div className="flex flex-col items-center">
                            <h2
                                id="dialog-title"
                                className="text-center text-[#4d002d] text-lg font-bold mb-6"
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

                        <form onSubmit={submitHandler}>
                            <div className="grid gap-4 py-4 text-gray-800">
                                {/* Phone Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="number" className="text-right">
                                        PhoneNo
                                    </Label>
                                    <Input
                                        id="number"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="col-span-3 rounded-xl border border-gray-300 p-2"
                                        type="text"
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
                                        type="text"
                                    />
                                </div>
                                {/* Image Upload */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="image" className="text-right">
                                        Image
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
                            </div>

                            {/* Dialog Footer */}
                            <div className="mt-6">
                                {loading ? (
                                    <Button className="w-full bg-gray-500 text-white py-2 rounded-xl flex items-center justify-center">
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#66003c] text-white py-2 rounded-xl"
                                    >
                                        Update
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );

}
export default UpdateAdmin;
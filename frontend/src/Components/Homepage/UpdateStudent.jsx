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
    const[phone,setPhone]=useState(user.phone);
    const[email,setEmail]=useState(user.email);
    const [resume, setResume] = useState(user?.profile?.resume);
    const handleImageChange = (e) => {
        setImage( e.target.files[0] );
        console.log(image);
    };
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('email',email);
        data.append('phone', phone);
        data.append('image', image);
        data.append('resume', resume);
        data.append('tenth', tenth);
        data.append('tweleth', tweleth);
        data.append('graduationMarks', graduationMarks);
        data.append('bio',bio);
        
        try {
            const response = await axios.post('http://localhost:8080/update/user', data);
            if(response.data.success){
                toast.success(response.data.message);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setOpen(false);
            }
        }catch(error) {
            toast.error(error.response.data.message);
        }
        
    }

    return (
        <div>
            <Dialog open={open} >
                <DialogContent className='sm:max-w-[420px] bg-white rounded-2xl' onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className='text-center text-[#4d002d]'>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler} action="">
                        <div className='grid gap-4 py-4 text-gray-700'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='number' className='text-right'>PhoneNo</Label>
                                <Input
                                    id='number'
                                    name='number'
                                    value={phone}
                                    onChange = {(e) => { setPhone(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='bio' className='text-right'>Bio</Label>
                                <Input
                                    id='bio'
                                    name='bio'
                                    value={bio}
                                    onChange = {(e) => { setBio(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='10th percentage' className='text-right'>Tenth</Label>
                                <Input
                                    id='10th percentage'
                                    name='10th percentage'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={tenth}
                                    onChange = {(e) => { setTenth(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='12-score' className='text-right'>Tweleth</Label>
                                <Input
                                    id='12-score'
                                    name='12-score'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={tweleth}
                                    onChange = {(e) => { setTweleth(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='graduation-score' className='text-right'>Graduation Marks</Label>
                                <Input
                                    id='graduation-score'
                                    name='graduation-score'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={graduationMarks}
                                    onChange = {(e) => { setGraduationMarks(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='image' className='text-right'>Profile</Label>
                                <Input
                                    id='image'
                                    name='image'
                                    accept='image/*'
                                    type='file'
                                    onChange={handleImageChange}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='file' className='text-right'>Resume</Label>
                                <Input
                                    id='file'
                                    name='file'
                                    type='url'
                                    value={resume}
                                    onChange = {(e) => { setResume(e.target.value); }}
                                    className='col-span-3'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type='submit' className='bg-[#66003c] w-full my-4 text-white hover:text-black'>Update</Button>
                            }

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateStudent;
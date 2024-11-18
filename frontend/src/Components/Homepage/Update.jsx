import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios';

const Update = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.LoginSignUp);
    const [input, setInput] = useState({
        phone: user?.phone,
        bio: user?.profile?.bio,
        tenth: user?.profile?.tenth,
        twelfth: user?.profile?.twelfth,
        graduationMarks: user?.profile?.graduationMarks,
        image: user?.profile?.image || null,
        file: user?.profile?.resume
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const {name, type, value, files} = e.target;
        if(type === 'file'){
            setInput({...input, [name]:files[0]});
        }else{
            setInput({...input, [name]:value});
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("phone", input.phone);
        formData.append("bio", input.bio);
        if(input.file){
            formData.append('file', input.file);
        }
        try {
            const res = await axios.post('http://localhost:8080/profile/update', formData, {
                headers:{
                    'Content-type':'multipart/form-data'
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        }catch(error) {
            console.error('Error submitting form:',error);
            toast.error(error.response.data.message);
        }
        setOpen(false);
        console.log(input);
    }

    return (
        <div>
            <Dialog open={open} >
                <DialogContent className='sm:max-w-[420px] bg-white rounded-2xl' onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className='text-center'>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler} action="">
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='number' className='text-right'>PhoneNo</Label>
                                <Input
                                    id='number'
                                    name='number'
                                    value={input.phone}
                                    onChange = {changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='bio' className='text-right'>Bio</Label>
                                <Input
                                    id='bio'
                                    name='bio'
                                    value={input.bio}
                                    onChange = {changeEventHandler}
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
                                    value={input.tenth}
                                    onChange = {changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='12-score' className='text-right'>Twelfth</Label>
                                <Input
                                    id='12-score'
                                    name='12-score'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={input.twelfth}
                                    onChange = {changeEventHandler}
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
                                    value={input.graduationMarks}
                                    onChange = {changeEventHandler}
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
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='file' className='text-right'>Resume</Label>
                                <Input
                                    id='file'
                                    name='file'
                                    type='url'
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type='submit' className='bg-gray-400 w-full my-4'>Update</Button>
                            }

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Update
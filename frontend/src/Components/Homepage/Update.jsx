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
        score10: user?.profile?.score10,
        score12: user?.profile?.score12,
        graduation : user?.profile?.graduation,
        file: user?.profile?.resume || null
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({...input,[e.target.name]:e.target.value})
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({...input, file})
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
            console.log(error);
            toast.error(error.response.data.message);
        }
        setOpen(false);
        console.log(input);
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className='sm:max-w-[425px] bg-white' onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
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
                                <Label htmlFor='10th percentage' className='text-right'>10th percentage</Label>
                                <Input
                                    id='10th percentage'
                                    name='10th percentage'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={input.score10}
                                    onChange = {changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='12-score' className='text-right'>12th percentage</Label>
                                <Input
                                    id='12-score'
                                    name='12-score'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={input.score12}
                                    onChange = {changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='graduation-score' className='text-right'>Graduation Score</Label>
                                <Input
                                    id='graduation-score'
                                    name='graduation-score'
                                    type='number'
                                    min='50'
                                    max='100'
                                    value={input.graduation}
                                    onChange = {changeEventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='file' className='text-right'>Resume</Label>
                                <Input
                                    id='file'
                                    name='file'
                                    type='file'
                                    accept='application/pdf'
                                    onChange={fileChangeHandler}
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
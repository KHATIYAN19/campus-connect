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
    const[phone,setPhone]=useState(user.phone);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        setImage( e.target.files[0] );
        console.log(image);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("bio", bio);
        formData.append("email",user.email);
        formData.append('image', image);
        try {
            const response = await axios.post('http://localhost:8080/update/admin', formData);
            console.log(response,"res");
            if(response.data.success){
                toast.success(response.data.message);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setOpen(false);
                window.location.reload();
                
            }
        }catch(error) {
            console.error('Error submitting form:',error);
            toast.error(error.response.data.message);
        }
        setOpen(false);
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
                                    name='phone'
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
                                <Label htmlFor='image' className='text-right'>Image</Label>
                                <Input
                                    id='image'
                                    name='image'
                                    accept='image/*'
                                    type='file'
                                    onChange={handleImageChange}
                                    className='col-span-3'
                                />
                            </div>
                            {/* <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='file' className='text-right'>JD</Label>
                                <Input
                                    id='file'
                                    name='file'
                                    type='url'
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                />
                            </div> */}
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

export default UpdateAdmin;
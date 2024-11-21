import React from 'react'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import image_icon from '../Assets/photo.png'
import key_icon from '../Assets/key.webp'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';
const SignupAdmin = ({setAdmin}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [adminkey, setAdminKey] = useState('');
    const [image, setImage] = useState('');
    const handleImageChange = (e) => {
        setImage( e.target.files[0] );
    };
    const handleSignUp = async (e) => {

        e.preventDefault();
        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        data.append('image', image);
        data.append('phone', phone);
        data.append('adminkey', adminkey);
        try {
            const response = await axios.post('http://localhost:8080/signup/admin', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const signup = response.data.success;
            if (signup) {
                toast.warning(response.data.Data.name.toUpperCase() + " Verify your Account");
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
           console.log(error);
        }
    };
  return (
    <div className='container'>
            <div className="header">
                <div className="text">SIGNUP <span className='text-lg'>(Admin)</span></div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={handleSignUp} >
                <div className="input">
                    <img src={user_icon} alt="user_icon" />
                    <input type="text" placeholder='Name' value={name} onChange={(e) => { setName(e.target.value); }} />
                </div>
                <div className="input">
                    <img src={email_icon} alt="email_icon" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={phone_icon} alt="phone_icon" width="22" height="20" />
                    <input type="tel" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="password_icon" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={key_icon} alt="key_icon" width={28} height={30}/>
                    <input type="text" placeholder='Admin key' value={adminkey} onChange={(e)=>setAdminKey(e.target.value)}/>
                </div>
                <div className='input'>
                    <img src={image_icon} alt='image-icon' width='23' height="21" />
                    <Input
                        accept='image/*'
                        type='file'
                        className='cursor-pointer'
                        onChange={handleImageChange} 
                    />
                </div>
                <div className='text-lg flex items-center gap-3 my-4 ml-9'>
                    <p className="text-gray-700">Click here for signup</p>
                    <div
                        className='text-red-500 cursor-pointer font-semibold'
                        onClick={() => setAdmin(false)}>
                        Student
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submitBtn">
                        Submit
                    </button>
                    <div className={"submit gray"}>
                        <NavLink to="/login">Login</NavLink>
                    </div>
                </div>
            </form>
        </div>
  );
}
export default SignupAdmin;
import React, { useState } from 'react'
import { NavLink,useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'
import image_icon from '../Assets/photo.png'
import degree_icon from '../Assets/degree.png'
import cv_icon from '../Assets/cv.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';
const SignupStudent = ({ setAdmin}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [tenth, setTenth] = useState('');
    const [tweleth, setTweleth] = useState('');
    const [graduationdegree, setGraduationDegree] = useState('');
    const [graduationMarks, setGraduationMarks] = useState('');
    const [year, setYear] = useState('');
    const [image, setImage] = useState('');
    const [resume, setResume] = useState('');
    const handleImageChange = (e) => {
        setImage( e.target.files[0] );
        console.log(image);
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        const data = new FormData();
       data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        data.append('image', image);
        data.append('phone', phone);
        data.append('resume', resume);
        data.append('tenth', tenth);
        data.append('tweleth', tweleth);
        data.append('graduationdegree', graduationdegree);
        data.append('year', year);
       data.append('graduationMarks', graduationMarks);
      
        try {
            const response = await axios.post('http://localhost:8080/signup/student', data, {
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
        }
    };
    return (
        <div className='container'>
            <div className="header">
                <div className="text">SIGNUP <span className='text-lg'>(Student)</span> </div>
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
                <div className="input">
                    <img src={year_icon} alt="year_icon" width="22" height="20" />
                    <input type="number"  placeholder='Year' value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className='input' style={{ padding: '10px' }}>
                    <div style={{ flex: '1', padding: '10px' }}>
                        <input type='number' step={0.01} min={50} max={100} placeholder='Tenth' style={{ width: "100%" }} value={tenth} onChange={(e) => setTenth(e.target.value)}/>
                    </div>
                    <div style={{ flex: '1' }}>
                        <input type='number' step={0.01} min={50} max={100} placeholder='Twelfth' style={{ width: '100%'}} value={tweleth} onChange={(e) => setTweleth(e.target.value)} />
                    </div>
                </div>
                <div className='input'>
                    <img src={degree_icon} alt="degree_icon" width={28} height={30} />
                    <input type="text" placeholder='Graduation Degree' value={graduationdegree}  onChange={(e) => setGraduationDegree(e.target.value)}/>
                </div>
                <div className='input' style={{ padding: '20px' }}>
                    <input type="number" min={50} max={100} placeholder='Graduation Marks' value={graduationMarks} onChange={(e) => setGraduationMarks(e.target.value)}/>
                </div>
                <div className='input'>
                    <img src={cv_icon} alt='image-icon' placeholder='Enter Resume Link' width='28' height="30" />
                    <Input
                        type='url'
                        value={resume}
                        className='cursor-pointer'
                        onChange={(e) => setResume(e.target.value)}
                    />
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
                        onClick={() => setAdmin(true)}>
                        Admin
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

export default SignupStudent;
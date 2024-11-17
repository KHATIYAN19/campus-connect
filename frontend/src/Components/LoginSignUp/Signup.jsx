import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'
import image_icon from '../Assets/photo.png'
import degree_icon from '../Assets/degree.png'
import key_icon from '../Assets/key.webp'
import cv_icon from '../Assets/cv.png'
import position_icon from '../Assets/position.png'
import secret_key_icon from '../Assets/secret.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';
const Signup = ({ }) => {
    const [role, setRole] = useState('student');
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [adminkey, setAdminKey] = useState('');
    const [position, setPosition] = useState('');
    const [score10, setScore10] = useState('');
    const [score12, setScore12] = useState('');
    const [degree, setDegree] = useState('');
    const [score, setScore] = useState('');
    const [year, setYear] = useState('');
    const [key, setKey] = useState('');
    const [image, setImage] = useState('');
    const [resume, setResume] = useState('');
    const handleSignUp = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/signup', {
                name,
                email,
                phone,
                password,
                adminKey,
                position,
                score10,
                score12,
                degree,
                score,
                year,
                key
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
                <div className="text">SIGNUP</div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={handleSignUp} >
                <div className="input">
                    <img src={user_icon} alt="user_icon" />
                    <input type="text" placeholder='Name' value={name} onChange={(e) => { setName(e.target.value); }} />
                </div>
                <div className="input">
                    <img src={email_icon} alt="email_icon" />
                    <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
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
                    <input type="text" placeholder='Admin key'/>
                </div>
                <div className='input'>
                <img src={position_icon} alt="position_icon" width={28} height={30}/>
                    <input type="text" placeholder='Position'/>
                </div>
                <div className="input">
                    <img src={year_icon} alt="year_icon" width="22" height="20" />
                    <input type="number" min={1} max={4} placeholder='Year' value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className='input' style={{ padding: '10px' }}>
                    <div style={{ flex: '1', padding: '10px' }}>
                        <input type='number' step={0.01} min={50} max={100} placeholder='10th percentage' style={{ width: "100%" }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <input type='number' step={0.01} min={50} max={100} placeholder='12th percentage' style={{ width: '100%' }} />
                    </div>
                </div>
                <div className='input'>
                    <img src={degree_icon} alt="degree_icon" width={28} height={30} />
                    <input type="text" placeholder='Graduation Degree' />
                </div>
                <div className='input' style={{ padding: '20px' }}>
                    <input type="number" min={50} max={100} placeholder='Degree Percentage' />
                </div>
                <div className="input">
                    <img src={secret_key_icon} alt="secret_key_icon" width={28} height={30} />
                    <input type="text" placeholder='Secret Key for Reset Password' value={key} onChange={(e) => setKey(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={image_icon} alt='image-icon' width='23' height="21" />
                    <Input
                        accept='image/*'
                        type='file'
                        className='cursor-pointer'
                    />
                </div>
                <div className='input'>
                    <img src={cv_icon} alt='image-icon' width='28' height="30" />
                    <Input
                        accept='application/pdf'
                        type='file'
                        className='cursor-pointer'
                    />
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

export default Signup;
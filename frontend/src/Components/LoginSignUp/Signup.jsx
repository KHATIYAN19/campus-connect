import React, { useState } from 'react'
import {NavLink} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'
import axios from 'axios';
import { toast } from 'react-toastify'
const Signup = ({}) => {
    const navigate=useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [year, setYear] = useState('');
    const [role, setRole] = useState('');
    const [key,setKey]=useState('');
    const handleSignUp = async (e) => {
       
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/signup', {
                name,
                email,
                phone,
                password,
                year,
                role,
                key
            });
            const signup=response.data.success;
            if(signup){
                 toast.success(response.data.Data.name.toUpperCase() + " Signup Successfully");
                 navigate("/login");
            }else{
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
                    <input type="text" placeholder='Name' value={name} onChange={(e) => {setName(e.target.value); }} />
                </div>
                <div className="input">
                    <img src={email_icon} alt="email_icon" />
                    <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={phone_icon} alt="phone_icon" width="28" height="20" />
                    <input type="tel" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="password_icon" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input">
                    <img src={year_icon} alt="year_icon" width="32" height="23" />
                    <input type="number" placeholder='Year' value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="input">
                   <img src={year_icon} alt="year_icon" width="32" height="23" />
                <img src={password_icon} alt="password_icon" />
                    <input type="text" placeholder='Secret Key for Reset Password' value={key} onChange={(e) => setKey(e.target.value)} />
                </div>
                <div className="input">
                    <img src={user_icon} alt="password_icon" />
                    <select className='dropdown' placeholder='Role' value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                    </select>
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
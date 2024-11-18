import React, { useState } from 'react'
import './LoginSignUp.css'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { NavLink } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Button } from '../ui/button'

const Login = ({ }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password
            });
            const login = response.data.success;
            if (login) {
                localStorage.setItem("isLogin", true);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.user.role);
                toast.success("WELCOME BACK " + (response.data.user.name).toUpperCase());
                console.log(JSON.parse(localStorage.getItem("user")));
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleNavigation= (path) => {
        navigate(path);
    }

    return (
        <div className='container'>
            <div className="header">
                <div className="text  ">LOGIN</div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={handleLogin}  >

                <div className="input">
                    <img src={email_icon} alt="email_icon" />
                    <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input">
                    <img src={password_icon} alt="password_icon" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {<div className="text-left px-10 mt-5 font-medium text-yellow-800"><NavLink to="/reset-password">Forgot Password?</NavLink></div>}
                <div className="flex justify-center items-center mt-5 mb-8">
                    <Button className="bg-yellow-600 text-lg rounded-xl w-80 py-6 text-white font-bold hover:text-yellow-950">Submit</Button>
                </div>

            </form>
            <div className='text-center'>Don't have an account?
                <span className='text-yellow-800 pl-4 cursor-pointer font-semibold hover:text-yellow-600' onClick={handleNavigation('/signupAdmin')}>Signup Admin</span> 
                <span className='text-yellow-800 pl-4 cursor-pointer font-semibold hover:text-yellow-600' onClick={handleNavigation('/signupStudent')}>Signup Student</span>
            </div>

        </div>
    )
};

export default Login;
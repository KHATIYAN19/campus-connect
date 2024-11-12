import React, {useState} from 'react'
import './LoginSignUp.css'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { NavLink } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = ({}) => {
    const navigate=useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/login', {
            email,
            password
        });
        const login=response.data.success;
        if(login){
            localStorage.setItem("isLogin",true);
            localStorage.setItem("user",JSON.stringify(response.data.user));
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("role",response.data.user.role);
             toast.success("WELCOME BACK " + (response.data.user.name).toUpperCase());
             console.log(JSON.parse(localStorage.getItem("user")));
             navigate("/");
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
        <div className="submit-container">
        <div className="submit-container">
                    <button type="submit" className="submitBtn">
                        Submit
                    </button>
                    <div className={"submit gray"}>
                         <NavLink to="/signup">Signup</NavLink>
                    </div>
                </div>
    </div>
  
  </form>
  
  { <div className="forget-password">Forgot Password?<span> <NavLink to="/reset-password"> Click Here!</NavLink></span></div>}
    
</div>
  )
};

export default Login;
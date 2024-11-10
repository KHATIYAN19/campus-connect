import React, {useState} from 'react'
import './LoginSignUp.css'
import { useNavigate } from 'react-router-dom'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
const ResetPassword = () => {
    const navigate=useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [key,setKey]=useState('');
  const ResetHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/reset', {
            email,
            password,
            key
        });
        console.log(response.data);
        const success=response.data.success;
        if(success){
             toast.success(response.data.message);
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
        <div className="text">Reset Password</div>
        <div className="underline"></div>
    </div>
    <form className="inputs" onSubmit={ResetHandler}  >
       
        <div className="input">
            <img src={email_icon} alt="email_icon" />
            <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
       
        <div className="input">
            <img src={password_icon} alt="password_icon" />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input">
            <img src={password_icon} alt="password_icon" />
            <input type="text" placeholder='Secret Key' value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div className="submit-container">
        <div className="submit-container">
                    <button type="submit" className="submitBtn">
                        Submit
                    </button>
                    <div className={"submit gray"}>
                         <NavLink to="/login">Login</NavLink>
                    </div>
                </div>
    </div>
  </form>
</div>
  )
};
export default ResetPassword;

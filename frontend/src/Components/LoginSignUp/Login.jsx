import React, {useState} from 'react'
import './LoginSignUp.css'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import axios from 'axios';
import { toast } from 'react-toastify';
const Login = ({setLogin}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/login', {
            email,
            password
        });
        console.log(" response" ,response);
        const login=response.data.success;
        console.log(login ,"login");
        console.log(response.data.message);
        if(login){
             toast.success("welcome back " + (response.data.user.name).toUpperCase());
             setLogin(true);
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
        <div className="text">Login</div>
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
                    <div
                        className={"submit gray"}
                        onClick={()=>setLogin(false)}
                    >
                        SignUp
                    </div>
                </div>
    </div>
  
  </form>
  
  { <div className="forget-password">Forgot Password?<span> Click Here!</span> </div>}
    
</div>
  )
};

export default Login;

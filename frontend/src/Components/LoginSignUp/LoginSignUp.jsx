import React, {useState} from 'react'
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action==="Login"?<div></div>:
            <div className="input">
            <img src={user_icon} alt="user_icon" />
            <input type="text" placeholder='Name'/>
        </div>}
            <div className="input">
                <img src={email_icon} alt="email_icon" />
                <input type="email" placeholder='Email Id'/>
            </div>
            {action==='Login'?<div></div>:<div className="input">
                <img src={phone_icon} alt="phone_icon" width="28" height="20"/>
                <input type="tel" placeholder='Phone'/>
            </div>}
            <div className="input">
                <img src={password_icon} alt="password_icon" />
                <input type="password" placeholder='Password'/>
            </div>
            {action==="Login"?<div></div>:<div className="input">
                <img src={year_icon} alt="year_icon" width="32" height="23"/>
                <input type="year" placeholder='Year'/>
            </div>}
            {action==="Login"?<div></div>:<div className="input">
                <img src={user_icon} alt="password_icon" />
                <select className='dropdown' placeholder='Role'>
                    <option value="" disabled selected>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                </select>
            </div>}
        </div>
        {action==="Sign Up"?<div></div>:<div className="forget-password">Forgot Password?<span> Click Here!</span> </div>}
        <div className="submit-container">
            <div className={action==="Login"?"submit gray":"submit"} onClick={() => {setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={() => {setAction("Login")}}>Login</div>
        </div>
    </div>
  );
}

export default LoginSignUp;

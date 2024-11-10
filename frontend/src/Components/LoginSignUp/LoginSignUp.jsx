import React, {useState} from 'react'
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'
import axios from 'axios';

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [role, setRole] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('https://localhost:8080/signup',{
            name,
            email,
            phone,
            password,
            year,
            role
        });
        console.log('Sign up successful:', response.data);

        setAction("Login");
    } catch(error) {
        console.error('Error during sign-up:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:8080/login', {
            email,
            password
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Error during login:', error);
    }
  };

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={action==='Sign Up'?handleSignUp : handleLogin}>
            {action==="Login"?<div></div>:
            <div className="input">
            <img src={user_icon} alt="user_icon" />
            <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>}
            <div className="input">
                <img src={email_icon} alt="email_icon" />
                <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {action==='Login'?<div></div>:<div className="input">
                <img src={phone_icon} alt="phone_icon" width="28" height="20"/>
                <input type="tel" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>}
            <div className="input">
                <img src={password_icon} alt="password_icon" />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {action==="Login"?<div></div>:<div className="input">
                <img src={year_icon} alt="year_icon" width="32" height="23"/>
                <input type="number" placeholder='Year' value={year} onChange={(e) => setYear(e.target.value)} />
            </div>}
            {action==="Login"?<div></div>:<div className="input">
                <img src={user_icon} alt="password_icon" />
                <select className='dropdown' placeholder='Role' value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                </select>
            </div>}
            <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => { setAction("Sign Up") }}>
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => { setAction("Login") }}>
            Login
          </div>
        </div>
        {/* Submit the form when the action is either Sign Up or Login */}
      </form>
      <button type="submit" className="submitBtn">
          {/* {action === "Sign Up" ? "Sign Up" : "Login"} */}
          Submit
        </button>
      {action === "Login" && <div className="forget-password">Forgot Password?<span> Click Here!</span> </div>}
        
    </div>
  );
}

export default LoginSignUp;

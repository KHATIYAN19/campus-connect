import React from 'react'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import image_icon from '../Assets/photo.png'
import key_icon from '../Assets/key.webp'
import position_icon from '../Assets/position.png'
import secret_key_icon from '../Assets/secret.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';

const SignupAdmin = () => {
  const [isAdmin, setIsAdmin] = useState('false');
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [adminkey, setAdminKey] = useState('');
    const [position, setPosition] = useState('');
    const [key, setKey] = useState('');
    const [image, setImage] = useState('');
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
                    <input type="text" placeholder='Admin key' value={adminkey}/>
                </div>
                <div className='input'>
                <img src={position_icon} alt="position_icon" width={28} height={30}/>
                    <input type="text" placeholder='Position' value={position}/>
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
                        value={image}
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

export default SignupAdmin;
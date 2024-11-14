import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import year_icon from '../Assets/year.png'
import axios from "./axios.js"
import { toast } from 'react-toastify'
const JobPost = ({}) => {
    const navigate=useNavigate();
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [testdate, setTestdate] = useState('');
    const [numbers, setNumbers] = useState('');
    const JobPostHandler = async (e) => {
        e.preventDefault();
        try {
            console.log(testdate);
            const response = await axios.post('/jobs/post', {
                description,
                salary,
                position,
                location,
                company,
                testdate,
                numbers
            });
            const posted=response.data.success;
            if(posted){
                 toast.success("Job posted successfully");
                 navigate("/");
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    };
    return (
        <div className='container'>
            <div className="header">
                <div className="text">JOB POST</div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={JobPostHandler} >
                <div className="input">
                    <img src={user_icon} alt="user_icon" />
                    <input type="text" placeholder='Company Name' value={company} onChange={(e) => {setCompany(e.target.value); }} />
                </div>
                <div className="input m-t-2 bg-[#eaeaea]">
                    {/* <img src={email_icon} alt="email_icon" /> */}
                    {/* <input type="text" placeholder='Description' value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                     <textarea className='w-full row-5 col-30 p-2 bg-[#eaeaea] m-y-2 rounded-lg pl-12 border' placeholder='Description' value={description} onChange={(e) => {setDescription(e.target.value); }} name="" id=""></textarea>

                </div>
                <div className="input">
                    <img src={phone_icon} alt="phone_icon" width="28" height="20" />
                    <input type="text" placeholder='Enter Role' value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="password_icon" />
                    <input type="text" placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="input">
                    <img src={year_icon} alt="year_icon" width="32" height="23" />
                    <input type="text" placeholder='Salary' value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                {/* <div className="input">
                    <img src={year_icon} alt="year_icon" width="32" height="23" />
                    <input type="date" placeholder='Date' value={testdate} onChange={(e) => {setTestdate(e.target.value); }} />
                </div> */}
                <div className="input">
                    <img src={year_icon} alt="year_icon" width="32" height="23" />
                    <input type="Number" placeholder='Enter Number of position' value={numbers} onChange={(e) => {setNumbers(e.target.value); }} />
                </div>
                <div className="submit-container">
                    <button type="submit" className="submitBtn">
                        Submit
                    </button>
                    
                </div>
            </form>
        </div>
    );
}

export default JobPost;
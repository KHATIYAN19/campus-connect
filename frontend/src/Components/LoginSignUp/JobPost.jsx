import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import positions_icon from '../Assets/positions.png'
import location_icon from '../Assets/location.png'
import role_icon from '../Assets/role.png'
import salary_icon from '../Assets/salary.png'
import description_icon from '../Assets/info.png'
import jd_icon from '../Assets/JD.png'
import axios from "./axios.js"
import { toast } from 'react-toastify'
import { Input } from '../ui/input';
const JobPost = ({}) => {
    const navigate=useNavigate();
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [testdate, setTestdate] = useState('');
    const [numbers, setNumbers] = useState('');
    const [tenth, setTenth] = useState('');
    const [tweleth, setTweleth] = useState('');
    const [graduationMarks, setGraduationMarks] = useState('');
    const [jd, setJd] = useState('');
    const handleJDChange = (e) => {
        setJd( e.target.files[0] );
        console.log(jd);
    };
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
                numbers,
                tenth,
                twelfth,
                graduationMarks,
                jd
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
                    {/* <img src={description_icon} alt="description_icon" width={20} height={25}/> */}
                    {/* <input type="text" placeholder='Description' value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                     <textarea className='w-full row-5 col-30 p-2 bg-[#eaeaea] m-y-2 rounded-lg pl-12 border' placeholder='Description' value={description} onChange={(e) => {setDescription(e.target.value); }} name="" id=""></textarea>

                </div>
                <div className="input">
                <img src={role_icon} alt="role_icon" width="25" height="18" />
                    <input type="text" placeholder='Enter Role' value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div className="input">
                <img src={location_icon} alt="location_icon" width={25} height={18}/>
                    <input type="text" placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="input">
                <img src={salary_icon} alt="salary_icon" width="25" height="18" />
                    <input type="text" placeholder='Salary' value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className='input' style={{ padding: '10px' }}>
                    <div style={{ flex: '1', padding: '10px' }}>
                        <input type='text' placeholder='10th' style={{ width: "100%" }} value={tenth} onChange={(e) => setTenth(e.target.value)}/>
                    </div>
                    <div style={{ flex: '1' }} >
                        <input type='text' placeholder='12th' style={{ width: '100%'}} value={tweleth} onChange={(e) => setTweleth(e.target.value)}/>
                    </div>
                </div>
                <div className='input' style={{ padding: '20px' }}>
                    <input type="number" min={50} max={100} placeholder='Graduation Marks' value={graduationMarks} onChange={(e) => setGraduationMarks(e.target.value)}/>
                </div>
                {/* <div className="input">
                    <img src={year_icon} alt="year_icon" width="32" height="23" />
                    <input type="date" placeholder='Date' value={testdate} onChange={(e) => {setTestdate(e.target.value); }} />
                </div> */}
                <div className="input">
                <img src={positions_icon} alt="positions_icon" width="25" height="18" />
                    <input type="Number" placeholder='Enter Number of position' value={numbers} onChange={(e) => {setNumbers(e.target.value); }} />
                </div>
                <div className='input'>
                    <img src={jd_icon} alt='jd_icon' width='25' height="18" />
                    <Input
                        accept='application/pdf'
                        type='file'
                        className='cursor-pointer'
                        onChange={handleJDChange}
                    />
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
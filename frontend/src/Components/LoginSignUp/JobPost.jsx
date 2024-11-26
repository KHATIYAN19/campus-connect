import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignUp.css';
import user_icon from '../Assets/person.png';
import positions_icon from '../Assets/positions.png';
import location_icon from '../Assets/location.png';
import role_icon from '../Assets/role.png';
import salary_icon from '../Assets/salary.png';
import description_icon from '../Assets/info.png';
import axios from '../LoginSignUp/axios';
import { toast } from 'react-toastify';

const JobPost = () => {
    const navigate = useNavigate();

    // Form state variables
    const [formData, setFormData] = useState({
        description: '',
        salary: '',
        position: '',
        company: '',
        location: '',
        numbers: '',
        tenth: '',
        tweleth: '',
        graduationMarks: '',
    });

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Form submission handler
    const JobPostHandler = async (e) => {
        e.preventDefault();

        try {
            // Send POST request with formData as payload
            const response = await axios.post('http://localhost:8080/jobs/post', formData, {
                headers: {
                    'Content-Type': 'application/json', // Ensure JSON data is sent
                },
            });

            if (response.data.success) {
                toast.success('Job posted successfully');
                navigate('/'); // Redirect after success
            } else {
                toast.error(response.data.message || 'Failed to post the job.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">JOB POST</div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={JobPostHandler}>
                <div className="input">
                    <img src={user_icon} alt="user_icon" />
                    <input
                        type="text"
                        placeholder="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                    />
                </div>
                <div className="input m-t-2 bg-[#eaeaea]">
                    <img src={description_icon} alt="description_icon" width={20} height={25} />
                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="input">
                    <img src={role_icon} alt="role_icon" width="25" height="18" />
                    <input
                        type="text"
                        placeholder="Enter Role"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    />
                </div>
                <div className="input">
                    <img src={location_icon} alt="location_icon" width={25} height={18} />
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="input">
                    <img src={salary_icon} alt="salary_icon" width="25" height="18" />
                    <input
                        type="text"
                        placeholder="Salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                    />
                </div>
                <div className="input" style={{ padding: '10px' }}>
                    <div style={{ flex: '1', padding: '10px' }}>
                        <input
                            type="text"
                            placeholder="10th"
                            name="tenth"
                            style={{ width: '100%' }}
                            value={formData.tenth}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ flex: '1' }}>
                        <input
                            type="text"
                            placeholder="12th"
                            name="tweleth"
                            style={{ width: '100%' }}
                            value={formData.tweleth}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="input" style={{ padding: '20px' }}>
                    <input
                        type="number"
                        min={50}
                        max={100}
                        placeholder="Graduation Marks"
                        name="graduationMarks"
                        value={formData.graduationMarks}
                        onChange={handleChange}
                    />
                </div>
                <div className="input">
                    <img src={positions_icon} alt="positions_icon" width="25" height="18" />
                    <input
                        type="number"
                        placeholder="Enter Number of Positions"
                        name="numbers"
                        value={formData.numbers}
                        onChange={handleChange}
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
};

export default JobPost;

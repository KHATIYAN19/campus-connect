import React, { useState, useEffect } from 'react';
import JobDetails from './JobDetails';
import axios from "../LoginSignUp/axios.js";
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const Jobs = () => {
    const [jobArray, setJobArray] = useState([]);
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {
        // Fetch jobs
        axios.get("http://localhost:8080/jobs/getall").then((res) => {
            setJobArray(res.data.Jobs);
            console.log(res.data.Jobs);
        });

        // Determine user role
        axios.get("http://localhost:8080/user/role").then((res) => {
            setIsStudent(res.data.role === 'student');
        });
    }, []);

    return (
        <div className="bg-blue-50 min-h-screen py-10 rounded-xl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#003166] mb-4">Available Job Opportunities</h1>
                    <p className="text-lg text-gray-600">Find your dream job here. Apply now!</p>
                </div>

                <div className="flex flex-col gap-6 justify-center items-center h-full">
                    {jobArray.length <= 0 ? (
                        <span className="text-xl text-gray-600">No jobs available at the moment. Please check back later.</span>
                    ) : (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {jobArray.map((item, idx) => (
                                <div key={idx} className="transition-all transform hover:scale-105 duration-300 flex flex-col h-full">
                                    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col h-full">
                                        <NavLink to={`/description/${item._id}`} className="block h-full">
                                            {/* Header with Avatar and Company Info */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <Avatar className="w-14 h-14">
                                                    <AvatarImage src={item.logo} alt={`${item.company} logo`} />
                                                </Avatar>
                                                <div>
                                                    <div>
                                                       <h1 className="font-semibold text-xl text-gray-800">{item.company}</h1>
                                                       <p className="text-sm text-gray-500">{item.location}</p>
                                                    </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Jobid: {item.jobid}</p>
                                                        </div>
                                                </div>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1">
                                                <h2 className="font-bold text-lg text-gray-900 mb-2">
                                                    {item.position.length > 25 ? `${item.position.substring(0, 25)}...` : item.position}
                                                </h2>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                                                </p>
                                            </div>

                                            {/* Badges Section */}
                                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                                <Badge className="bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-md">
                                                    {item.numbers} Positions
                                                </Badge>
                                                <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md">
                                                    {item.position.length > 25 ? `${item.position.substring(0, 25)}...` : item.position}
                                                </Badge>
                                                <Badge className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-md">
                                                    ₹{item.salary.length > 10 ? `${item.salary.substring(0, 10)}...` : item.salary}Lakh per annum
                                                </Badge>
                                            </div>

                                            {/* View and Apply buttons */}
                                            <div className="mt-6 flex justify-between gap-4">
                                                <NavLink
                                                    to={`/description/${item._id}`}
                                                    className="bg-white text-[#00254d] border border-[#00254d] px-3 py-2 rounded-xl text-center w-full font-semibold hover:transition-colors text-sm"
                                                >
                                                    View Details
                                                </NavLink>
                                                {isStudent && (
                                                    <button className="bg-[#003166] text-white px-3 py-2 rounded-xl text-center w-full font-semibold hover:bg-green-700 transition-colors text-sm">
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;

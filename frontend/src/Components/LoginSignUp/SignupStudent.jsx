import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import phone_icon from '../Assets/phone.png';
import year_icon from '../Assets/year.png';
import image_icon from '../Assets/photo.png';
import degree_icon from '../Assets/degree.png';
import cv_icon from '../Assets/cv.png';
import { toast } from 'react-toastify';
import { z } from 'zod';
import axios from 'axios';

// Zod validation schema
const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    graduationdegree: z.string().min(1, 'Graduation Degree is required'),
    year: z.string().refine((val) => parseInt(val) > 0, 'Year must be a valid positive number'),
    phone: z
        .string()
        .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    tenth: z
        .string()
        .regex(/^\d+$/, '10th marks must be a number')
        .transform(Number)
        .refine((val) => val >= 50 && val <= 100, '10th marks must be between 50 and 100'),
    tweleth: z
        .string()
        .regex(/^\d+$/, '12th marks must be a number')
        .transform(Number)
        .refine((val) => val >= 50 && val <= 100, '12th marks must be between 50 and 100'),
    graduationMarks: z
        .string()
        .regex(/^\d+$/, 'Graduation marks must be a number')
        .transform(Number)
        .refine((val) => val >= 50 && val <= 100, 'Graduation marks must be between 50 and 100'),
    resume: z.string().url('Resume must be a valid URL'),
    image: z.instanceof(File, 'Image is required'),
});

const SignupStudent = ({ setAdmin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        graduationdegree: '',
        year: '',
        phone: '',
        tenth: '',
        tweleth: '',
        graduationMarks: '',
        resume: '',
        image: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            // Validate form data
            signupSchema.parse(formData);

            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            const response = await axios.post('http://localhost:8080/signup/student', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.warning(`${response.data.Data.name.toUpperCase()} Verify your Account`);
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(formattedErrors);
            } else {
                toast.error(error.response?.data?.message || 'Something went wrong.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Sign Up <span className="text-gray-500">(Student)</span>
                </h1>
                <form onSubmit={handleSignUp} className="space-y-4">
                    {[
                        { label: "Name", icon: user_icon, name: "name", type: "text" },
                        { label: "Email", icon: email_icon, name: "email", type: "email" },
                        { label: "Phone", icon: phone_icon, name: "phone", type: "tel" },
                        { label: "Password", icon: password_icon, name: "password", type: "password" },
                        { label: "Year", icon: year_icon, name: "year", type: "number" },
                        { label: "Graduation Degree", icon: degree_icon, name: "graduationdegree", type: "text" },
                        { label: "Graduation Marks", icon: degree_icon, name: "graduationMarks", type: "number" },
                        { label: "Resume Link", icon: cv_icon, name: "resume", type: "url" },
                        { label: "Upload Image", icon: image_icon, name: "image", type: "file", accept: "image/*" },
                    ].map(({ label, icon, name, type, accept }) => (
                        <div key={name} className="flex items-center gap-3">
                            <img src={icon} alt={label} className="w-6 h-6" />
                            <div className="w-full">
                                <input
                                    type={type}
                                    name={name}
                                    accept={accept}
                                    placeholder={label}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors[name] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "10th Marks", name: "tenth" },
                            { label: "12th Marks", name: "tweleth" },
                        ].map(({ label, name }) => (
                            <div key={name}>
                                <input
                                    type="number"
                                    name={name}
                                    placeholder={label}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors[name] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            <span className="text-gray-700">Admin?</span>{' '}
                            <span
                                className="text-red-500 font-semibold cursor-pointer"
                                onClick={() => setAdmin(true)}
                            >
                                Click here
                            </span>
                        </p>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <NavLink to="/login" className="text-blue-500">
                            Login
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupStudent;

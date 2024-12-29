import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import axios from '../LoginSignUp/axios';

// Zod validation schema
const jobPostSchema = z.object({
    company: z.string().min(3, 'Company name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    position: z.string().min(3, 'Position must be at least 3 characters'),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    salary: z.string().min(1, 'Salary is required'),
    numbers: z.string().min(1, 'At least 1 position is required'),
    tenth: z
        .number()
        .min(0, '10th marks must be at least 0')
        .max(100, '10th marks cannot exceed 100'),
    tweleth: z
        .number()
        .min(0, '12th marks must be at least 0')
        .max(100, '12th marks cannot exceed 100'),
    graduationMarks: z
        .number()
        .min(0, 'Graduation marks must be at least 0')
        .max(100, 'Graduation marks cannot exceed 100'),
});

const JobPost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company: '',
        description: '',
        position: '',
        location: '',
        salary: '',
        numbers: '',
        tenth: '',
        tweleth: '',
        graduationMarks: '',
        batch:2025,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const JobPostHandler = async (e) => {
        e.preventDefault();

        try {
            // Parse and validate form data after casting marks fields to numbers
            const validatedData = jobPostSchema.parse({
                ...formData,
                batch:Number(formData.batch),
                tenth: Number(formData.tenth),
                tweleth: Number(formData.tweleth),
                graduationMarks: Number(formData.graduationMarks),
            });

            const response = await axios.post('http://localhost:8080/jobs/post', validatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                toast.success('Job posted successfully');
                navigate('/');
            } else {
                toast.error(response.data.message || 'Failed to post the job.');
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
        <div className="flex justify-center items-center min-h-screen bg-white p-8">
            <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl border-4 border-transparent transition hover:border-[#80004c]">
                <h2 className="text-2xl font-bold text-center text-[#80004c] mb-6">Post a New Job</h2>
                <form onSubmit={JobPostHandler}>
                    <div className="mb-4">
                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.company && <p className="text-xs text-red-500 mt-2">{errors.company}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        {errors.description && <p className="text-xs text-red-500 mt-2">{errors.description}</p>}
                    </div>

                    {['position', 'location', 'salary', 'numbers'].map((field) => (
                        <div className="mb-4" key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[field] && <p className="text-xs text-red-500 mt-2">{errors[field]}</p>}
                        </div>
                    ))}

                    {['tenth', 'tweleth', 'graduationMarks'].map((field) => (
                        <div className="mb-4" key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                            </label>
                            <input
                                type="number"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[field] && <p className="text-xs text-red-500 mt-2">{errors[field]}</p>}
                        </div>
                    ))}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#80004c] to-purple-500 text-white py-2 rounded-xl hover:bg-[#b3006a] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPost;

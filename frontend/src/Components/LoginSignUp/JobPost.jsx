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
    numbers: z.string().min(1, 'At least 1 position is required'),  // Changed to string for input handling
    tenth: z.string().regex(/^\d+$/, '10th marks must be a valid number').min(1, '10th marks are required'),
    tweleth: z.string().regex(/^\d+$/, '12th marks must be a valid number').min(1, '12th marks are required'),
    graduationMarks: z.string().regex(/^\d+$/, 'Graduation marks must be a valid number').min(1, 'Graduation marks are required'),
});

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

    const [errors, setErrors] = useState({});

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Form submission handler with Zod validation
    const JobPostHandler = async (e) => {
        e.preventDefault();

        // Perform validation
        try {
            // Validate the form data with Zod schema
            jobPostSchema.parse(formData);

            // Send POST request if validation passes
            const response = await axios.post('http://localhost:8080/jobs/post', formData, {
                headers: {
                    'Content-Type': 'application/json', // Ensure JSON data is sent
                },
            });

            if (response.data.success) {
                toast.success('Job posted successfully');
                navigate('/'); // Redirect after success
            } else {
                console.log(response)
                toast.error(response.data.message || 'Failed to post the job.');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Extract validation errors from Zod and set them to the state
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(formattedErrors);
            } else {
                toast.error(error.response.data.message || 'Something went wrong.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Post a New Job</h2>
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        {errors.description && <p className="text-xs text-red-500 mt-2">{errors.description}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Position
                        </label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.position && <p className="text-xs text-red-500 mt-2">{errors.position}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.location && <p className="text-xs text-red-500 mt-2">{errors.location}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                            Salary
                        </label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.salary && <p className="text-xs text-red-500 mt-2">{errors.salary}</p>}
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="w-full">
                            <label htmlFor="tenth" className="block text-sm font-semibold text-gray-700 mb-2">
                                10th Marks
                            </label>
                            <input
                                type="number"
                                id="tenth"
                                name="tenth"
                                value={formData.tenth}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.tenth && <p className="text-xs text-red-500 mt-2">{errors.tenth}</p>}
                        </div>

                        <div className="w-full">
                            <label htmlFor="tweleth" className="block text-sm font-semibold text-gray-700 mb-2">
                                12th Marks
                            </label>
                            <input
                                type="number"
                                id="tweleth"
                                name="tweleth"
                                value={formData.tweleth}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.tweleth && <p className="text-xs text-red-500 mt-2">{errors.tweleth}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="graduationMarks" className="block text-sm font-semibold text-gray-700 mb-2">
                            Graduation Marks
                        </label>
                        <input
                            type="number"
                            id="graduationMarks"
                            name="graduationMarks"
                            value={formData.graduationMarks}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.graduationMarks && <p className="text-xs text-red-500 mt-2">{errors.graduationMarks}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="numbers" className="block text-sm font-semibold text-gray-700 mb-2">
                            Number of Positions
                        </label>
                        <input
                            type="text"
                            id="numbers"
                            name="numbers"
                            value={formData.numbers}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.numbers && <p className="text-xs text-red-500 mt-2">{errors.numbers}</p>}
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

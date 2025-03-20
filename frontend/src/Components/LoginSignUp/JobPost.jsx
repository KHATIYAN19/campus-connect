import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import axios from '../LoginSignUp/axios';

const jobPostSchema = z.object({
  company: z.string().min(3, 'Company name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  position: z.string().min(3, 'Position must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  salary: z.coerce.number()
    .min(1, 'Salary must be at least 1 LPA')
    .max(100, 'Salary seems unrealistically high'),
  batch: z.coerce.number()
    .min(2024, 'Batch year must be greater than 2023')
    .max(new Date().getFullYear() + 5, 'Invalid batch year'),
  tenth: z.coerce.number()
    .refine(val => !isNaN(val), { message: '10th marks are required' })
    .refine(val => val >= 0 && val <= 100, 'Must be between 0-100%'),
  tweleth: z.coerce.number()
    .refine(val => !isNaN(val), { message: '12th marks are required' })
    .refine(val => val >= 0 && val <= 100, 'Must be between 0-100%'),
  graduationMarks: z.coerce.number()
    .refine(val => !isNaN(val), { message: 'Graduation marks are required' })
    .refine(val => val >= 0 && val <= 100, 'Must be between 0-100%'),
});

const JobPost = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company: '',
    description: '',
    position: '',
    location: '',
    salary: '',
    tenth: '',
    tweleth: '',
    graduationMarks: '',
    batch: 2025, // Default set to 2025
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const JobPostHandler = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = jobPostSchema.parse(formData);
      const response = await axios.post('/jobs/post', validatedData, {
        headers: { 'Content-Type': 'application/json' },
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-[#80004c] to-purple-600">
          <h2 className="text-3xl font-bold text-white text-center">Post a New Job</h2>
        </div>

        <form onSubmit={JobPostHandler} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['company', 'position', 'location'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border-2 ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary (LPA)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="1"
                  step="0.1"
                  className={`w-full px-4 py-2 pr-12 border-2 ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <span className="absolute right-4 top-3 text-gray-500">LPA</span>
              </div>
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Year (Batch)
              </label>
              <input
                type="number"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                min="2024"
                max={currentYear + 5}
                className={`w-full px-4 py-2 border-2 ${
                  errors.batch ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch}</p>}
            </div>

            {['tenth', 'tweleth', 'graduationMarks'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.replace(/^\w/, m => m.toUpperCase()).replace(/([A-Z])/g, ' $1')} (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full px-4 py-2 pr-12 border-2 ${
                      errors[field] ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <span className="absolute right-4 top-3 text-gray-500">%</span>
                </div>
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border-2 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#80004c] to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-[#80004c] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </div>
            ) : (
              'Post Job'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPost;
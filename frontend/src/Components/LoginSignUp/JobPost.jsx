import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import axios from '../LoginSignUp/axios'; // Assuming this path is correct

// Zod Schema (using helper for required number ranges)
const requiredNumberInRange = (minVal, maxVal, requiredMsg, rangeMsg = `Must be between ${minVal} and ${maxVal}`) => {
  return z.string() // 1. Validate as string first
    .min(1, { message: requiredMsg }) // 2. Ensure it's not empty
    .pipe( // 3. Then, pipe to number validation
      z.coerce.number({ invalid_type_error: "Must be a number" }) // Coerce string to number
        .min(minVal, { message: rangeMsg }) // Check min value
        .max(maxVal, { message: rangeMsg }) // Check max value
    );
};

const jobPostSchema = z.object({
  company: z.string().min(3, 'Company name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  position: z.string().min(3, 'Position must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),

  // Use the helper for number fields requiring specific ranges and being mandatory
  salary: requiredNumberInRange(1, 1000, "Salary is required", "Salary must be between 1 and 100 LPA"),

  batch: z.coerce.number({ required_error: "Batch year is required", invalid_type_error: "Batch must be a number" })
    .min(2024, 'Batch year must be 2024 or later')
     // Using current date (Apr 10, 2025) + 5 = 2030 max year
    .max(new Date().getFullYear() + 5, `Invalid batch year (max ${new Date().getFullYear() + 5})`),

  tenth: requiredNumberInRange(0, 100, "10th marks are required", "Marks must be between 0% and 100%"),
  tweleth: requiredNumberInRange(0, 100, "12th marks are required", "Marks must be between 0% and 100%"),
  graduationMarks: requiredNumberInRange(0, 100, "Graduation marks are required", "Marks must be between 0% and 100%"),
});
// --- End of Zod Schema ---


const JobPost = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); // 2025 based on current time
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
    batch: '', // Default set to 2026
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the specific error when the user starts typing again
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
  };

  // --- Updated JobPostHandler ---
  const JobPostHandler = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous visual errors
    setIsSubmitting(true);

    try {
      // Attempt to validate the data
      const validatedData = jobPostSchema.parse(formData);

      // --- If validation succeeds, proceed with API call ---
      const response = await axios.post('/jobs/post', validatedData, {
        headers: { 'Content-Type': 'application/json' },
        // Add authentication if needed: withCredentials: true, headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Job posted successfully!'); // Show success toast from API response
        navigate('/');
      } else {
        // Handle business logic errors returned from API (e.g., duplicate job)
        toast.error(response.data.message || 'Failed to post the job. Please try again.'); // Show error toast from API response
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // --- Zod validation failed ---
        const formattedErrors = error.errors.reduce((acc, curr) => {
          const key = curr.path[0] ?? 'form';
          acc[key] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors); // Update state to show errors inline in the form
        // --- DO NOT SHOW ZOD ERROR TOAST ---
        // toast.error('Please correct the errors highlighted below.'); // <= This line is removed/commented out
      }
      // --- Handle API/Network errors and show toast ---
      else if (error.response) {
        // Error came from backend (e.g., 4xx, 5xx response)
        console.error("API Error Response:", error.response);
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`); // Show API error toast
      } else if (error.request) {
        // Request was made but no response received (network error)
        console.error("API Network Error:", error.request);
        toast.error('Network error. Please check your connection.'); // Show network error toast
      }
       else {
        // Other errors (e.g., setup issues, unexpected JS errors)
        console.error("Unexpected Error:", error);
        toast.error('An unexpected error occurred. Please try again.'); // Show unexpected error toast
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderInputField = (name, label, type = 'text', props = {}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
       
        className={`w-full px-4 py-2.5 border ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out bg-white`}
        disabled={isSubmitting}
        {...props}
      />
      {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

 
  const renderNumericFieldWithUnit = (name, label, unit, props = {}) => (
     <div>
       <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
         {label}
       </label>
       <div className="relative">
         <input
           type="text"
           inputMode="decimal"
           id={name}
           name={name}
           value={formData[name]}
           onChange={handleChange}
           
           className={`w-full px-4 py-2.5 pr-12 border ${
             errors[name] ? 'border-red-500' : 'border-gray-300'
           } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out bg-white`}
           disabled={isSubmitting}
           {...props}
         />
         <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 text-sm">
           {unit}
         </span>
       </div>
       {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
     </div>
  );


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Container uses rounded-xl */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-orange-500 to-orange-600">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-tight">
            Post a New Job Opportunity
          </h2>
        </div>

        <form onSubmit={JobPostHandler} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInputField('company', 'Company Name', 'text', { placeholder: "e.g., Tech Solutions Inc."})}
            {renderInputField('position', 'Position / Job Title', 'text', { placeholder: "e.g., Software Engineer"})}
            {renderInputField('location', 'Location', 'text', { placeholder: "e.g., Noida, UP or Remote"})}
            {renderNumericFieldWithUnit('salary', 'Salary', 'LPA', { placeholder: "e.g., 10.5" })}
            {renderInputField('batch', 'Eligible Batch (Year)', 'number', {placeholder: "e.g., 2026" })}
          </div>

          <div className="pt-4">
             <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Eligibility Criteria (%)</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {renderNumericFieldWithUnit('tenth', '10th Marks', '%', { placeholder: "e.g., 85.5" })}
               {renderNumericFieldWithUnit('tweleth', '12th Marks', '%', { placeholder: "e.g., 78.2" })}
               {renderNumericFieldWithUnit('graduationMarks', 'Graduation Marks', '%', { placeholder: "e.g., 72" })}
             </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
               // --- Updated styles: rounded-lg, focus:outline-none ---
              className={`w-full px-4 py-2.5 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out bg-white`}
              disabled={isSubmitting}
              placeholder="Provide details about the role, responsibilities, required skills, etc."
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="pt-5">
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Posting Job...</span>
                </div>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPost;
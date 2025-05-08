import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import axios from '../LoginSignUp/axios.js'; // Ensure axios path is correct
import {
    User, Mail, Lock, Phone, CalendarDays, GraduationCap,
    FileText, Image as ImageIcon, Percent, Link as LinkIcon, Loader2
} from 'lucide-react';

// Zod validation schema - Refined messages and types
const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    graduationdegree: z.string().min(1, 'Graduation Degree is required'),
    year: z.string()
        .regex(/^\d{4}$/, 'Enter a valid 4-digit year')
        .transform(Number)
        .refine((val) => val >= 1980 && val <= (new Date().getFullYear() + 5), 'Enter a realistic graduation year'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    tenth: z.string()
        .regex(/^\d+(\.\d+)?$/, '10th Percentage must be a number')
        .transform(Number)
        .refine((val) => val >= 30 && val <= 100, '10th Percentage must be between 30 and 100'),
    tweleth: z.string()
        .regex(/^\d+(\.\d+)?$/, '12th Percentage must be a number')
        .transform(Number)
        .refine((val) => val >= 30 && val <= 100, '12th Percentage must be between 30 and 100'),
    graduationMarks: z.string()
        .regex(/^\d+(\.\d+)?$/, 'Graduation Percentage must be a number')
        .transform(Number)
        .refine((val) => val >= 30 && val <= 100, 'Graduation Percentage must be between 30 and 100'),
    resume: z.string().url('Resume link must be a valid URL (e.g., Google Drive, Dropbox)'),
    image: z.instanceof(File, { message: 'Profile image is required' })
            .refine((file) => file?.size <= 2 * 1024 * 1024, `Image size must be less than 2MB.`)
            .refine(
                (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
                "Only .jpg, .jpeg, .png and .webp formats are supported."
            ),
});

// --- Helper Components (Moved Outside SignupStudent) ---

// Helper component for general input fields with icons
const InputField = ({ name, label, type = "text", icon: Icon, error, value, onChange, disabled, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="relative">
            {Icon && ( // Conditionally render icon if provided
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value} // Receive value via props
                onChange={onChange} // Receive onChange via props
                className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition duration-200 disabled:opacity-70`}
                disabled={disabled} // Receive disabled state via props
                {...props}
            />
        </div>
        {error && <p className="text-xs text-red-500 mt-1 px-1">{error}</p>}
    </div>
);

// Helper for file input
const FileInputField = ({ name, label, icon: Icon, error, accept, onChange, disabled, fileName, ...props }) => (
     <div>
         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
             {label}
         </label>
         <div className="relative border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400 transition duration-200 group">
            {Icon && ( // Conditionally render icon
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
             <input
                 id={name}
                 name={name}
                 type="file"
                 accept={accept}
                 onChange={onChange} // Receive onChange via props
                 className="relative z-10 block w-full text-sm text-gray-500 pl-10 pr-3 py-2 opacity-0 cursor-pointer group-hover:opacity-100" // Hide default input appearance, show on hover maybe?
                 disabled={disabled} // Receive disabled state via props
                 {...props}
             />
              {/* Custom appearance overlay */}
              <div className={`absolute inset-0 ${Icon ? 'pl-10' : 'pl-3'} pr-3 flex items-center pointer-events-none`}>
                <span className={`text-sm ${fileName ? 'text-gray-700' : 'text-gray-500'} truncate`}>
                  {fileName || 'Choose file...'}
                </span>
              </div>
         </div>
          {/* Display selected file name if needed */}
         {/* {fileName && <p className="text-xs text-gray-500 mt-1 px-1 truncate">Selected: {fileName}</p>} */}
         {error && <p className="text-xs text-red-500 mt-1 px-1">{error}</p>}
     </div>
 );

// --- Main Signup Component ---

const SignupStudent = ({ setAdmin }) => { // Assuming setAdmin is used elsewhere
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        setFormData(prev => ({ ...prev, [name]: newValue })); // More reliable state update
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);
        const loadingToast = toast.loading("Creating account...");

        try {
            const validatedData = signupSchema.parse(formData);
            console.log("Validated Data:", validatedData); // Log validated data before sending

            const data = new FormData();
            Object.entries(validatedData).forEach(([key, value]) => {
                // Ensure file object is appended correctly
                if (value instanceof File) {
                    data.append(key, value, value.name);
                } else {
                    data.append(key, value);
                }
            });

            // Optional: Log FormData contents (for debugging)
            // for (let pair of data.entries()) {
            //    console.log(pair[0]+ ', ' + pair[1]);
            // }

            const response = await axios.post('http://localhost:8080/signup/student', data, {
                headers: { 'Content-Type': 'multipart/form-data' }, // Keep header for FormData
            });

            toast.dismiss(loadingToast);

            if (response.data.success) {
                toast.success(`${response.data.Data?.name?.toUpperCase() || 'User'}, please verify your account via email.`);
                navigate("/login");
            } else {
                 toast.error(response.data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                     if (curr.path?.[0]) {
                        acc[curr.path[0]] = curr.message;
                    }
                    return acc;
                }, {});
                setErrors(formattedErrors);
                toast.error("Please fix the errors in the form.");
                 console.error("Validation Errors:", formattedErrors); // Log validation errors
            } else {
                 toast.error(error.response?.data?.message || 'Something went wrong during signup.');
                 console.error("Signup Error:", error.response || error); // Log full error response
            }
        } finally {
             setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-amber-100 p-4 sm:p-6 font-sans">
             <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
                    Create Student Account
                </h1>
                <p className="text-center text-gray-500 text-sm mb-8">
                    Join Placement Connect and kickstart your career journey.
                </p>

                <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField name="name" label="Full Name" icon={User} error={errors.name} placeholder="Enter your full name" value={formData.name} onChange={handleChange} disabled={isSubmitting}/>
                        <InputField name="email" label="Email Address" type="email" icon={Mail} error={errors.email} placeholder="you@example.com" value={formData.email} onChange={handleChange} disabled={isSubmitting}/>
                        <InputField name="phone" label="Phone Number" type="tel" icon={Phone} error={errors.phone} placeholder="10-digit mobile number" value={formData.phone} onChange={handleChange} disabled={isSubmitting}/>
                        <InputField name="password" label="Password" type="password" icon={Lock} error={errors.password} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} disabled={isSubmitting}/>
                        <InputField name="year" label="Graduation Year" type="number" icon={CalendarDays} error={errors.year} placeholder="e.g., 2025" value={formData.year} onChange={handleChange} disabled={isSubmitting}/>
                        <InputField name="graduationdegree" label="Graduation Degree" icon={GraduationCap} error={errors.graduationdegree} placeholder="e.g., B.Tech in CSE" value={formData.graduationdegree} onChange={handleChange} disabled={isSubmitting}/>

                         <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                             <InputField name="tenth" label="10th Percentage" type="number" icon={Percent} error={errors.tenth} placeholder="%" step="0.01" min="30" max="100" value={formData.tenth} onChange={handleChange} disabled={isSubmitting}/>
                             <InputField name="tweleth" label="12th Percentage" type="number" icon={Percent} error={errors.tweleth} placeholder="%" step="0.01" min="30" max="100" value={formData.tweleth} onChange={handleChange} disabled={isSubmitting}/>
                             <InputField name="graduationMarks" label="Graduation % / CGPA" type="number" icon={Percent} error={errors.graduationMarks} placeholder="%" step="0.01" min="30" max="100" value={formData.graduationMarks} onChange={handleChange} disabled={isSubmitting}/>
                        </div>

                         <InputField name="resume" label="Resume Link (Drive/Dropbox)" type="url" icon={LinkIcon} error={errors.resume} placeholder="https://..." value={formData.resume} onChange={handleChange} disabled={isSubmitting}/>
                         <FileInputField
                              name="image"
                              label="Profile Picture"
                              icon={ImageIcon}
                              error={errors.image}
                              accept="image/jpeg, image/png, image/webp, image/jpg"
                              onChange={handleChange} // Pass handleChange
                              disabled={isSubmitting} // Pass disabled state
                              fileName={formData.image?.name} // Pass file name for display
                         />
                    </div>

                    <div className="pt-6 space-y-5">
                         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                             <p className="text-sm text-gray-500 order-2 sm:order-1">
                                 <span className="text-gray-600">Are you an Admin?</span>{' '}
                                 <button
                                     type="button"
                                     className="text-orange-600 font-semibold hover:underline focus:outline-none"
                                     onClick={() => setAdmin && setAdmin(true)}
                                 >
                                     Click here
                                 </button>
                             </p>
                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 ease-in-out disabled:opacity-70 order-1 sm:order-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <NavLink to="/login" className="text-orange-600 font-semibold hover:underline">
                                Login Now
                            </NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupStudent;
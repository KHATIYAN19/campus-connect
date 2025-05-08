import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Removed react-toastify
import toast, { Toaster } from 'react-hot-toast'; // Added react-hot-toast
import axios from '../LoginSignUp/axios.js'; // Ensure axios path is correct
import { z } from 'zod';

// Import Lucide icons
import {
    User, Mail, Lock, Phone, KeyRound, Image as ImageIcon, Loader2
} from 'lucide-react';

// Zod validation schema for SignupAdmin form
const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    adminkey: z.string().min(5, "Admin key must be at least 5 characters"),
    image: z
    .instanceof(File, { message: 'Profile image is required' })
    .refine((file) => file?.size <= 2 * 1024 * 1024, `Image size must be less than 2MB.`) // Max size 2MB
    .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    ), // Valid image types
});

// --- Helper Components (Defined Outside SignupAdmin) ---

// Helper component for general input fields with icons
const InputField = ({ name, label, type = "text", icon: Icon, error, value, onChange, disabled, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition duration-200 disabled:opacity-70`}
                disabled={disabled}
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
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
             <input
                 id={name}
                 name={name}
                 type="file"
                 accept={accept}
                 onChange={onChange}
                 // Use Tailwind's file: variant for better styling control
                 className="relative z-10 block w-full text-sm text-gray-500 pl-10 pr-3 py-2 cursor-pointer
                     file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0
                     file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700
                     hover:file:bg-orange-100 disabled:opacity-70 disabled:pointer-events-none" // Basic file input styling
                 disabled={disabled}
                 {...props}
             />
             {/* Display selected file name */}
             {fileName && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-xs text-gray-500 truncate">{fileName}</span></div>}
         </div>
         {error && <p className="text-xs text-red-500 mt-1 px-1">{error}</p>}
     </div>
 );


// --- Main Signup Component ---

const SignupAdmin = ({ setAdmin }) => { // Pass setAdmin prop
    const navigate = useNavigate();

    // Use single state object for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        adminkey: '',
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Unified change handler
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);
        const loadingToast = toast.loading("Creating admin account...");

        try {
            const validatedData = signupSchema.parse(formData);

            const data = new FormData();
            Object.entries(validatedData).forEach(([key, value]) => {
                 if (value instanceof File) {
                    data.append(key, value, value.name);
                } else {
                    data.append(key, value);
                }
            });

            const response = await axios.post('http://localhost:8080/signup/admin', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.dismiss(loadingToast);

            if (response.data.success) {
                // Changed warning to success for account creation notification
                toast.success(`${response.data.Data?.name?.toUpperCase() || 'Admin'}, please verify your account via email.`);
                navigate("/login");
            } else {
                 toast.error(response.data.message || 'Admin signup failed.');
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
                console.error("Validation Errors:", formattedErrors);
            } else {
                 toast.error(error.response?.data?.message || 'Something went wrong during signup.');
                 console.error("Signup Error:", error.response || error);
            }
        } finally {
             setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-amber-100 p-4 sm:p-6 font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            {/* Increased max-width */}
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
                    Admin Registration
                </h1>
                <p className="text-center text-gray-500 text-sm mb-8">
                    Create an administrative account for Placement Connect.
                </p>

                <form onSubmit={handleSignUp} className="space-y-5">
                    {/* Using single column layout with helper components */}
                    <InputField name="name" label="Full Name" icon={User} error={errors.name} placeholder="Enter admin name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
                    <InputField name="email" label="Email Address" type="email" icon={Mail} error={errors.email} placeholder="admin@example.com" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                    <InputField name="phone" label="Phone Number" type="tel" icon={Phone} error={errors.phone} placeholder="10-digit mobile number" value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
                    <InputField name="password" label="Password" type="password" icon={Lock} error={errors.password} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} disabled={isSubmitting} />
                    <InputField name="adminkey" label="Admin Secret Key" type="password" icon={KeyRound} error={errors.adminkey} placeholder="Enter the secret key" value={formData.adminkey} onChange={handleChange} disabled={isSubmitting} />
                    <FileInputField
                         name="image"
                         label="Profile Picture"
                         icon={ImageIcon}
                         error={errors.image}
                         accept="image/jpeg, image/png, image/webp, image/jpg"
                         onChange={handleChange}
                         disabled={isSubmitting}
                         fileName={formData.image?.name}
                    />

                    {/* Footer and Submit */}
                    <div className="pt-6 space-y-5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                             <p className="text-sm text-gray-500 order-2 sm:order-1">
                                 <span className="text-gray-600">Are you a Student?</span>{' '}
                                 <button
                                     type="button"
                                     className="text-orange-600 font-semibold hover:underline focus:outline-none"
                                     onClick={() => setAdmin && setAdmin(false)} // Use setAdmin prop
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
                                {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
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

export default SignupAdmin;
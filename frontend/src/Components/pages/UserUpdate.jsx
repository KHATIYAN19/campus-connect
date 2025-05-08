import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";      // Assuming Shadcn UI Input
import { Button } from "@/components/ui/button";     // Assuming Shadcn UI Button
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Assuming Shadcn UI Card
import { motion, AnimatePresence } from "framer-motion";
import {
    Avatar, AvatarImage, AvatarFallback
} from "@/components/ui/avatar";    // Assuming Shadcn UI Avatar
import {
    Search, Edit, X, User, Mail, Phone, Briefcase, GraduationCap,
    CalendarDays, Award, Percent, Hash, AlertCircle // Removed unused: Building, BookOpen, MapPin, Info
} from "lucide-react";
import axios from "../LoginSignUp/axios"; // Assuming correct path to configured axios instance
import { toast } from "sonner";          // Using sonner for toasts

// --- Zod Schemas (Finalized Validation Logic) ---
const strictProfileSchema = z.object({
    // Removed address and bio
    graduationDegree: z.string({ required_error: "Graduation Degree is required" })
        .min(1, "Graduation Degree is required"),
    graduationMarks: z.coerce // coerce handles string-to-number conversion
        .number({ required_error: "Graduation Marks are required", invalid_type_error: "Marks must be a valid number" })
        .min(0, "Marks must be between 0 and 100")
        .max(100, "Marks must be between 0 and 100"),
    tenth: z.coerce
        .number({ required_error: "10th Marks are required", invalid_type_error: "Marks must be a valid number" })
        .min(0, "Marks must be between 0 and 100")
        .max(100, "Marks must be between 0 and 100"),
    tweleth: z.coerce
        .number({ required_error: "12th Marks are required", invalid_type_error: "Marks must be a valid number" })
        .min(0, "Marks must be between 0 and 100")
        .max(100, "Marks must be between 0 and 100"),
});

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"), // Readonly in form
    phone: z.string().min(10, "Phone must be at least 10 digits").regex(/^\d+$/, "Phone must contain only digits"),
    role: z.string(), // Readonly in form
    year: z.coerce
        .number({ required_error: "Year is required", invalid_type_error: "Year must be a valid number" })
        .int("Year must be a whole number")
        .min(2000, "Year seems too early")
        // Using current date (Apr 10, 2025) + 6 = 2031 max year
        .max(new Date().getFullYear() + 6, `Year cannot exceed ${new Date().getFullYear() + 6}`),
    maxoffer: z.coerce
        .number({ invalid_type_error: "Max Offer must be a valid number" }) // No required_error as it's optional
        .min(0, "Max Offer cannot be negative")
        , // Allow null as well if needed from backend/reset
    profile: strictProfileSchema.optional(), // Profile object itself is optional initially
})
.superRefine((data, ctx) => {
    if (data.role === 'student') {
        const profileResult = strictProfileSchema.safeParse(data.profile); 
        if (!profileResult.success) {
          
             if (!data.profile) {
                  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["profile"], message: "Academic details are required for students." });
                 
                  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["profile", "graduationDegree"], message: "Required" });
                  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["profile", "graduationMarks"], message: "Required" });
                  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["profile", "tenth"], message: "Required" });
                  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["profile", "tweleth"], message: "Required" });
             } else { // If object exists but fields fail validation
                 profileResult.error.errors.forEach((err) => {
                      ctx.addIssue({
                          ...err,
                          path: ["profile", ...err.path], // Prepend "profile." to the error path
                      });
                  });
             }
        }
    }
   
});


// --- Icon Mapping ---
const FieldIcon = ({ name }) => {
    const icons = {
        name: User, email: Mail, phone: Phone, role: Briefcase, year: CalendarDays,
        maxoffer: Award, graduationDegree: GraduationCap,
        graduationMarks: Percent, tenth: Hash, tweleth: Hash,
        // Removed address, bio
    };
    const IconComponent = icons[name] || User; // Default to User icon
    return <IconComponent className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />;
};


// --- Main Component ---
export default function UserUpdate() {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Holds original/last saved data for display/reference
    const [editMode, setEditMode] = useState(false);
    const [userInfoCache, setUserInfoCache] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(false); // Loading state for fetching user details

    const {
        control, handleSubmit, reset, watch,
        formState: { errors, isSubmitting }, // errors will now populate primarily on submit
    } = useForm({
        resolver: zodResolver(userSchema),
        mode: "onSubmit", // *** Changed validation mode to onSubmit ***
        defaultValues: { // Updated defaults (address/bio removed)
            name: "", email: "", phone: "", role: "", year: undefined, maxoffer: undefined,
            profile: { graduationDegree: "", graduationMarks: undefined, tenth: undefined, tweleth: undefined },
        }
    });

    const watchedRole = watch("role");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE_URL = "http://localhost:8080"; 
                const res = await axios.get(`${API_BASE_URL}/alluserinfo`);
                setUserInfoCache(res.data.users || []);
            } catch (error) {
                console.error("Error fetching user list:", error);
                toast.error("Could not load user list.");
            }
        };
        fetchData();
    }, []);

 
    useEffect(() => {
        if (search.length >= 1) { 
            const filtered = userInfoCache.filter((user) =>
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.name.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 10); 
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [search, userInfoCache]);

  
    const handleInputChange = (e) => {
        setSearch(e.target.value);
      
        if (selectedUser) {
            setSelectedUser(null);
            setEditMode(false);
            reset({ 
                 name: "", email: "", phone: "", role: "", year: undefined, maxoffer: undefined,
                 profile: { graduationDegree: "", graduationMarks: undefined, tenth: undefined, tweleth: undefined },
            });
        }
    };

    
    const handleSelect = async (user) => {
        setSearch(user.email);
        setSuggestions([]);
        setIsLoadingUser(true);
        setSelectedUser(null); 
        setEditMode(false);

        try {
            const API_BASE_URL = "http://localhost:8080";
            const response = await axios.post(`${API_BASE_URL}/getuserinfo`, { email: user.email });
            const userData = response.data.user;
            console.log(response)
            if (!userData) {
                throw new Error("User data not found.");
            }

          
            const formData = {
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                role: userData.role || "", 
                year: userData.year,
                maxoffer: userData.maxoffer ?? undefined, 
                profile: {
                    graduationDegree: userData.profile?.graduationdegree || "",
                    graduationMarks: userData.profile?.graduationMarks ?? undefined,
                    tenth: userData.profile?.tenth ?? undefined,
                    tweleth: userData.profile?.tweleth ?? undefined,
                },
            };
            setSelectedUser(formData); 
            reset(formData);       
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Error loading user details. Please try again.");
            reset();
        } finally {
            setIsLoadingUser(false);
        }
    };

    
    const onSubmit = async (data) => {
        if (!selectedUser) return;
        const payload = {
            ...data,
            email: selectedUser.email, 
            role: selectedUser.role,  
        
            profile: {
                graduationDegree: data.profile?.graduationDegree,
                graduationMarks: data.profile?.graduationMarks,
                tenth: data.profile?.tenth,
                tweleth: data.profile?.tweleth,
            }
        };

        // If not a student, clear profile data before sending (Backend should ideally handle this)
        if (payload.role !== 'student') {
            payload.profile = {}; // Sending empty profile for non-students
        }

        console.log("Submitting Payload:", payload); // Log payload for debugging

        try {
            const UPDATE_URL = "http://updatedata"; 
            const response = await axios.post(UPDATE_URL, payload); // Using POST

            console.log("Update Response:", response.data); // Log response
            toast.success(response.data.message || "Profile updated successfully!");

            // *** Update local states to reflect successful save ***
            setSelectedUser(prev => ({ ...prev, ...payload })); // Update view state with submitted data
            reset(payload); // Update form state to match saved data

            setEditMode(false); // Exit edit mode
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.response?.data?.message || "Failed to update user.");
        }
    };

    // Helper to display info in View Mode (Removed address/bio)
    const renderInfoField = (label, value, iconName) => {
         // Display 'Not Set' more gracefully for null/undefined/empty strings
         const displayValue = (value !== null && value !== undefined && value !== '') ? value : <span className="text-gray-400 italic">Not Set</span>;

        return (
            <div className="flex items-start space-x-2 py-1.5">
                <FieldIcon name={iconName} />
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for proper truncation/wrapping */}
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    <p className="text-sm text-gray-800 break-words">{displayValue}</p>
                </div>
            </div>
        );
     };

     // Helper for Form Inputs (Handles clearing number inputs)
     const renderFormField = ({ name, label, placeholder, type = "text", controlComponent = Input, options = {} }) => (
        <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                 <FieldIcon name={name.split('.').pop()} /> {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => { // Get error state directly
                    const Control = controlComponent;
                    return (
                         <>
                         <Control
                             {...field}
                             // Display empty string if value is null/undefined
                             value={field.value ?? ''}
                             onChange={e => {
                                 const value = e.target.value;
                                 if (type === 'number') {
                                     field.onChange(value === '' ? undefined : value);
                                 } else {
                                     field.onChange(value);
                                 }
                             }}
                             type={type} 
                             placeholder={placeholder}
                             className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                             disabled={name === 'email' || name === 'role'} 
                             readOnly={name === 'email' || name === 'role'}
                             aria-invalid={!!error}
                             {...options} 
                         />
                       
                         {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
                         </>
                     );
                }}
             />
         </div>
     );


    return (
      
        <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6 bg-gray-50 min-h-screen">
            <div className="relative">
                <Input
                    className="pl-12 pr-4 py-3 text-base rounded-full border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 shadow-sm transition-colors"
                    placeholder="Search user by email or name..."
                    value={search}
                    onChange={handleInputChange}
                    aria-label="Search users"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

         
            <AnimatePresence>
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="flex overflow-x-auto space-x-3 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                            {suggestions.map((user) => (
                                <div
                                    key={user.email}
                                    className="flex items-center gap-3 p-3 bg-white hover:bg-orange-50 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition-colors flex-shrink-0 w-64 transform hover:scale-[1.02]"
                                    onClick={() => handleSelect(user)}
                                    role="button" // Accessibility
                                    tabIndex={0}  // Make focusable
                                    onKeyDown={(e) => e.key === 'Enter' && handleSelect(user)} // Keyboard interaction
                                >
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarImage src={user.image} alt={user.name} />
                                        {/* Orange fallback */}
                                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                                            {user.name?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-800 truncate" title={user.name}>{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Loading Indicator for User Details */}
             {isLoadingUser && (
                 <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-500">Loading user details...</span>
                </div>
             )}


            {/* Profile Card */}
            <AnimatePresence>
                {selectedUser && !isLoadingUser && ( // Only show card if user selected and not loading
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-200">
                            {/* Card Header */}
                            <CardHeader className="bg-gray-50 p-5 sm:p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                    {/* User Info */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-white shadow-md ring-2 ring-orange-300">
                                            <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                                            <AvatarFallback className="text-2xl md:text-3xl bg-orange-100 text-orange-700 font-semibold">
                                                {selectedUser.name?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">{selectedUser.name}</CardTitle>
                                            <CardDescription className="text-gray-600 text-sm md:text-base capitalize mt-1">
                                                {selectedUser.role} {selectedUser.role === 'student' ? `(Batch ${selectedUser.year || 'N/A'})` : ''}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {/* Edit/Cancel Button */}
                                    <Button
                                        onClick={() => {
                                            setEditMode(!editMode);
                                            // If cancelling edit, reset form to last known good state (selectedUser)
                                            if (editMode) reset(selectedUser);
                                        }}
                                        variant={editMode ? "outline" : "default"}
                                        size="sm"
                                        className={`rounded-md transition-all ${editMode
                                            ? 'border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500' // Red outline for Cancel
                                            : 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500' // Orange solid for Edit
                                            }`}
                                    >
                                        {editMode ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                                        {editMode ? "Cancel Edit" : "Edit Profile"}
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-5 sm:p-6">
                                {editMode ? (
                                    /* --- Edit Form --- */
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                        {/* Basic Info Section */}
                                        <section>
                                             <h3 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">Basic Information</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 {renderFormField({ name: "name", label: "Name", placeholder: "Full Name" })}
                                                 {renderFormField({ name: "email", label: "Email", placeholder: "Email Address"})}
                                                 {renderFormField({ name: "phone", label: "Phone", placeholder: "Phone Number" })}
                                                 {renderFormField({ name: "role", label: "Role", placeholder: "Role"})}
                                                 {renderFormField({ name: "year", label: selectedUser.role === 'student' ? 'Graduation Year' : 'Associated Year', placeholder: "YYYY", type: "number", options: {step: 1}})}
                                                  {/* Conditionally render Max Offer only for students */}
                                                  {watchedRole === "student" && renderFormField({ name: "maxoffer", label: "Max Offer (LPA)", placeholder: "e.g., 12.5 (Optional)", type: "number", options: {step: 0.1, min: 0}})}
                                             </div>
                                        </section>

                                        {/* Academic Info Section (Conditional) */}
                                        {watchedRole === "student" && (
                                            <section>
                                                <h3 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4 pt-2">Academic Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                     {renderFormField({ name: "profile.graduationDegree", label: "Graduation Degree", placeholder: "e.g., B.Tech CSE" })}
                                                     {renderFormField({ name: "profile.graduationMarks", label: "Grad. Marks (%)", placeholder: "0-100", type: "number", options: {step: 0.01, min: 0, max: 100}})}
                                                     {renderFormField({ name: "profile.tenth", label: "10th Marks (%)", placeholder: "0-100", type: "number", options: {step: 0.01, min: 0, max: 100}})}
                                                     {renderFormField({ name: "profile.tweleth", label: "12th Marks (%)", placeholder: "0-100", type: "number", options: {step: 0.01, min: 0, max: 100}})}
                                                </div>
                                            </section>
                                        )}

                                        {/* Form-level error display (optional) */}
                                        {errors.profile && !errors.profile.graduationDegree && !errors.profile.graduationMarks && !errors.profile.tenth && !errors.profile.tweleth && (
                                            // Show general profile error if the issue is with the profile object itself (e.g., missing for student)
                                            <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md flex items-center gap-2">
                                                <AlertCircle size={16} /> {errors.profile.message || "Please complete all required academic details."}
                                            </div>
                                        )}


                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white font-semibold py-2 px-5 rounded-md transition-colors disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Saving...
                                                    </div>
                                                    ) : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    /* --- View Mode (Removed address/bio) --- */
                                    <div className="space-y-5">
                                        {/* Basic Info Section */}
                                        <section>
                                             <h3 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3">Basic Information</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                                 {renderInfoField("Email", selectedUser.email, "email")}
                                                 {renderInfoField("Phone", selectedUser.phone, "phone")}
                                                 {renderInfoField(selectedUser.role === 'student' ? 'Graduation Year' : 'Associated Year', selectedUser.year, "year")}
                                                 {/* Correctly display Max Offer 0, show 'Not Set' otherwise */}
                                                 {selectedUser.role === "student" && renderInfoField("Max Offer", (selectedUser.maxoffer !== null && selectedUser.maxoffer !== undefined) ? `${selectedUser.maxoffer} LPA` : null, "maxoffer")}
                                             </div>
                                        </section>

                                        {/* Academic Info Section (Conditional) */}
                                        {selectedUser.role === "student" && ( // Only show if student
                                            <section>
                                                <h3 className="text-base font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3 pt-2">Academic Information</h3>
                                                {/* Check if profile data exists before rendering fields */}
                                                {selectedUser.profile ? (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                                         {renderInfoField("Graduation Degree", selectedUser.profile.graduationDegree, "graduationDegree")}
                                                         {renderInfoField("Graduation Marks", (selectedUser.profile.graduationMarks !== null && selectedUser.profile.graduationMarks !== undefined) ? `${selectedUser.profile.graduationMarks}%` : null, "graduationMarks")}
                                                         {renderInfoField("10th Marks", (selectedUser.profile.tenth !== null && selectedUser.profile.tenth !== undefined) ? `${selectedUser.profile.tenth}%` : null, "tenth")}
                                                         {renderInfoField("12th Marks", (selectedUser.profile.tweleth !== null && selectedUser.profile.tweleth !== undefined) ? `${selectedUser.profile.tweleth}%` : null, "tweleth")}
                                                     </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">No academic details available.</p>
                                                )}
                                            </section>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
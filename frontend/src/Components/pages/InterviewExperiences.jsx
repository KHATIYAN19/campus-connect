import React, { useState, useEffect } from "react";
import axios from "../LoginSignUp/axios"; // Ensure path is correct
import { z } from "zod";
// import { toast } from "react-toastify"; // Removed react-toastify
import toast, { Toaster } from 'react-hot-toast'; // Added react-hot-toast
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import {
    Briefcase, Calendar, User, X, Award, Users, Star, ArrowRight, // Lucide icons
    MessageSquare, BookOpen, // More icons
    Loader2 // Icon for loading spinner
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, etc.)
import { ClipLoader } from 'react-spinners'; // For button loading

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger effect for children
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100 }
    },
};

const InterviewExperiences = ({ show = true }) => { // Default show to true for standalone page view
    const [experiences, setExperiences] = useState([]);
    const [expanded, setExpanded] = useState(null); // ID of the expanded experience
    const [formData, setFormData] = useState({ title: "", company: "", experience: "" });
    const [formErrors, setFormErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // For fetching initial data
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

    const navigate = useNavigate();

    // Fetch Data Effect
    useEffect(() => {
        const fetchExperiences = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await axios.get("http://localhost:8080/interview/getall"); // Ensure endpoint
                // Sort by most recent first
                const sortedExperiences = (response.data.interview || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setExperiences(sortedExperiences);
            } catch (error) {
                // Use react-hot-toast
                toast.error("Failed to load experiences. Please refresh.");
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false); // Stop loading regardless of outcome
            }
        };
        fetchExperiences();
    }, []);

    // Zod Schema for Form Validation
    const formSchema = z.object({
        title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
        company: z.string().min(2, "Company name must be at least 2 characters").max(50, "Company name too long"),
        // Changed experience to description to match API response used later
        experience: z.string().min(50, "Experience must be detailed (min 50 characters)").max(5000, "Experience too long"),
    });

    // Form Input Change Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for the field being edited
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: "" });
        }
    };

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({}); // Clear previous errors
        setIsSubmitting(true); // Start submission loading

        try {
            const validatedData = formSchema.parse(formData); // Validate data

            // Map form field 'experience' to 'description' for API call if needed
            const dataToSend = {
                title: validatedData.title,
                company: validatedData.company,
                description: validatedData.experience, // Ensure API expects 'description'
            };

            const response = await axios.post("http://localhost:8080/interview/post", dataToSend); // Ensure endpoint

            // Ensure response.data.interview contains the necessary fields including 'postby'
            const newExperience = response.data.interview;

            // Prepend new experience for immediate feedback
            // Make sure the newExperience object structure matches the ones fetched initially
            setExperiences([newExperience, ...experiences]);
            setFormData({ title: "", company: "", experience: "" }); // Reset form
            setIsFormVisible(false); // Close modal
            // Use react-hot-toast
            toast.success("Experience shared successfully! 🎉");

        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {});
                setFormErrors(errors);
                 // Use react-hot-toast
                toast.error("Please fix the errors in the form.");
            } else {
                 // Use react-hot-toast
                toast.error(error.response?.data?.message || "Failed to share experience. Please try again.");
                console.error("Submit error:", error);
            }
        } finally {
            setIsSubmitting(false); // Stop submission loading
        }
    };

    // Toggle Read More/Less
    const toggleReadMore = (id) => setExpanded(expanded === id ? null : id);

    // Format Date Utility
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
             // Using IST timezone for formatting. Adjust if your dates are stored in UTC or other timezones.
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Kolkata' // Use appropriate timezone if needed
            });
        } catch (e) {
            console.error("Date formatting error:", e);
            return 'Invalid Date';
        }
    };

    // Calculate Days Ago Utility
    const calculateDaysAgo = (dateString) => {
         if (!dateString) return '';
         try {
             const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
             if (days < 0) return '(Future Date?)'; // Handle potential future dates
             if (days === 0) return '(Today)';
             if (days === 1) return '(1 day ago)';
             return `(${days} days ago)`;
         } catch (e) {
             return '';
         }
    };

    const experiencesToDisplay = !show ? experiences.slice(0, 3) : experiences; // Show 3 in preview

    return (
        // Main container with themed background
        <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-stone-100 to-amber-100 p-4 sm:p-8 font-sans ${!show ? 'py-12' : ''}`}>
             {/* Add Toaster component */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* --- Header Section (Only shown on full page view) --- */}
            {show && (
                <header className="relative max-w-7xl mx-auto text-center mb-16 md:mb-24 pt-12 pb-16 overflow-hidden rounded-3xl shadow-inner bg-white border border-orange-100">
                    {/* Optional decorative background image/pattern */}
                    <img
                        src="/placeholder-background.svg" // << REPLACE with actual relevant background image URL
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-10"
                    />
                   <div className="relative z-10 px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-700 mb-5" // Themed heading
                        >
                            Share Your Interview Journey
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Help fellow students navigate the interview process. Your insights on rounds, questions, and preparation strategies are invaluable.
                        </motion.p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <button
                                className="bg-orange-600 text-white py-3 px-8 rounded-full hover:bg-orange-700 transition-all duration-300 shadow-lg flex items-center gap-3 text-base font-semibold" // Themed button
                                onClick={() => setIsFormVisible(true)}
                            >
                                <MessageSquare size={20} /> {/* Changed icon */}
                                Share Your Experience
                                <ArrowRight size={20} />
                            </button>
                        </motion.div>
                   </div>
                </header>
            )}

             {/* --- Features/Benefits Section (Only shown on full page view) --- */}
             {show && (
                <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16 md:mb-24 px-4">
                    {[
                        { icon: <Award className="w-8 h-8 text-orange-600 mb-3" />, title: "Gain Recognition", text: "Get featured and potentially earn badges for top contributions." },
                        { icon: <Users className="w-8 h-8 text-orange-600 mb-3" />, title: "Help Your Peers", text: "Your story provides real-world insights that textbooks can't offer." },
                        { icon: <BookOpen className="w-8 h-8 text-orange-600 mb-3" />, title: "Build Knowledge", text: "Contribute to a growing library of interview experiences for everyone." },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md border border-stone-100 text-center" // Themed card
                            variants={itemVariants} // Apply item animation variant
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 + index * 0.1 }} // Staggered delay
                            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Enhanced hover
                        >
                            {item.icon}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.text}</p>
                        </motion.div>
                    ))}
                </section>
            )}

            {/* --- Recent Experiences List --- */}
            <section className="max-w-7xl mx-auto px-4">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {show ? 'Recent Experiences' : 'Latest Experiences'}
                    </h2>
                     {!show && experiences.length > 3 && ( // Show 'View All' if not on full page and more than 3 exist
                         <Link to="/experience" className="text-sm font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1 group">
                             View All <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                         </Link>
                     )}
                 </div>

                 {/* Loading State */}
                 {isLoading ? (
                     <div className="flex justify-center items-center py-20 text-orange-600">
                         <Loader2 className="w-12 h-12 animate-spin" />
                     </div>
                 // No Experiences State
                 ) : experiencesToDisplay.length === 0 ? (
                      <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="text-center py-16 bg-white rounded-xl border border-stone-100 shadow-sm"
                     >
                         <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                         <p className="text-gray-500 text-lg mb-4">No experiences shared yet.</p>
                          {/* Encourage sharing if list is empty */}
                          <button
                             className="bg-orange-100 text-orange-700 py-2 px-5 rounded-full hover:bg-orange-200 transition-colors duration-300 text-sm font-semibold flex items-center gap-2 mx-auto"
                             onClick={() => setIsFormVisible(true)}
                         >
                             <MessageSquare size={16} /> Be the First to Share!
                         </button>
                     </motion.div>
                 // Display Experiences Grid
                 ) : (
                     <motion.div
                         className={`grid gap-6 md:gap-8 ${show ? 'md:grid-cols-2' : ''}`} // Apply 2-column grid only on full page view
                         variants={containerVariants}
                         initial="hidden"
                         animate="visible"
                     >
                         {experiencesToDisplay.map((experience) => (
                             <motion.div
                                 key={experience._id}
                                 variants={itemVariants} // Apply item animation variant
                                 className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-stone-100 overflow-hidden flex flex-col" // Ensure flex column for button placement
                             >
                                 <div className="p-5 sm:p-6 flex-grow"> {/* Content area grows */}
                                     <div className="flex items-start justify-between mb-4 gap-4">
                                         {/* User Info */}
                                         <div className="flex items-center gap-3 flex-shrink min-w-0"> {/* Prevent user info from shrinking too much */}
                                             <img
                                                 src={experience?.postby?.image || '/avatar-placeholder.png'} // << Use a placeholder image
                                                 alt={experience?.postby?.name || 'User'}
                                                 className="w-11 h-11 rounded-full border-2 border-orange-100 cursor-pointer hover:border-orange-300 transition"
                                                 onClick={() => navigate(`/user/profile/${experience?.postby?._id}`)} // Ensure route exists
                                                 onError={(e) => e.target.src='/avatar-placeholder.png'} // Handle image load errors
                                             />
                                             <div className="min-w-0"> {/* Allow text to truncate */}
                                                 <h3 className="text-base font-semibold text-gray-800 truncate">{experience?.postby?.name || 'Anonymous'}</h3>
                                                 <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 flex-wrap"> {/* Allow wrapping */}
                                                     <Calendar className="w-3 h-3 text-orange-500 flex-shrink-0" />
                                                     <span>{formatDate(experience?.createdAt)}</span>
                                                     <span className="hidden sm:inline">{calculateDaysAgo(experience?.createdAt)}</span>
                                                 </div>
                                             </div>
                                         </div>
                                         {/* Company Tag */}
                                         <div className="flex-shrink-0 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                             <Briefcase size={12} />
                                             <span>{experience?.company || 'N/A'}</span>
                                         </div>
                                     </div>

                                     {/* Title */}
                                     <h4 className="text-lg font-bold text-gray-900 mb-3">{experience.title}</h4>

                                     {/* Experience Description (with Markdown) */}
                                      {/* Added prose class for markdown styling */}
                                     <div className={`prose prose-sm prose-stone max-w-none text-gray-600 leading-relaxed mb-4 ${expanded === experience._id ? "" : "line-clamp-4"}`}>
                                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                              {/* Ensure you use description if that's the field name */}
                                             {experience.description || experience.experience || ''}
                                         </ReactMarkdown>
                                     </div>
                                 </div>

                                  {/* Read More Button (aligned to bottom) */}
                                 <div className="px-5 sm:px-6 pb-4 pt-2 border-t border-stone-100 mt-auto"> {/* Pushes button down */}
                                     <button
                                         className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center gap-1 transition-colors"
                                         onClick={() => toggleReadMore(experience._id)}
                                     >
                                         {expanded === experience._id ? "Show Less" : "Read Full Experience"}
                                          {/* Icon can change based on state if needed */}
                                     </button>
                                 </div>
                             </motion.div>
                         ))}
                     </motion.div>
                 )}
            </section>

             {/* --- Bottom CTA Section (Only shown on full page view) --- */}
             {show && experiences.length > 0 && ( // Show only if there are experiences
                 <section className="max-w-4xl mx-auto mt-16 md:mt-24 text-center">
                     <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }} // Animate when in view
                         viewport={{ once: true, amount: 0.5 }}
                         transition={{ duration: 0.5 }}
                         className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 md:p-12 shadow-lg text-white"
                    >
                         <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Inspire Others?</h3>
                         <p className="mb-8 max-w-xl mx-auto text-orange-100">
                             Turn your interview experience into valuable guidance for the next generation of candidates.
                         </p>
                         <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="bg-white text-orange-600 py-3 px-8 rounded-full hover:bg-orange-50 transition-colors duration-300 shadow font-semibold flex items-center gap-2 mx-auto"
                             onClick={() => setIsFormVisible(true)}
                         >
                             <MessageSquare size={18} />
                             Share Yours Now
                         </motion.button>
                     </motion.div>
                 </section>
             )}

            {/* --- Form Modal (Using AnimatePresence) --- */}
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        key="modal-backdrop" // Added key
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" // Increased z-index
                        onClick={() => setIsFormVisible(false)} // Close on backdrop click
                    >
                        <motion.div
                            key="modal-content" // Added key
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => setIsFormVisible(false)}
                                aria-label="Close form" // Accessibility
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold text-gray-800 mb-6">Share Your Interview Experience</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title Field */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Experience Title</label>
                                    <input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 rounded-lg border ${
                                            formErrors.title ? "border-red-500" : "border-stone-300"
                                        } focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm transition`} // Themed focus
                                        placeholder="e.g., Google SWE Interview (L3)"
                                    />
                                    {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
                                </div>

                                {/* Company Field */}
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                         className={`w-full px-3 py-2 rounded-lg border ${
                                            formErrors.company ? "border-red-500" : "border-stone-300"
                                        } focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm transition`} // Themed focus
                                        placeholder="e.g., Microsoft"
                                    />
                                    {formErrors.company && <p className="text-red-600 text-xs mt-1">{formErrors.company}</p>}
                                </div>

                                {/* Experience Field */}
                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Your Experience (Supports Markdown)</label>
                                    <textarea
                                        id="experience"
                                        name="experience"
                                        rows="8" // Increased rows for more space
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 rounded-lg border ${
                                            formErrors.experience ? "border-red-500" : "border-stone-300"
                                        } focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm transition`} // Themed focus
                                        placeholder="Share details about interview rounds, questions asked, preparation tips, difficulty level, etc. Use Markdown for formatting (# Heading, * list, **bold**)."
                                    />
                                    {formErrors.experience && <p className="text-red-600 text-xs mt-1">{formErrors.experience}</p>}
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormVisible(false)}
                                        className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting} // Disable while submitting
                                        className={`inline-flex items-center justify-center px-5 py-2 bg-orange-600 text-white font-medium text-sm rounded-lg shadow-sm transition ${
                                            isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <ClipLoader color="#ffffff" size={16} className="mr-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Experience'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewExperiences;
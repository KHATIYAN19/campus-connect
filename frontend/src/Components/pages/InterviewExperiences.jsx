import React, { useState, useEffect } from "react";
import axios from "../LoginSignUp/axios";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    FiBriefcase,
    FiCalendar,
    FiUser,
    FiX,
    FiAward,
    FiUsers,
    FiStar,
    FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

const InterviewExperiences = ({ show }) => {
    const [experiences, setExperiences] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        experience: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get("http://localhost:8080/interview/getall");
                setExperiences(response.data.interview || []);
            } catch (error) {
                toast.error("Failed to load experiences");
            } finally {
                setIsLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const formSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        company: z.string().min(2, "Company name must be at least 2 characters long"),
        experience: z.string().min(50, "Experience must be at least 50 characters long"),
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            formSchema.parse(formData);
            const response = await axios.post("http://localhost:8080/interview/post", formData);
            setExperiences([response.data.interview, ...experiences]);
            setFormData({ title: "", company: "", experience: "" });
            setIsFormVisible(false);
            toast.success("Experience shared successfully! 🎉");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {});
                setFormErrors(errors);
            } else {
                toast.error("Failed to share experience. Please try again.");
            }
        }
    };

    const toggleReadMore = (id) => setExpanded(expanded === id ? null : id);

    const formatDate = (date) => {
        const newDate = new Date(date);
        return `${newDate.getDate().toString().padStart(2, "0")}-${(newDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${newDate.getFullYear()}`;
    };

    const calculateDaysAgo = (createdDate) => {
        return Math.floor((new Date() - new Date(createdDate)) / (1000 * 60 * 60 * 24));
    };

    const experiencesToDisplay = !show ? experiences.slice(0, 2) : experiences;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-8">
            {show && (
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
                    >
                        Shape the Future of Tech Careers
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your experience could help thousands of students land their dream jobs. Share your interview journey today!
                    </motion.p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <button
                            className="bg-indigo-600 text-white py-4 px-8 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg flex items-center gap-3 text-lg"
                            onClick={() => setIsFormVisible(true)}
                        >
                            <FiBriefcase className="text-xl" />
                            Share Your Story Now
                            <FiArrowRight className="text-xl" />
                        </button>
                    </motion.div>
                </div>
            )}

            {show && (
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: <FiAward className="text-4xl text-indigo-600 mb-4" />,
                            title: "Build Your Legacy",
                            text: "Get recognized by the community and help future candidates succeed",
                        },
                        {
                            icon: <FiUsers className="text-4xl text-indigo-600 mb-4" />,
                            title: "Join 10k+ Contributors",
                            text: "Be part of the largest student interview preparation community",
                        },
                        {
                            icon: <FiStar className="text-4xl text-indigo-600 mb-4" />,
                            title: "Earn Recognition",
                            text: "Featured contributors get exclusive rewards and badges",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50"
                            whileHover={{ y: -5 }}
                        >
                            {item.icon}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid gap-8 mt-12">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 px-4">
                    Recent Shared Experiences
                    <span className="text-indigo-600 ml-2 text-lg">({experiences.length} stories)</span>
                </h3>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-indigo-600 text-4xl"
                        >
                            <FiStar />
                        </motion.div>
                    </div>
                ) : experiencesToDisplay.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-lg">No experiences yet. Be the first to share! ✨</div>
                ) : (
                    experiencesToDisplay.map((experience) => (
                        <motion.div
                            key={experience._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={experience?.postby?.image}
                                            alt="User"
                                            className="w-14 h-14 rounded-full border-4 border-indigo-100 cursor-pointer hover:border-indigo-200"
                                            onClick={() => navigate(`/user/profile/${experience?.postby?._id}`)}
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{experience?.postby?.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <FiCalendar className="text-indigo-500" />
                                                <span>{formatDate(experience?.createdAt)}</span>
                                                <span>({calculateDaysAgo(experience?.createdAt)} days ago)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                        <FiBriefcase />
                                        <span className="font-medium">{experience?.company}</span>
                                    </div>
                                </div>

                                <h4 className="text-2xl font-bold text-gray-900 mb-4">{experience.title}</h4>
                                <p className={`text-gray-600 leading-relaxed ${expanded === experience._id ? "" : "line-clamp-3"}`}>
                                    {expanded === experience._id
                                        ? <ReactMarkdown>{experience.description}</ReactMarkdown>
                                        : `${experience.description?.slice(0, 100)}...`}
                                </p>

                                <button
                                    className="text-indigo-600 hover:text-indigo-700 font-medium mt-4 flex items-center gap-1"
                                    onClick={() => toggleReadMore(experience._id)}
                                >
                                    {expanded === experience._id ? "Show less" : "Read full experience"}
                                    <FiUser className="text-sm" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {show && (
                <div className="max-w-7xl mx-auto mt-16 text-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-50">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ready to Make an Impact?</h3>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Your 15-minute contribution could save someone hundreds of hours of preparation.
                        </p>
                        <button
                            className="bg-indigo-600 text-white py-3 px-8 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
                            onClick={() => setIsFormVisible(true)}
                        >
                            <FiBriefcase className="text-xl" />
                            Share Your Experience Now
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative"
                        >
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                                onClick={() => setIsFormVisible(false)}
                            >
                                <FiX className="text-2xl" />
                            </button>

                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Share Your Experience</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            formErrors.title ? "border-red-500" : "border-gray-200"
                                        } focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="e.g., Amazing Frontend Developer Interview"
                                    />
                                    {formErrors.title && <p className="text-red-500 text-sm mt-2">{formErrors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            formErrors.company ? "border-red-500" : "border-gray-200"
                                        } focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="e.g., Google, Microsoft, etc."
                                    />
                                    {formErrors.company && <p className="text-red-500 text-sm mt-2">{formErrors.company}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                                    <textarea
                                        name="experience"
                                        rows="6"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            formErrors.experience ? "border-red-500" : "border-gray-200"
                                        } focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="Share your detailed experience here... Use Markdown for formatting (e.g., **bold**, *italic*, # heading, * list item)."
                                    />
                                    {formErrors.experience && <p className="text-red-500 text-sm mt-2">{formErrors.experience}</p>}
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormVisible(false)}
                                        className="px-6 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700"
                                    >
                                        Submit Experience
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
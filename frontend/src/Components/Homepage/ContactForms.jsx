import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ClipLoader } from 'react-spinners';
import { User, Mail, Phone, Send, Home, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    email: z.string().email({ message: 'Please enter a valid email' }),
    phone: z.string().length(10, { message: 'Phone number must be exactly 10 digits' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        try {
            contactSchema.parse(formData);
            setIsSubmitting(true);
            try {
                const response = await axios.post('http://localhost:8080/api/contact', formData);
                if (response.data.success || response.status === 200 || response.status === 201) {
                    toast.success("Message sent successfully!");
                    setSuccess(true);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                } else {
                    toast.error(response.data.message || 'Failed to send message.');
                }
            } catch (apiError) {
                console.error("API Error:", apiError);
                toast.error(apiError.response?.data?.message || 'An error occurred while sending the message.');
            } finally {
                setIsSubmitting(false);
            }
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                const validationErrors = validationError.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(validationErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-orange-500 py-4 px-6 text-white text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
                    <p className="mt-1 text-sm text-orange-200">We'd love to hear from you!</p>
                </div>
                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-3 mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <p className="text-lg font-medium text-gray-700 mb-4">Your message has been received!</p>
                            <button
                                onClick={handleGoHome}
                                className="inline-flex items-center bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-500' : ''}`}
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.name}
                                        aria-describedby="name-error"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-red-500 text-sm" id="name-error">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.email}
                                        aria-describedby="email-error"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-red-500 text-sm" id="email-error">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${errors.phone ? 'border-red-500' : ''}`}
                                        placeholder="123-456-7890"
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.phone}
                                        aria-describedby="phone-error"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-red-500 text-sm" id="phone-error">{errors.phone}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className={`focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.message ? 'border-red-500' : ''}`}
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.message}
                                        aria-describedby="message-error"
                                    ></textarea>
                                </div>
                                {errors.message && <p className="mt-1 text-red-500 text-sm" id="message-error">{errors.message}</p>}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <ClipLoader color="#ffffff" size={20} className="mr-2" />
                                            Submitting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
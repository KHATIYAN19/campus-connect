import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { FiUser, FiMail, FiSmartphone,FiAlertCircle , FiMessageSquare, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      contactSchema.parse(formData);
      setIsSubmitting(true);
      await axios.post('http://lc.com', formData);
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.reduce((acc, curr) => {
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
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleGoHome = () => {
    window.location.href = '/home';
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-2xl border border-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <p className="text-gray-600 mt-2">We'd love to hear from you!</p>
      </div>

      {success ? (
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-6">We'll get back to you within 24 hours</p>
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                      hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiArrowLeft className="w-5 h-5" />
            Return Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute top-3.5 left-4 text-purple-600">
              <FiUser className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-100 rounded-lg
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" /> {errors.name}
            </p>}
          </div>

          <div className="relative">
            <div className="absolute top-3.5 left-4 text-purple-600">
              <FiMail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-100 rounded-lg
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" /> {errors.email}
            </p>}
          </div>

          <div className="relative">
            <div className="absolute top-3.5 left-4 text-purple-600">
              <FiSmartphone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-100 rounded-lg
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" /> {errors.phone}
            </p>}
          </div>

          <div className="relative">
            <div className="absolute top-3.5 left-4 text-purple-600">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows="4"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-100 rounded-lg
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" /> {errors.message}
            </p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                      hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold
                      ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
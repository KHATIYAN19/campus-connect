import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

// Zod validation schema
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

    // Validate the form using Zod
    try {
      contactSchema.parse(formData);

      // If validation passes, post the form data to the endpoint
      setIsSubmitting(true);
       axios.post('http://lc.com', formData); // Replace with actual endpoint
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear the form after submission
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

  // Clear errors when the user starts typing in the field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for the field being edited
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleGoHome = () => {
    window.location.href = '/home'; // Redirect to the home page using window.location
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#2B2B2B]   rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Contact Us</h2>
      
      {success ? (
        <div>
          <div className="text-green-600 bg-green-100 border border-green-500 rounded-lg p-3 mb-4">
            <p>Your form has been received. Our team will contact you shortly!</p>
          </div>
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-2xl  bg-[#FFFFFF]  rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows={4}
            />
            {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isSubmitting && 'opacity-50'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;

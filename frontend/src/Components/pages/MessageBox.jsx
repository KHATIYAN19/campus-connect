import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader for loading

const MessageBox = (props) => {
  const [msg, setMsg] = useState('');
  const [year, setYear] = useState('');
  const [topic, setTopic] = useState('');
  const [msgError, setMsgError] = useState('');
  const [yearError, setYearError] = useState('');
  const [topicError, setTopicError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgError('');
    setYearError('');
    setTopicError('');
    setLoading(true); // Set loading to true on submit

    const schema = z.object({
      msg: z.string().min(1, { message: 'Message is required' }),
      year: z
        .string()
        .regex(/^\d{4}$/, { message: 'Year must be a 4-digit number' })
        .refine(
          (val) => {
            const num = parseInt(val, 10);
            return num >= 2023 && num <= 2028;
          },
          { message: 'Year must be between 2023 and 2028' }
        ),
      topic: z.string().min(1, { message: 'Topic is required' }),
    });

    try {
      schema.parse({ msg, year, topic });

      const response = await axios.post('http://localhost:8080/message/post', {
        msg,
        year,
        topic,
      });

      if (response.data.success) {
        toast.success('Notice Sent');
        navigate('/notices');
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === 'msg') {
            setMsgError(err.message);
          } else if (err.path[0] === 'year') {
            setYearError(err.message);
          } else if (err.path[0] === 'topic') {
            setTopicError(err.message);
          }
        });
      } else if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <form
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border-2 border-purple-300 transition hover:border-purple-400"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">
          Send Notice
        </h1>

        {/* Topic Field */}
        <div className="mb-6">
          <label
            htmlFor="topic"
            className="block text-md font-medium text-gray-700 mb-2 text-purple-600"
          >
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition ${
              topicError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {topicError && <p className="text-red-500 text-sm mt-1">{topicError}</p>}
        </div>

        {/* Message Field */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-md font-medium text-gray-700 mb-2 text-purple-600"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write your message..."
            className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition ${
              msgError ? 'border-red-500' : 'border-gray-300'
            }`}
          ></textarea>
          {msgError && <p className="text-red-500 text-sm mt-1">{msgError}</p>}
        </div>

        {/* Batch Field */}
        <div className="mb-6">
          <label
            htmlFor="batch"
            className="block text-md font-medium text-gray-700 mb-2 text-purple-600"
          >
            Batch
          </label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter batch (e.g., 2025)"
            className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition ${
              yearError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-lg rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition ${
            loading ? 'opacity-70 cursor-wait' : ''
          }`}
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default MessageBox;
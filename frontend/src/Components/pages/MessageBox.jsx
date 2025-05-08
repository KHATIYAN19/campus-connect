import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ClipLoader } from 'react-spinners';

const MessageBox = (props) => {
    const [msg, setMsg] = useState('');
    const [year, setYear] = useState('');
    const [topic, setTopic] = useState('');
    const [msgError, setMsgError] = useState('');
    const [yearError, setYearError] = useState('');
    const [topicError, setTopicError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const navigate = useNavigate();

    const currentSchemaYear = new Date().getFullYear();
    const schema = z.object({
        msg: z.string().min(1, { message: 'Message is required' }).max(500, { message: 'Message too long (max 500 chars)' }),
        year: z
            .string()
            .regex(/^\d{4}$/, { message: 'Year must be a 4-digit number' })
            .refine(
                (val) => {
                    const num = parseInt(val, 10);
                    return num >= currentSchemaYear && num <= currentSchemaYear + 4;
                },
                { message: `Year must be between ${currentSchemaYear} and ${currentSchemaYear + 4}` }
            ),
        topic: z.string().min(1, { message: 'Topic is required' }).max(100, { message: 'Topic too long (max 100 chars)' }),
    });

    const hasErrors = !!msgError || !!yearError || !!topicError;

    const validateField = (fieldName, value) => {
        try {
            schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
            return '';
        } catch (error) {
            if (error instanceof z.ZodError) {
                return error.errors[0].message;
            }
            return 'Invalid input';
        }
    };

    const handleMsgChange = (e) => {
        const newValue = e.target.value;
        setMsg(newValue);
        setMsgError('');
        if (hasAttemptedSubmit) {
            const error = validateField('msg', newValue);
            setMsgError(error);
        }
    };

    const handleYearChange = (e) => {
        const newValue = e.target.value;
        setYear(newValue);
        setYearError('');
        if (hasAttemptedSubmit) {
            const error = validateField('year', newValue);
            setYearError(error);
        }
    };

    const handleTopicChange = (e) => {
        const newValue = e.target.value;
        setTopic(newValue);
        setTopicError('');
        if (hasAttemptedSubmit) {
            const error = validateField('topic', newValue);
            setTopicError(error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasAttemptedSubmit(true);
        setLoading(true);

        setMsgError('');
        setYearError('');
        setTopicError('');

        try {
            const validatedData = schema.parse({ msg, year, topic });
            const response = await axios.post('http://localhost:8080/message/post', validatedData);

            if (response.data.success) {
                toast.success('Notice Sent Successfully!');
                setMsg('');
                setYear('');
                setTopic('');
                setHasAttemptedSubmit(false);
            } else {
                toast.error(response.data.message || 'Failed to send notice.');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    if (err.path[0] === 'msg') setMsgError(err.message);
                    else if (err.path[0] === 'year') setYearError(err.message);
                    else if (err.path[0] === 'topic') setTopicError(err.message);
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                console.error("Unexpected error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const showErrorBorder = (errorState) => hasAttemptedSubmit && !!errorState;

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
            <form
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-orange-100 transition hover:border-orange-200"
                onSubmit={handleSubmit}
                noValidate
            >
                <h1 className="text-2xl font-bold text-orange-700 text-center mb-6">
                    Compose Notice
                </h1>

                <div className="mb-4 relative">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                        Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={topic}
                        onChange={handleTopicChange}
                        placeholder="Subject of the notice"
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition text-sm ${showErrorBorder(topicError) ? 'border-red-500' : 'border-gray-300'
                            }`}
                        aria-invalid={showErrorBorder(topicError)}
                        aria-describedby="topic-error"
                    />
                    {showErrorBorder(topicError) && <p id="topic-error" className="text-red-600 text-xs mt-1">{topicError}</p>}
                </div>

                <div className="mb-4 relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={msg}
                        onChange={handleMsgChange}
                        placeholder="Write the notice content here..."
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition text-sm ${showErrorBorder(msgError) ? 'border-red-500' : 'border-gray-300'
                            }`}
                        aria-invalid={showErrorBorder(msgError)}
                        aria-describedby="message-error"
                    ></textarea>
                    {showErrorBorder(msgError) && <p id="message-error" className="text-red-600 text-xs mt-1">{msgError}</p>}
                </div>

                <div className="mb-6 relative">
                    <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Batch (Year)
                    </label>
                    <input
                        type="number"
                        id="batch"
                        name="batch"
                        value={year}
                        onChange={handleYearChange}
                        placeholder="e.g., 2025"
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${showErrorBorder(yearError) ? 'border-red-500' : 'border-gray-300'
                            }`}
                        aria-invalid={showErrorBorder(yearError)}
                        aria-describedby="batch-error"
                    />
                    {showErrorBorder(yearError) && <p id="batch-error" className="text-red-600 text-xs mt-1">{yearError}</p>}
                </div>

                <button
                    type="submit"
                    className={`w-full flex justify-center items-center py-2 px-4 bg-orange-600 text-white font-semibold text-base rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out ${ (loading || (hasAttemptedSubmit && hasErrors))
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:bg-orange-700'
                        }`}
                    disabled={loading || (hasAttemptedSubmit && hasErrors)}
                >
                    {loading ? (
                        <ClipLoader color="#ffffff" size={20} />
                    ) : (
                        'Send Notice'
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageBox;
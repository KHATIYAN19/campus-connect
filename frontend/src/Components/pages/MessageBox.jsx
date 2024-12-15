import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../LoginSignUp/axios.js';
import { toast } from 'react-toastify';

const MessageBox = (props) => {
  const[msg,setMsg]=useState("");
  const[year,setYear]=useState("");

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/message/post", {
        msg,
        year
      });
      if (response.data.success) {
           toast.success("Notice Sent");
           navigate("/notices");
      } else {
          toast.error(response.error)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4">
      <form
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border-4 border-transparent transition hover:border-[#80004c]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-[#80004c] text-center mb-6">
          Send Notice
        </h1>

        {/* Message Field */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition"
          ></textarea>
        </div>

        {/* Batch Field */}
        <div className="mb-6">
          <label
            htmlFor="batch"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Batch
          </label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={year}
            onChange={(e)=>setYear(e.target.value)}
            placeholder="Enter batch (e.g., 2025)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#80004c] to-purple-500 text-white font-semibold text-lg rounded-xl shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
        >
          Submit
        </button>

        {/* Response Message */}
        {/* {responseMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              responseMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {responseMessage}
          </p> */}
        {/* )} */}
      </form>
    </div>
  );
};
export default MessageBox;

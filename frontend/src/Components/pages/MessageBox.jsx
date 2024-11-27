import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2 } from 'lucide-react'; // Trash icon for deleting messages

const MessageBox = (props) => {
  const [formData, setFormData] = useState({
    message: "",
    batch: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("Submitting...");

    try {
      const response = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResponseMessage("Form submitted successfully!");
        setFormData({ message: "", batch: "" });
      } else {
        setResponseMessage("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-4">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg border-4 border-transparent transition hover:border-blue-500"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Send Message
        </h1>

        {/* Message Field */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition"
          ></textarea>
        </div>

        {/* Batch Field */}
        <div className="mb-6">
          <label
            htmlFor="batch"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Batch
          </label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="Enter batch (e.g., 2025)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
        >
          Submit
        </button>

        {/* Response Message */}
        {responseMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              responseMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {responseMessage}
          </p>
        )}
      </form>
    </div>
  );
};
export default MessageBox;

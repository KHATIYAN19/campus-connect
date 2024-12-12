import React, { useState, useEffect } from "react";
import axios from "../LoginSignUp/axios";
import { z } from "zod";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const InterviewExperiences = ({ show }) => {
  const [experiences, setExperiences] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/interview/getall")
      .then((res) => {
        setExperiences(res.data.interview || []); 
      })
      .catch((error) => {
        console.error("Error fetching experiences:", error);
        setExperiences([]); // Set empty if error occurs
      });
  }, []);

  const calculateDaysAgo = (createdDate) => {
    const currentDate = new Date();
    const createdDateObj = new Date(createdDate);
    const diffInTime = currentDate - createdDateObj;
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // Convert time difference into days
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate().toString().padStart(2, "0")}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getFullYear()}`;
  };

  const [expanded, setExpanded] = useState(null);
  const toggleReadMore = (id) => {
    setExpanded(expanded === id ? null : id); // Toggle Read More functionality
  };

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    company: z.string().min(2, "Company name must be at least 2 characters long"),
    experience: z.string().min(50, "Experience must be at least 50 characters long"),
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formSchema.parse(formData);
      setFormErrors({});
      const response = await axios.post("http://localhost:8080/interview/post", formData);
      setExperiences([response.data.interview, ...experiences]);
      setFormData({ title: "", company: "", experience: "" });
      setIsFormVisible(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error submitting form:", error);
        toast.error("Failed to share experience. Please try again.");
      }
    }
  };

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  // Properly applying slice to limit the number of experiences displayed
  const experiencesToDisplay = !show ? experiences.slice(0, 2) : experiences;

  return (
    <div className="min-h-screen bg-green-50 p-4 sm:p-8">
      {show && (
        <>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
            Share Your Interview Experiences!
          </h1>
          <div className="text-center mb-8">
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-all duration-300 shadow-md"
              onClick={openForm}
            >
              Share Your Experience
            </button>
          </div>
        </>
      )}
      {/* {!show && (
        <div className="text-black text-center text-2xl sm:text-3xl font-bold mb-6">
          Interview Experiences
        </div>
      )} */}
  
      <div className="space-y-8">
        {experiencesToDisplay.map((experience, index) => (
          <div
            key={experience._id}
            className="flex flex-col bg-white shadow-lg p-6 hover:scale-105 transition-transform duration-300 max-w-3xl mx-auto rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-right">
                <p className="font-bold text-blue-500 text-lg">{experience.company}</p>
                <p className="text-gray-600 text-sm">{formatDate(experience.createdAt)}</p>
              </div>
            </div>
            <div className="mb-4">
              <div
                className="flex items-center mb-4 cursor-pointer"
                onClick={() => navigate(`/user/profile/${experience.postby._id}`)}
              >
                <img
                  src={experience.postby.image}
                  alt="User"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-gray-300"
                />
                <div className="ml-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {experience.postby.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {calculateDaysAgo(experience.createdAt)} days ago
                  </p>
                </div>
              </div>
              <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
                {experience.title}
              </h3>
              <p
                className={`text-gray-600 mb-4 ${expanded === experience._id ? '' : 'line-clamp-3'}`}
              >
                {expanded === experience._id
                  ? experience.description
                  : `${experience.description?.slice(0, 100) || ''}...`}
              </p>
  
              <button
                className="text-blue-500 hover:underline font-medium"
                onClick={() => toggleReadMore(experience._id)}
              >
                {expanded === experience._id ? 'Read less' : 'Read more →'}
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl w-full sm:w-3/4 lg:w-1/2 relative">
            <button
              className="absolute top-2 right-2 text-xl font-semibold text-gray-500 hover:text-gray-800"
              onClick={closeForm}
            >
              &times;
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
              Share Your Experience
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title of Your Experience:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full px-4 py-3 border ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>
  
              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name:
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full px-4 py-3 border ${
                    formErrors.company ? 'border-red-500' : 'border-gray-300'
                  } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.company && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>
                )}
              </div>
  
              <div className="mb-6">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Your Experience:
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows="6"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full px-4 py-3 border ${
                    formErrors.experience ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                ></textarea>
                {formErrors.experience && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                )}
              </div>
  
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-red-600 transition-all duration-300 shadow-md"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default InterviewExperiences;

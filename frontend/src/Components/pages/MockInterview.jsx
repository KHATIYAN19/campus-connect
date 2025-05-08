import { useEffect, useState } from "react";
import axios from "../LoginSignUp/axios"; // Assuming this is your configured axios instance
import { z } from "zod";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";
import { Dialog } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import { useSelector } from "react-redux";
import { FiClock, FiCalendar, FiUser, FiCheckCircle, FiLink, FiInfo, FiEdit3, FiLoader, FiX } from 'react-icons/fi'; // Import icons

// --- Configuration ---
const BASE_URL = "http://localhost:8080/mock"; // Use uppercase for constants

// --- Zod Schema (minor refinement for clarity) ---
const mockSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  details: z.string().min(10, { message: "Details must be at least 10 characters." }),
  // year: z.number().int().min(new Date().getFullYear(), { message: "Year must be current or future." }), // Optional: Restrict year if needed
  startTime: z.string().refine((val) => {
    try {
      const start = new Date(val);
      const now = new Date();
      // Ensure time is set (datetime-local can return only date if time is missing)
      if (isNaN(start.getTime())) return false;
      const maxDate = addDays(now, 15); // Allow interviews up to 15 days in the future
      // Add a small buffer (e.g., 1 minute) to avoid issues with "now" being exactly the start time
      return isAfter(start, addMinutes(now, 1)) && isBefore(start, maxDate);
    } catch {
      return false;
    }
  }, { message: "Start time must be in the future and within the next 15 days." }),
  duration: z.enum(["30", "45", "60"], { errorMap: () => ({ message: "Please select a valid duration." }) }),
  link: z.string().url({ message: "Please enter a valid meeting URL (e.g., http://... or https://...)." }),
});

// --- Helper: Add minutes to date (needed for startTime validation refinement) ---
import { addMinutes } from 'date-fns';

// --- Component ---
export default function MockInterviewPage() {
  const user = useSelector((state) => state.auth.user); // Assuming user structure { _id, name, email }

  // --- State ---
  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    details: "",
    // year: new Date().getFullYear(), // Default to current year
    startTime: "",
    duration: "30",
    link: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // For form submission
  const [acceptingMockId, setAcceptingMockId] = useState(null); // Track which mock is being accepted

  // --- Effects ---
  useEffect(() => {
    fetchMocks();
  }, []);

  // --- Data Fetching ---
  const fetchMocks = async () => {
    setIsLoading(true); // Set loading true when fetching starts
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      // Sort mocks by startTime, earliest first
      const sortedMocks = (res.data.mocks || []).sort((a, b) =>
        new Date(a.startTime) - new Date(b.startTime)
      );
      setMocks(sortedMocks);
    } catch (error) {
      console.error("Error fetching mock interviews:", error);
      toast.error("Failed to load mock interviews. Please try again later.");
      setMocks([]); // Clear mocks on error
    } finally {
      setIsLoading(false); // Set loading false when fetching finishes
    }
  };

  // --- Event Handlers ---
  const handleAccept = async (id) => {
    setAcceptingMockId(id); // Indicate acceptance is in progress for this specific mock
    try {
      await axios.post(`${BASE_URL}/accept/${id}`);
      toast.success("Mock Interview Accepted!");
      fetchMocks(); // Refresh the list to show updated status
    } catch (error) {
      console.error("Error accepting mock interview:", error);
      toast.error(error.response?.data?.message || "Error accepting interview. It might already be taken.");
    } finally {
      setAcceptingMockId(null); // Reset accepting state regardless of outcome
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrors({}); // Clear previous errors

    // Frontend validation with Zod
    const result = mockSchema.safeParse({
      ...form,
      // year: parseInt(form.year, 10), // Ensure year is a number if you keep it
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmittingForm(true);
    try {
      // Assuming your backend expects the data in this format
      await axios.post(`${BASE_URL}/create`, result.data); // Send validated data
      toast.success("Mock interview created successfully!");
      setShowForm(false); // Close modal on success
      setForm({ // Reset form
         topic: "",
         details: "",
         // year: new Date().getFullYear(),
         startTime: "",
         duration: "30",
         link: "",
      });
      fetchMocks(); // Refresh the list
    } catch (error) {
      console.error("Error creating mock interview:", error);
      toast.error(error.response?.data?.message || "Error creating mock interview. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // --- Rendering ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Toaster for notifications - Placed high in the component tree */}
      <Toaster
         position="top-center"
         reverseOrder={false}
         toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
                 duration: 4000,
            }
         }}
      />

      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-64 md:h-72 rounded-b-xl mx-auto max-w-7xl shadow-lg mb-8" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-xl flex flex-col justify-end items-center text-white text-center p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-md">Mock Interview Hub</h1>
          <p className="mb-4 text-sm md:text-lg max-w-xl drop-shadow">Sharpen your skills. Schedule or accept peer-led mock interviews.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center space-x-2"
          >
            <FiEdit3 />
            <span>Create New Interview</span>
          </button>
        </div>
      </div>

      {/* Mock List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 px-2">Available Mock Interviews</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <FiLoader className="animate-spin text-4xl text-indigo-600" />
            <span className="ml-3 text-lg text-gray-600">Loading Interviews...</span>
          </div>
        ) : mocks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
            <FiInfo className="mx-auto text-5xl text-gray-400 mb-3" />
            <p className="text-gray-600 text-lg">No mock interviews available right now.</p>
            <p className="text-gray-500">Why not create one to get started?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mocks.map((mock) => {
              const isOwner = user?._id === mock.author?._id;
              const isAccepted = !!mock.acceptedBy;
              const canAccept = !isOwner && !isAccepted;
              const isBeingAccepted = acceptingMockId === mock._id; // Check if this specific mock is being accepted

              return (
                <div
                  key={mock._id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border ${
                    isAccepted ? 'border-green-300' : 'border-gray-200'
                  }`}
                >
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-indigo-700 mb-2 truncate">{mock.topic}</h3>
                    <p className="text-sm text-gray-600 mb-4 h-16 overflow-y-auto custom-scrollbar">{mock.details}</p> {/* Fixed height with scroll */}

                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-indigo-500" />
                        <span>{format(parseISO(mock.startTime), "eee, MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="text-indigo-500" />
                        <span>{mock.duration} minutes</span>
                      </div>
                      {/* Year is often implied by date, maybe remove? Or keep if specific need */}
                      {/* <div className="flex items-center space-x-2">
                        <FiHash className="text-indigo-500" />
                        <span>Year: {mock.year}</span>
                      </div> */}
                       <div className="flex items-center space-x-2">
                           <FiLink className="text-indigo-500" />
                           <a href={mock.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{mock.link}</a>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                      <div className="flex items-center space-x-2">
                        <FiUser />
                        <span>Created by: <strong>{mock.author?.name || "Unknown User"}</strong> ({mock.author?.email || "No email"})</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="bg-gray-50 px-5 py-3 border-t">
                    {isAccepted ? (
                       <div className="flex items-center justify-center space-x-2 text-green-600 font-semibold">
                           <FiCheckCircle />
                           <span>Accepted by {mock.acceptedBy?.name || 'Someone'}</span> {/* Adjust if you get acceptor name */}
                       </div>
                    ) : isOwner ? (
                       <div className="text-center text-sm text-gray-500 font-medium">You created this</div>
                    ) : (
                      <button
                        onClick={() => handleAccept(mock._id)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out text-white ${
                          isBeingAccepted
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                        disabled={isBeingAccepted} // Disable only when this specific mock is being accepted
                      >
                        {isBeingAccepted ? (
                          <>
                            <FiLoader className="animate-spin mr-2" />
                            Accepting...
                          </>
                        ) : (
                          'Accept Interview'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Interview Modal (Dialog) */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                 <Dialog.Title className="text-xl font-semibold text-gray-800">Create New Mock Interview</Dialog.Title>
                 <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <FiX size={24} />
                 </button>
             </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Topic */}
              <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                      type="text"
                      id="topic"
                      name="topic"
                      placeholder="e.g., React Hooks, System Design"
                      value={form.topic}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded-md shadow-sm ${errors.topic ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-invalid={errors.topic ? "true" : "false"}
                      aria-describedby={errors.topic ? "topic-error" : undefined}
                  />
                  {errors.topic && <p id="topic-error" className="text-red-600 text-xs mt-1">{errors.topic}</p>}
              </div>

               {/* Details */}
              <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details / Requirements</label>
                  <textarea
                      id="details"
                      name="details"
                      rows="3"
                      placeholder="Describe the focus, expected level, or any specific requirements..."
                      value={form.details}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded-md shadow-sm ${errors.details ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-invalid={errors.details ? "true" : "false"}
                      aria-describedby={errors.details ? "details-error" : undefined}
                  />
                  {errors.details && <p id="details-error" className="text-red-600 text-xs mt-1">{errors.details}</p>}
              </div>

              {/* Date and Time */}
              <div>
                 <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                 <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded-md shadow-sm ${errors.startTime ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                    aria-invalid={errors.startTime ? "true" : "false"}
                    aria-describedby={errors.startTime ? "startTime-error" : undefined}
                 />
                 {errors.startTime && <p id="startTime-error" className="text-red-600 text-xs mt-1">{errors.startTime}</p>}
              </div>

              {/* Duration */}
              <div>
                 <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                 <select
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded-md shadow-sm ${errors.duration ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
                    aria-invalid={errors.duration ? "true" : "false"}
                    aria-describedby={errors.duration ? "duration-error" : undefined}
                 >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                 </select>
                 {errors.duration && <p id="duration-error" className="text-red-600 text-xs mt-1">{errors.duration}</p>}
              </div>

               {/* Meeting Link */}
              <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                  <input
                      type="url"
                      id="link"
                      name="link"
                      placeholder="https://meet.google.com/..."
                      value={form.link}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded-md shadow-sm ${errors.link ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-invalid={errors.link ? "true" : "false"}
                      aria-describedby={errors.link ? "link-error" : undefined}
                   />
                  {errors.link && <p id="link-error" className="text-red-600 text-xs mt-1">{errors.link}</p>}
              </div>

               {/* Submit Button */}
              <div className="pt-2">
                 <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                      isSubmittingForm
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                 >
                    {isSubmittingForm ? (
                       <>
                         <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                         Submitting...
                       </>
                    ) : (
                       'Create Interview'
                    )}
                 </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

       {/* Add some custom scrollbar styling if needed */}
       <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #aaa;
            }
       `}</style>
    </div>
  );
}
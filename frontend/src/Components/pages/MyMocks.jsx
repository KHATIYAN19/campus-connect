import { useEffect, useState } from "react";
import axios from "../LoginSignUp/axios"; // Assuming this is your configured axios instance
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast'; // Import toast
import {
    FaTrash,
    FaTimesCircle,
    FaCalendarAlt,
    FaClock,
    FaLink,
    FaUser,
    FaCheckCircle,
    FaInfoCircle,
    FaBookOpen,
    FaExclamationTriangle,
    FaBan // Added Icon for Cancelled status
} from 'react-icons/fa'; // Import desired icons
// import YourLogoComponent from './path/to/YourLogoComponent'; // <-- Import your logo component if you have one

const baseURL = "http://localhost:8080/mock"; // Ensure this is correct

export function MyMocks() {
    const user = useSelector((state) => state.auth.user);

    const [mocks, setMocks] = useState([]);
    const [userId, setUserId] = useState(user?._id || null);
    const [selectedMock, setSelectedMock] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyMocks = async () => {
        setIsLoading(true);
        try {
            await toast.promise(
                axios.get(`${baseURL}/my`),
                {
                    loading: 'Fetching your mocks...',
                    success: (res) => {
                        console.log(res)
                        // Sort mocks, maybe by start time? (Optional)
                        const sortedMocks = (res.data.mocks || []).sort((a, b) =>
                            new Date(a.startTime) - new Date(b.startTime)
                        );
                        setMocks(sortedMocks); // Ensure mocks is always an array
                        if (res.data.userId) {
                            setUserId(res.data.userId);
                        } else if (!userId && user?._id) {
                            setUserId(user._id);
                        }
                        setIsLoading(false);
                        return 'Mocks loaded successfully!';
                    },
                    error: (err) => {
                        console.error("Error fetching mocks:", err);
                        setMocks([]);
                        setIsLoading(false);
                        return err.response?.data?.message || 'Could not fetch mocks.';
                    },
                }
            );
        } catch (error) {
            console.error("Unhandled fetch error:", error);
            setIsLoading(false);
        }
    };

    // --- Actions (Cancel/Delete) ---
    const handleCancel = async (id) => {
        toast.promise(
            axios.post(`${baseURL}/cancel/${id}`),
            {
                loading: 'Sending cancellation request...',
                success: (res) => {
                    // Instead of immediate fetch, optimistic update + fetch?
                    // Or just rely on fetch to get the 'isCancelled' status
                    fetchMyMocks(); // Refresh list on success
                    return res.data?.message || 'Mock interview cancelled!';
                },
                error: (err) => {
                    console.error("Error cancelling mock:", err);
                    return err.response?.data?.message || 'Failed to cancel interview.';
                },
            }
        );
    };

    const handleDelete = async (id) => {
        toast.promise(
            axios.delete(`${baseURL}/delete/${id}`),
            {
                loading: 'Deleting mock interview...',
                success: (res) => {
                    fetchMyMocks(); // Refresh list on success
                    return res.data?.message || 'Mock interview deleted!';
                },
                error: (err) => {
                    console.error("Error deleting mock:", err);
                    return err.response?.data?.message || 'Failed to delete interview.';
                },
            }
        );
    };

    // --- Helper Functions ---
    const openConfirm = (mock, type) => {
        setSelectedMock({ id: mock._id, type });
        setConfirmOpen(true);
    };

    const isFuture = (time) => {
        try {
            return new Date(time) > new Date();
        } catch (e) {
            return false;
        }
    };

    // --- Effects ---
    useEffect(() => {
        if (user?._id) {
            setUserId(user._id);
            fetchMyMocks();
        } else {
            setIsLoading(false);
            setMocks([]);
             // Don't show error on initial load if user is just not logged in
            // Only show if they *were* logged in and lost session? Depends on app flow.
            // Consider removing this toast or making it conditional.
            // toast.error("Please log in to view your mocks.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]); // Rerun effect if the user ID changes

    // --- Render Logic ---
    const renderUserInfo = (userData, label) => {
        if (!userData) {
            return (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-800 flex items-center gap-2"><FaUser /> {label}:</p>
                    <p className="pl-5 italic">Not yet assigned.</p>
                </div>
            );
        }
        return (
            <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="font-semibold text-gray-800 flex items-center gap-2"><FaUser /> {label}:</p>
                <p className="pl-5">Name: {userData.name || "N/A"}</p>
                <p className="pl-5">Email: {userData.email || "N/A"}</p>
                <p className="pl-5">Phone: {userData.phone || "N/A"}</p>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-100">
            {/* --- Toaster Container --- */}
            {/* Changed position to top-center */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* --- Page Header --- */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 md:p-5 rounded-xl text-center text-2xl md:text-3xl font-bold text-white shadow-lg mb-6 md:mb-8">
                My Mock Interviews
            </div>

            {/* --- Loading State --- */}
            {isLoading && (
                <div className="text-center text-gray-500 text-lg mt-10">
                    Loading your scheduled interviews...
                </div>
            )}

            {/* --- Empty State --- */}
            {!isLoading && mocks.length === 0 && (
                <div className="text-center text-gray-500 text-lg mt-10 bg-white p-6 rounded-lg shadow ">
                    You haven't scheduled or accepted any mock interviews yet.
                </div>
            )}

            {/* --- Mock Interview Cards List (One per row) --- */}
            {/* Changed from grid to vertical stack using space-y */}
            {!isLoading && mocks.length > 0 && (
                <div className="space-y-6"> {/* <-- Changed class here */}
                    {mocks.map((mock) => {
                        // Validation: Ensure mock and essential fields exist
                        if (!mock || !mock._id || !mock.startTime) return null; // Skip rendering invalid mock data

                        const canModify = isFuture(mock.startTime);
                        const isAuthor = userId && mock.author?._id && userId === mock.author._id;
                        const isCancelled = mock.isCancelled === true; // Explicitly check for true

                        return (
                            <div
                                key={mock._id}
                                className={`bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col justify-between ${isCancelled ? 'opacity-70 border-l-4 border-red-400' : ''}`} // Add visual hint for cancelled
                            >
                                {/* Card Content */}
                                <div>
                                    {/* Topic */}
                                    <h2 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                                        <FaBookOpen className="text-indigo-500" />
                                        {mock.topic || "No Topic Provided"}
                                    </h2>

                                    {/* Details */}
                                    {mock.details && (
                                        <p className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                                            <FaInfoCircle className="text-gray-400 mt-1 flex-shrink-0" />
                                            <span>{mock.details}</span>
                                        </p>
                                    )}

                                    {/* Time & Duration */}
                                    <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                                        <p className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-teal-600" />
                                            Start: {format(new Date(mock.startTime), "eee, MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaClock className="text-orange-500" />
                                            Duration: {mock.duration || "N/A"} mins
                                        </p>
                                    </div>

                                    {/* Meeting Link */}
                                    <p className="text-sm mt-1 mb-4 flex items-start gap-2">
                                        <FaLink className="text-blue-500 mt-1 flex-shrink-0" />
                                        <span className="break-words">
                                            Meeting Link:{" "}
                                            <a
                                                href={mock.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                                {mock.meetingLink || "No Link Provided"}
                                            </a>
                                        </span>
                                    </p>

                                    {/* Author Info */}
                                    {renderUserInfo(mock.author, "Interview Author")}

                                    {/* Accepted By Info */}
                                    {renderUserInfo(mock.acceptedBy, mock.author?._id === mock.acceptedBy?._id ? "Accepted By (Self)" : "Accepted By")}
                                </div>

                                {/* Action Buttons Area / Cancelled Status */}
                                <div className="mt-5 pt-4 border-t border-gray-200">
                                    {/* == NEW: Check if mock is cancelled == */}
                                    {isCancelled ? (
                                        <div className="flex items-center justify-end gap-2 text-red-600 font-semibold">
                                            {/* <YourLogoComponent className="h-5 w-5" /> */} {/* <-- Optional: Place your logo here */}
                                            <FaBan />
                                            <span>Cancelled</span>
                                        </div>
                                    ) : (
                                        /* == Original Button Logic (only show if NOT cancelled) == */
                                        canModify ? (
                                            <div className="flex gap-3 justify-end">
                                                {/* Show DELETE if the current user is the author */}
                                                {isAuthor && (
                                                    <button
                                                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-150 ease-in-out"
                                                        onClick={() => openConfirm(mock, "delete")}
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                )}
                                                {/* Show CANCEL if the user is involved (accepted OR is author and someone else accepted) */}
                                                 {(!isAuthor && userId && mock.acceptedBy?._id === userId) || (isAuthor && mock.acceptedBy && mock.author?._id !== mock.acceptedBy?._id ) ? (
                                                    <button
                                                        className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-150 ease-in-out"
                                                        onClick={() => openConfirm(mock, "cancel")}
                                                    >
                                                        <FaTimesCircle /> Cancel My Participation
                                                    </button>
                                                 ) : null}
                                                 {/* Added case: Author can cancel if NO ONE has accepted yet */}
                                                 {isAuthor && !mock.acceptedBy && (
                                                      <button
                                                        className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-150 ease-in-out"
                                                        onClick={() => openConfirm(mock, "cancel")} // Still uses 'cancel' logic on backend? Or should this be delete? Assuming 'cancel' endpoint handles this.
                                                    >
                                                        <FaTimesCircle /> Cancel Request
                                                    </button>
                                                 )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-right italic">
                                                Interview time has passed.
                                            </p>
                                        )
                                    )}
                                    {/* == End of Cancelled Check == */}

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- Confirmation Dialog (Unchanged) --- */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 shadow-xl border border-gray-200">
                        <Dialog.Title className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FaExclamationTriangle className="text-red-500"/>
                            Confirm Action
                        </Dialog.Title>
                        <p className="text-gray-600">
                            Are you sure you want to {selectedMock?.type === 'delete' ? 'delete' : 'cancel your participation in'} this mock interview? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Close
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-white text-sm font-medium transition ${
                                    selectedMock?.type === 'delete'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                }`}
                                onClick={() => {
                                    if (selectedMock) {
                                        if (selectedMock.type === "delete") {
                                            handleDelete(selectedMock.id);
                                        } else {
                                            handleCancel(selectedMock.id);
                                        }
                                    }
                                    setConfirmOpen(false);
                                }}
                            >
                                Confirm {selectedMock?.type === 'delete' ? 'Deletion' : 'Cancellation'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
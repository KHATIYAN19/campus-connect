import React, { useState, useEffect } from "react";
import axios from "../LoginSignUp/axios.js"; // Ensure path is correct
// import { toast } from "react-toastify"; // Removed react-toastify
import toast, { Toaster } from 'react-hot-toast'; // Added react-hot-toast
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"; // Assuming path is correct
import { Input } from "../ui/input.jsx"; // Assuming path is correct
import { Button } from "../ui/button.jsx"; // Assuming path is correct
import { Loader2, UserPlus, Trash2, ListX, Ban } from "lucide-react";

const Blocked = () => {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingEmail, setDeletingEmail] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost:8080/blocked/allUser") // Ensure endpoint
            .then((res) => {
                setBlockedUsers(res.data.data || []);
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                // Use react-hot-toast
                toast.error("Failed to fetch blocked users list.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const addHandler = async (e) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
             // Use react-hot-toast (warning requires custom styling or use error/success)
             // Using error for invalid input might be okay, or just prevent submission
             toast.error("Please enter a valid email address.");
            return;
        }
        setIsAdding(true);
        try {
            const { data } = await axios.post("http://localhost:8080/blocked/addUser", { email }); // Ensure endpoint
            if (data.success) {
                 // Use react-hot-toast
                toast.success(`User ${email} blocked successfully.`);
                setEmail("");
                // Optimistic update might need adjustment based on actual API response structure if it returns the added user object
                setBlockedUsers(prev => [...prev, { email }]);
            } else {
                 // Use react-hot-toast
                toast.error(data.message || "Failed to block user.");
            }
        } catch (err) {
            console.error("Add Error:", err);
             // Use react-hot-toast
            toast.error(err?.response?.data?.message || "An error occurred while blocking.");
        } finally {
            setIsAdding(false);
        }
    };

    const deleteHandler = async (emailToDelete) => {
        setDeletingEmail(emailToDelete);
        // Optionally add a loading toast for deletion
        const deletingToast = toast.loading(`Unblocking ${emailToDelete}...`);
        try {
            const { data } = await axios.delete(`http://localhost:8080/blocked/deleteUser/${emailToDelete}`); // Ensure endpoint
            if (data.success) {
                 toast.dismiss(deletingToast); // Dismiss loading toast
                 // Use react-hot-toast
                toast.success(`User ${emailToDelete} unblocked successfully.`);
                setBlockedUsers(prev => prev.filter(user => user.email !== emailToDelete));
            } else {
                 toast.dismiss(deletingToast); // Dismiss loading toast
                 // Use react-hot-toast
                toast.error(data.message || "Failed to unblock user.");
            }
        } catch (err) {
            toast.dismiss(deletingToast); // Dismiss loading toast
            console.error("Delete Error:", err);
             // Use react-hot-toast
            toast.error(err?.response?.data?.message || "An error occurred while unblocking.");
        } finally {
            setDeletingEmail(null);
        }
    };

    return (
        // Use a light gray background for the page
        <div className="min-h-screen bg-gray-100 py-10 font-sans">
             {/* Add Toaster component for react-hot-toast */}
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

                {/* Card for Adding/Blocking Users - White background */}
                <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <CardHeader className="border-b border-gray-200 p-4 sm:p-5">
                        {/* Orange title */}
                        <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                             <Ban size={20} />
                             Block User Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5">
                        <form onSubmit={addHandler} className="flex flex-col sm:flex-row items-center gap-3">
                            <label htmlFor="blockEmail" className="sr-only">Email to block</label>
                            <Input
                                id="blockEmail"
                                type="email"
                                placeholder="Enter user email address to block"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                // White input, gray border, orange focus
                                className="flex-grow bg-white border-gray-300 rounded-lg h-11 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                                disabled={isAdding}
                            />
                            <Button
                                type="submit"
                                disabled={isAdding}
                                // Orange button
                                className="w-full sm:w-auto h-11 px-5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            >
                                {isAdding ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <UserPlus className="w-4 h-4" />
                                )}
                                <span>{isAdding ? "Blocking..." : "Block User"}</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Card for Displaying Blocked Users - White background */}
                <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <CardHeader className="border-b border-gray-200 p-4 sm:p-5">
                         {/* Gray title with orange count */}
                        <CardTitle className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                            <span>Blocked Users List</span>
                            {!isLoading && (
                                <span className="ml-2 text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full font-medium text-xs">
                                    {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5">
                        {isLoading ? (
                            // Orange loader on white background
                            <div className="flex justify-center items-center py-10 text-orange-600">
                                <Loader2 className="animate-spin w-8 h-8" />
                            </div>
                        ) : blockedUsers.length === 0 ? (
                            // Gray text/icon for empty state
                            <div className="text-center py-8 text-gray-500">
                                <ListX className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-sm">No users are currently blocked.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {blockedUsers.map((item) => ( // Removed idx as key is item.email
                                    <div
                                        key={item.email} // Use email as key assuming it's unique
                                        // Gray background for list items
                                        className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            {/* Darker gray text */}
                                            <span className="text-sm text-gray-700 font-medium truncate" title={item.email}>{item.email}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteHandler(item.email)}
                                            disabled={deletingEmail === item.email}
                                             // Gray icon, red hover state
                                            className="p-1.5 h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200 opacity-70 group-hover:opacity-100"
                                            aria-label={`Unblock ${item.email}`}
                                        >
                                            {deletingEmail === item.email ? (
                                                <Loader2 className="animate-spin w-4 h-4 text-orange-600" /> // Orange spinner when deleting
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Blocked;
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming path is correct
import { Home, SearchX } from "lucide-react"; // Import appropriate icons

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        // Apply the light theme gradient background
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-stone-100 to-amber-100 text-stone-800 px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }} // Simplified initial animation
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center space-y-6 bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-stone-200 max-w-md w-full" // Added a containing card
            >
                {/* Optional: Add an illustrative icon */}
                <motion.div
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                >
                    <SearchX className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-orange-400" strokeWidth={1.5}/>
                </motion.div>

                {/* Themed "404" Heading */}
                <motion.h1
                    className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600" // Themed gradient text
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                >
                    404
                </motion.h1>

                {/* Themed Message */}
                <motion.p
                    className="text-base sm:text-lg text-gray-600"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    Oops! The page you navigated to seems lost in the digital wilderness.
                </motion.p>

                {/* Themed Button */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                >
                    {/* Use the Button component with theme overrides or direct styling */}
                    <Button
                        // Apply theme colors and styles
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base font-medium inline-flex items-center gap-2 group"
                        onClick={() => navigate("/")} // Navigate to home or previous sensible route
                    >
                        <Home size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Go Back Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
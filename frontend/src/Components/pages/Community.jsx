import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaRegCommentDots, FaRegThumbsUp, FaTimes, FaSpinner } from 'react-icons/fa'; // Added FaSpinner
import axios from '../LoginSignUp/axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Schema for the new discussion form
const discussionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters long').max(150, 'Heading must be 150 characters or less'),
  content: z.string().min(10, 'Content must be at least 10 characters long').max(5000, 'Content must be 5000 characters or less'),
});

// Utility function to format time difference
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (isNaN(seconds) || seconds < 0) return 'just now';
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds)} second${seconds !== 1 ? 's' : ''} ago`;
}

// Utility function to truncate text
function truncateContent(content, maxLength = 150) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
}

// Available filter options
const filterOptions = [
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'mostCommented', label: 'Most Commented' },
  { key: 'recent', label: 'Recent' },
  { key: 'oldest', label: 'Oldest' },
];

// Fallback image URL
const FALLBACK_AVATAR = 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?';

// Community Page Component
function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('recent');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
        heading: '',
        content: '',
    }
  });

  // Function to fetch posts from API
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Updated endpoint assuming it's /get/allpost as per previous context
      const response = await axios.get('http://localhost:8080/post/get/allpost');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
      } else {
          console.error("Invalid data structure received:", response.data);
          setError("Failed to fetch posts: Invalid data format.");
          setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch posts.';
      setError(errorMessage);
      toast.error(`Error fetching posts: ${errorMessage}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Memoized sorted posts based on active filter
  const sortedPosts = useMemo(() => {
    let sorted = [...posts];
    try {
        switch (activeFilter) {
          case 'mostLiked':
            sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
            break;
          case 'mostCommented':
            sorted.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
            break;
          case 'oldest':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'recent':
          default:
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
    } catch (sortError) {
        console.error("Error sorting posts:", sortError);
        // Fallback sort
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [posts, activeFilter]);

  // Handlers
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const handlePostClick = (postId) => {
    if (!postId) {
        console.error("Cannot navigate: Post ID is missing.");
        return;
    }
    const targetUrl = `/post/description/${postId}`;
    console.log(`Navigating to: ${targetUrl}`);
    navigate(targetUrl);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  }

  // Form submission handler
  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Submitting discussion...');
    try {
      const response = await axios.post('http://localhost:8080/post/create', data);
      toast.dismiss(loadingToast);
      if (response.data && response.data.success) {
          toast.success('Discussion posted successfully!');
          closeModal();
          fetchPosts(); // Refresh posts list
      } else {
          toast.error(response.data?.message || 'Failed to post discussion. Unexpected response.');
      }
    } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error submitting discussion:", error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to post discussion. Please try again.';
        toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 md:py-8 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Discussion</h1>
             <button
                onClick={openModal}
                // Apply consistent rounding
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 ease-in-out"
              >
                Start a New Discussion
              </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-300 pb-2">
                {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                // Apply consistent rounding (rounded-lg)
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out
                  ${
                    activeFilter === filter.key
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Posts List Container - Already rounded */}
          <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {loading ? (
                <p className="text-center text-gray-500 p-6">Loading posts...</p>
            ) : error ? (
                <p className="text-center text-red-600 p-6">Error: {error}</p>
            ) : sortedPosts.length > 0 ? (
              sortedPosts.map((post, index) => (
                <React.Fragment key={post._id}>
                  <div
                    onClick={() => handlePostClick(post._id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Author Info */}
                    <div className="flex items-center mb-2">
                         <img
                            src={post.author?.image || FALLBACK_AVATAR}
                            alt={`${post.author?.name || 'Unknown Author'}'s avatar`}
                            // Avatar already rounded-full
                            className="w-8 h-8 rounded-full mr-3 object-cover bg-gray-300 flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src=FALLBACK_AVATAR; }}
                          />
                      <div className="flex-grow min-w-0">
                          <span className="text-sm font-medium text-black block truncate">{post.author?.name || 'Unknown Author'}</span>
                          <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                    {/* Post Details */}
                    <h2 className="text-lg font-semibold text-orange-600 mb-2 break-words">{post.heading}</h2>
                    <p className="text-sm text-gray-700 mb-3 break-words">
                        {truncateContent(post.content)}
                    </p>
                    {/* Likes/Comments Counts (Not buttons) */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                         <div className="flex items-center">
                           <FaRegThumbsUp className="mr-1 text-gray-400" />
                           <span>{post.likes?.length || 0}</span>
                         </div>
                         <div className="flex items-center">
                           <FaRegCommentDots className="mr-1 text-gray-400" />
                           <span>{post.comments?.length || 0}</span>
                         </div>
                    </div>
                  </div>
                  {/* Separator */}
                  {index < sortedPosts.length - 1 && (
                    <div className="border-b border-gray-200 mx-4"></div>
                  )}
                </React.Fragment>
              ))
            ) : (
                <p className="text-center text-gray-500 p-6">No posts found. Start the first discussion!</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for New Discussion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          {/* Modal content already rounded */}
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
             {/* Modal Close Button */}
             <button
                onClick={closeModal}
                // Apply rounding and hover effect
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold text-black mb-5">Create New Discussion</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Heading Input - Already rounded */}
                <div className="mb-4">
                    <label htmlFor="heading-modal" className="block text-sm font-medium text-gray-700 mb-1">
                        Heading
                    </label>
                    <input
                        type="text"
                        id="heading-modal" // Unique ID for label association
                        {...register('heading')}
                        // Already rounded-lg
                        className={`w-full px-3 py-2 border ${errors.heading ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                        placeholder="Enter discussion title..."
                        aria-invalid={errors.heading ? "true" : "false"}
                    />
                    {errors.heading && (
                        <p className="mt-1 text-xs text-red-600">{errors.heading.message}</p>
                    )}
                </div>

                {/* Content Textarea - Already rounded */}
                <div className="mb-6">
                    <label htmlFor="content-modal" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content-modal" // Unique ID for label association
                        rows={6}
                        {...register('content')}
                         // Already rounded-lg
                        className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                        placeholder="Share your thoughts..."
                        aria-invalid={errors.content ? "true" : "false"}
                    ></textarea>
                     {errors.content && (
                        <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
                    )}
                </div>

                {/* Modal Form Buttons */}
                <div className="flex justify-end space-x-3">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={closeModal}
                        // Apply consistent rounding (rounded-lg)
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out text-sm font-medium"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                     {/* Submit Button */}
                    <button
                        type="submit"
                         // Apply consistent rounding (rounded-lg)
                        className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out text-sm font-medium"
                        disabled={isSubmitting}
                    >
                         {isSubmitting ? (
                             <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                         ) : null}
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
              </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityPage;
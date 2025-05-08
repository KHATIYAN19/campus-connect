import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegCommentDots,
  FaTrashAlt,
  FaSpinner,
  FaPaperPlane,
  FaTimes,
  FaEdit,      
  FaSave,        
  FaTimesCircle 
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import axios from '../LoginSignUp/axios';
import { z } from 'zod';


const PostEditSchema = z.object({
  heading: z.string().min(5, { message: "Heading must be at least 5 characters long." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long." }),
});


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

const renderCommentContent = (text) => {
  if (!text) return null;
  const urlRegex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])|(\bwww\.[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (!part) return null;
    if (urlRegex.test(part)) {
      const href = part.startsWith('www.') ? `http://${part}` : part;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const FALLBACK_IMAGE = 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?';
const FALLBACK_COMMENT_IMAGE = 'https://via.placeholder.com/32/CCCCCC/FFFFFF?text=?';

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // --- Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeading, setEditedHeading] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!postId) {
      setError("Post ID is missing.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`/post/get/${postId}`);
      if (response.data && response.data.success && response.data.data) {
        const postData = response.data.data;
        setPost(postData);
        setComments(Array.isArray(postData.comments) ? postData.comments : []);
        setLikeCount(postData.likes?.length || 0);
        const initiallyLiked = user && Array.isArray(postData.likes) && postData.likes.includes(user._id);
        setIsLiked(initiallyLiked || false);
        // Initialize edit fields if data is loaded
        setEditedHeading(postData.heading || '');
        setEditedContent(postData.content || '');
      } else {
        throw new Error(response.data?.message || 'Invalid data format received.');
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load post details.';
      setError(errorMessage);
      setPost(null);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedComments = useMemo(() => {
    if (!Array.isArray(comments)) return [];
    return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments]);

  const handleLike = async () => {
    if (!postId || !post || !user) {
      toast.error("Cannot like post. Please log in.");
      return;
    };
    const originalLiked = isLiked;
    const originalCount = likeCount;

    setIsLiked(!originalLiked);
    setLikeCount(originalLiked ? Math.max(0, originalCount - 1) : originalCount + 1);

    try {
      const response = await axios.get(`/post/like/${postId}`);
      if (response.data?.success) {
        toast.success(originalLiked ? 'Post unliked' : 'Post liked');
      } else {
        toast.error(response.data?.message || 'Could not update like status.');
        setIsLiked(originalLiked);
        setLikeCount(originalCount);
      }
    } catch (err) {
      console.error("Failed to update like:", err);
      toast.error(err.response?.data?.message || 'Could not update like status.');
      setIsLiked(originalLiked);
      setLikeCount(originalCount);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
        toast.error('Comment cannot be empty.');
        return;
    }
    if (!postId || !user) {
        toast.error('Please log in to comment.');
        return;
    }

    setIsSubmittingComment(true);
    const submittingToast = toast.loading('Posting comment...');

    try {
      const response = await axios.post(`/post/comment/create`, {
        content: newComment,
        postId: postId
      });

      if (response.data && response.data.success && response.data.data) {
        const newCommentData = response.data.data;
        const augmentedComment = {
          ...newCommentData,
          createdAt: newCommentData.createdAt || new Date().toISOString(),
          author: {
            _id: user._id,
            name: user.name || 'You',
            image: user.image || FALLBACK_COMMENT_IMAGE
          }
        };

        setComments(prevComments => [augmentedComment, ...prevComments]);
        setPost(prevPost => prevPost ? { ...prevPost, comments: [augmentedComment, ...(prevPost.comments || [])] } : null);
        setNewComment('');
        toast.dismiss(submittingToast);
        toast.success('Comment posted!');
      } else {
        throw new Error(response.data?.message || "Failed to post comment.");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.dismiss(submittingToast);
      const errorMessage = err.response?.data?.message || err.message || 'Could not post comment.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || !user) return;

    const originalComments = comments;
    setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    const originalPost = post;
     setPost(prevPost => {
       if (!prevPost) return null;
       return {
           ...prevPost,
           comments: (prevPost.comments || []).filter(comment => comment._id !== commentId)
       };
     });

    const deletingToast = toast.loading('Deleting comment...');

    try {
      const response = await axios.delete(`/post/comment/delete/${commentId}`);
      if (response.data?.success) {
        toast.dismiss(deletingToast);
        toast.success('Comment deleted.');
      } else {
         setComments(originalComments);
         setPost(originalPost);
         throw new Error(response.data?.message || "Failed to delete comment.");
      }
    } catch (err) {
        console.error("Failed to delete comment:", err);
        toast.dismiss(deletingToast);
        setComments(originalComments);
        setPost(originalPost);
        const errorMessage = err.response?.data?.message || err.message || 'Could not delete comment.';
        toast.error(errorMessage);
    }
  };

  const openDeleteModal = () => {
     if (!user || !post || post.author?._id !== user._id) {
       toast.error("You are not authorized to delete this post.");
       return;
     }
     setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
     setIsDeleteModalOpen(false);
     setIsDeletingPost(false);
  };

  const confirmDeletePost = async () => {
    if (!postId || !user || !post || post.author?._id !== user._id) return;
    setIsDeletingPost(true);
    const deletingToast = toast.loading('Deleting post...');
    try {
      const response = await axios.delete(`/post/delete/${postId}`);
      if (response.data && response.data.success) {
        toast.dismiss(deletingToast);
        toast.success('Post deleted successfully!');
        closeDeleteModal();
        navigate('/discuss');
      } else {
        throw new Error(response.data?.message || "Failed to delete post.");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.dismiss(deletingToast);
      const errorMessage = err.response?.data?.message || err.message || 'Could not delete post.';
      toast.error(errorMessage);
      setIsDeletingPost(false);
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = () => {
      if (!post) return;
      setEditedHeading(post.heading);
      setEditedContent(post.content);
      setIsEditing(true);
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
      // Optionally reset edited fields to original post values if needed
      if(post) {
          setEditedHeading(post.heading);
          setEditedContent(post.content);
      }
  };

  const handleEditSubmit = async (e) => {
      e.preventDefault();
      if (!postId || !user || !post || post.author?._id !== user._id) {
          toast.error("You are not authorized to edit this post.");
          return;
      }

      // Validate using Zod
      const validationResult = PostEditSchema.safeParse({
          heading: editedHeading,
          content: editedContent
      });

      if (!validationResult.success) {
          validationResult.error.errors.forEach(err => toast.error(err.message));
          return;
      }

      setIsSubmittingEdit(true);
      const savingToast = toast.loading('Saving changes...');

      try {
          // Assuming PUT request to /post/edit/:postId
          const response = await axios.put(`/post/edit/${postId}`, {
              heading: editedHeading,
              content: editedContent
          });

          if (response.data && response.data.success && response.data.data) {
              // Update local post state with the returned updated post data
              setPost(response.data.data);
              setIsEditing(false); // Exit edit mode
              toast.dismiss(savingToast);
              toast.success('Post updated successfully!');
          } else {
              throw new Error(response.data?.message || "Failed to update post.");
          }
      } catch (err) {
          console.error("Failed to update post:", err);
          toast.dismiss(savingToast);
          const errorMessage = err.response?.data?.message || err.message || 'Could not update post.';
          toast.error(errorMessage);
      } finally {
          setIsSubmittingEdit(false);
      }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <FaSpinner className="animate-spin text-orange-500 text-4xl" />
        <span className="ml-3 text-gray-600">Loading Post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-red-600 bg-red-100 border border-red-400 rounded p-4">
          Error: {error} <Link to="/discuss" className="underline text-blue-600 hover:text-blue-800 ml-2">Go back</Link>
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10 px-4 text-gray-600">
        Post not found. <Link to="/discuss" className="underline text-blue-600 hover:text-blue-800 ml-2">Go back</Link>
      </div>
    );
  }

  const canEditOrDelete = user && post && post.author?._id === user._id;
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto bg-white p-5 sm:p-8 rounded-xl shadow-lg border border-gray-200 relative">

          <div className="absolute top-4 right-4 flex items-center space-x-3 z-10">
            <Link to="/discuss" className="text-sm text-orange-600 hover:underline">
              &larr; Back to Discussions
            </Link>
            {canEditOrDelete && !isEditing && ( // Show edit/delete only when not editing
              <>
                 <button
                    onClick={handleEditClick}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                    title="Edit Post"
                    aria-label="Edit Post"
                  >
                    <FaEdit size={16} />
                  </button>
                 <button
                    onClick={openDeleteModal}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete Post"
                    aria-label="Delete Post"
                  >
                    <FaTrashAlt size={16} />
                  </button>
              </>
            )}
          </div>

          <div className="flex items-center mb-4 mt-10 sm:mt-4">
            <img
              src={post.author?.image || FALLBACK_IMAGE}
              alt={`${post.author?.name || 'Author'}'s avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-300 flex-shrink-0 border border-gray-200"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
            />
            <div>
              <span className="text-base font-semibold text-gray-800 block">{post.author?.name || 'Unknown Author'}</span>
              <span className="text-xs text-gray-500">Posted {timeAgo(post.createdAt)}</span>
            </div>
          </div>

          {isEditing ? (
            // --- Edit Mode Form ---
            <form onSubmit={handleEditSubmit} className="space-y-4 mb-6">
                 <div>
                     <label htmlFor="edit-heading" className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                     <input
                        id="edit-heading"
                        type="text"
                        value={editedHeading}
                        onChange={(e) => setEditedHeading(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-2xl sm:text-3xl font-bold text-orange-600"
                        disabled={isSubmittingEdit}
                        required
                     />
                 </div>
                  <div>
                      <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        id="edit-content"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={8} // Adjust rows as needed
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-800 text-base leading-relaxed whitespace-pre-wrap break-words resize-y"
                        disabled={isSubmittingEdit}
                        required
                     />
                  </div>
                  <div className="flex justify-end items-center space-x-3 pt-2">
                      <button
                         type="button"
                         onClick={handleCancelEdit}
                         disabled={isSubmittingEdit}
                         className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out flex items-center"
                      >
                          <FaTimesCircle className="mr-1.5 h-4 w-4" /> Cancel
                      </button>
                      <button
                         type="submit"
                         disabled={isSubmittingEdit}
                         className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
                      >
                          {isSubmittingEdit ? (
                              <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                             <FaSave className="mr-1.5 h-4 w-4" />
                          )}
                          {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                 </div>
            </form>
          ) : (
            // --- Display Mode ---
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-5 break-words">
                {post.heading}
              </h1>
              <div className="text-gray-800 text-base leading-relaxed mb-6 whitespace-pre-wrap break-words prose max-w-none">
                {post.content}
              </div>
            </>
          )}


          <div className="flex items-center border-t border-gray-200 pt-4 mt-6">
            <button
              onClick={handleLike}
              className={`flex items-center px-3 py-1.5 rounded-full transition-colors duration-150 ease-in-out mr-3 ${
                isLiked
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-pressed={isLiked}
              disabled={!user || isEditing} // Disable like when editing
              title={user ? (isLiked ? 'Unlike post' : 'Like post') : 'Log in to like'}
            >
              {isLiked ? <FaThumbsUp className="mr-1.5" /> : <FaRegThumbsUp className="mr-1.5" />}
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            <span className="text-sm text-gray-500">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
              <FaRegCommentDots className="mr-2 text-gray-500" /> Comments ({sortedComments.length})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8 flex items-start space-x-3">
              {user && (
                   <img
                     src={user.image || FALLBACK_COMMENT_IMAGE}
                     alt="Your avatar"
                     className="w-9 h-9 rounded-full object-cover bg-gray-300 flex-shrink-0 mt-1 border border-gray-200"
                     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_COMMENT_IMAGE; }}
                   />
              )}
              {!user && (
                   <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 mt-1 border border-gray-200 flex items-center justify-center">
                     <FaRegCommentDots className="text-gray-500"/>
                   </div>
              )}
              <div className="relative flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition duration-150 ease-in-out resize-y min-h-[100px]"
                  placeholder={user ? "Add your comment... (URLs will become clickable)" : "Please log in to comment..."}
                  disabled={isSubmittingComment || !user || isEditing} // Disable commenting when editing
                  maxLength={2000}
                  aria-label="New comment input"
                />
                <button
                  type="submit"
                  className="absolute top-3 right-3 text-orange-500 hover:text-orange-600 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-full flex items-center justify-center transition-colors duration-150"
                  disabled={isSubmittingComment || !newComment.trim() || !user || isEditing} // Disable commenting when editing
                  aria-label="Post Comment"
                  title="Post Comment"
                >
                  {isSubmittingComment ? (
                    <FaSpinner className="animate-spin h-5 w-5 text-orange-600" />
                  ) : (
                    <FaPaperPlane className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3 relative group">
                    <img
                      src={comment.author?.image || FALLBACK_COMMENT_IMAGE}
                      alt={`${comment.author?.name || 'User'}'s avatar`}
                      className="w-9 h-9 rounded-full object-cover bg-gray-300 flex-shrink-0 mt-1 border border-gray-200"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_COMMENT_IMAGE; }}
                    />
                    <div className="flex-grow bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm min-w-0">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="flex items-baseline space-x-2 flex-wrap">
                             <span className="text-sm font-semibold text-gray-800 break-words">{comment.author?.name || 'Unknown User'}</span>
                             <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo(comment.createdAt)}</span>
                        </div>
                        {user && comment.author?._id === user._id && !isEditing && ( // Disable comment delete when editing
                          <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded-full hover:bg-red-100 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete comment"
                              aria-label="Delete comment"
                          >
                              <FaTrashAlt size={12} />
                          </button>
                        )}
                      </div>
                       <div className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                          {renderCommentContent(comment.content)}
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first!</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
               <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600">
                   <FaTimes size={20} />
               </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
               Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                disabled={isDeletingPost}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
                disabled={isDeletingPost}
              >
                {isDeletingPost ? (
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                {isDeletingPost ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostDetailPage;
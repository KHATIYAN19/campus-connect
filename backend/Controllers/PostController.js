import Post from "../Models/Post.js";
import User from "../Models/userModel.js";
import Comment from "../Models/Comment.js";



  export const likePost = async (req, res) => {
    try {
      const userId=req.user.id;
      const  postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found." });
      }
      const alreadyLiked = post.likes.includes(userId);
      if (alreadyLiked) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
      }
      await post.save();
      res.json({
        success: true,
        message: alreadyLiked ? "Post unliked." : "Post liked.",
        data: post,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
    

 
  

  export const createPost = async (req, res) => {
    try {
      const author_id=req.user.id;
      const {heading, content } = req.body;
      if (!author_id || !heading || !content) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
      const author = await User.findById(author_id);
      if (!author) {
        return res.status(404).json({ success: false, message: "Author not found." });
      }
      const post = await Post.create({ author: author_id, heading, content });
      res.status(201).json({ success: true, message: "Post created successfully.", data: post });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  


  export const updatePost = async (req, res) => {
    try {
      const author_id=req.user.id;
      const { id } = req.params;
      const { heading, content } = req.body;
  
      if (!heading || !content) {
        return res.status(400).json({ success: false, message: "All feilds are required." });
      }
      const p=await Post.findById(id);
      if(!p){
        return res.status(404).json({ success: false, message: "Post not found." });
      }
      if(p.author.toString()!==author_id){
        return res.status(404).json({ success: false, message: "You are not authorized for this"});
      }
      const post = await Post.findByIdAndUpdate(
        id,
        { heading, content },
        { new: true }
      );
  
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found." });
      }
      res.json({ success: true, message: "Post updated successfully.", data: post });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
 
  export const deletePost = async (req, res) => {
    try {
      const author_id=req.user.id;
      const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found." });
      }
      if(post.author.toString()!==author_id){
        return res.status(404).json({ success: false, message: "You are not authorized to delete this post" });
      }
      await Comment.deleteMany({ post: id });
      await Post.findByIdAndDelete(id);
      res.json({ success: true, message: "Post and associated comments deleted successfully." });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
 
  export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("author", "name image");
      res.json({ success: true, message: "Posts fetched successfully.", data: posts });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
 
  export const getPostById = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id)
        .populate("author", "name image")
        .populate({
          path: "comments",
          populate: { path: "author", select: "name image" },
        });
  
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found." });
      }
      res.json({ success: true, message: "Post fetched successfully.", data: post });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };






  export const addComment = async (req, res) => {
    try {
      const  author_id=req.user.id;
      const { postId, content } = req.body;
      if (!postId || !author_id || !content) {
        return res.status(400).json({ success: false, message: "All fields  are required." });
      }
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ success: false, message: "Post not found." });
      const author = await User.findById(author_id);
      if (!author) return res.status(404).json({ success: false, message: "Author not found." });
      const comment = await Comment.create({ post: postId, author: author_id, content });
      post.comments.push(comment._id);
      await post.save();
      res.status(201).json({ success: true, message: "Comment added successfully.", data: comment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
 
  export const updateComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ success: false, message: "Comment content is required." });
      }
      const comment = await Comment.findByIdAndUpdate(
        id,
        { content },
        { new: true }
      );
  
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found." });
      }
  
      res.json({ success: true, message: "Comment updated successfully.", data: comment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
 
  export const deleteComment = async (req, res) => {
    try {
      const author_id=req.user.id;
      const { id } = req.params;
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found." });
      }
      if(comment.author.toString()!=author_id){
        return res.status(404).json({ success: false, message: "You are not authorized to delete the comment" });
      }
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id }
      });
      await Comment.findByIdAndDelete(id);
      res.json({ success: true, message: "Comment deleted successfully." });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
  
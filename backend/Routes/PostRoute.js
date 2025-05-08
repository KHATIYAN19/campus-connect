const express=require("express");
const route=express.Router();
const {auth,isAdmin}=require("../Middlewares/userMiddleware");
const {createPost,updatePost,deletePost,getAllPosts,getPostById,likePost,addComment,deleteComment}=require("../Controllers/PostController");


route.post("/create",auth,createPost);
route.patch("/update/:id" ,auth,updatePost);
route.delete("/delete/:id",auth,deletePost);
route.get("/get/allpost",auth,getAllPosts);
route.get("/get/:id",auth,getPostById);

route.get("/like/:id",auth,likePost);

route.post("/comment/create",auth,addComment)

route.delete("/comment/delete/:id",auth,deleteComment);


module.exports=route;
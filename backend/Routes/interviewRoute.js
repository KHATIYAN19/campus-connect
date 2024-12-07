const express=require("express");
const route=express.Router();
const {auth,isStudent,isAdmin}=require("../Middlewares/userMiddleware");
const {post_interview,getAll,getmymsg}=require("../Controllers/interviewController");
route.post("/interview/post",auth,post_interview);
route.get("/interview/getall" ,auth,getAll);
route.get("/interview/mymessage",auth,isAdmin,getmymsg);
module.exports=route;
const express=require("express");
const route=express.Router();
const {auth,isStudent,isAdmin}=require("../Middlewares/userMiddleware");
const {post_msg,getallmsg,getmymsg}=require("../Controllers/messageController");
route.post("/message/post",auth,isAdmin,post_msg);
route.get("/message/getall" ,auth,getallmsg);
route.get("/message/mymessage",auth,isAdmin,getmymsg);

module.exports=route;
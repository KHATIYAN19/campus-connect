const express=require("express");
const route=express.Router();
const {auth,isStudent}=require("../Middlewares/userMiddleware");
const {signup,user_applications,login,reset}=require("../Controllers/Usercontrollers");
route.post("/signup",signup);
route.get("/myjobs" ,auth,isStudent,user_applications);
route.post("/login",login);
route.post("/reset",reset);
module.exports=route;
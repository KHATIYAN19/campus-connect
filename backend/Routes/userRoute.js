const express=require("express");
const route=express.Router();
const {auth,isStudent}=require("../Middlewares/userMiddleware");
const {signup,user_applications,login,reset,logout,verifytoken,deleteAcc}=require("../Controllers/Usercontrollers");
route.post("/signup",signup);
route.get("/profile" ,auth,user_applications);
route.post("/login",login);
route.post("/reset",reset);
route.get("/logout",logout);
route.get("/verify-email",verifytoken);
route.delete("/deleteAccount",auth,deleteAcc);
module.exports=route;
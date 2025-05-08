const express=require("express");
const route=express.Router();
const {auth, isAdmin}=require("../Middlewares/userMiddleware");
const multer = require('multer');
const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize: 5 * 1024 * 1024 } }); 
const {signup,user_applications,login,reset,logout,verifytoken,deleteAcc,Adminsignup,user_update,admin_update,my_application,user_profile,resetTokenPass,getUserInfo,getUserDataByEmail,getAllStudentUsersSortedByYear,getStudentsByName}=require("../Controllers/Usercontrollers");
route.post("/signup/student",upload.single('image'),signup);
route.post("/signup/admin",upload.single('image'),Adminsignup);
route.get("/profile" ,auth,user_applications);
route.get("/user/profile/:id",auth,user_profile);
route.post("/login",login);
route.post("/reset",reset);
route.post("/reset-password/:token",resetTokenPass);
route.get("/logout",logout);
route.get("/verify-email",verifytoken);
route.delete("/deleteAccount",auth,deleteAcc);
route.post("/update/user",upload.single('image'),user_update);
route.post("/update/admin",upload.single('image'),admin_update);
route.get("/findapplication_id",auth,my_application);
route.get("/alluserinfo",auth,getUserInfo);
route.get("/allstudents",auth,isAdmin,getAllStudentUsersSortedByYear);
route.post("/getUserInfo",auth,getUserDataByEmail);


route.get("/student",auth,isAdmin,getStudentsByName)
module.exports=route;
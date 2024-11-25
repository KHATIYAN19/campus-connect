const express=require("express");
const route=express.Router();
const {auth}=require("../Middlewares/userMiddleware");
const multer = require('multer');
const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:500000 } }); 
const {signup,user_applications,login,reset,logout,verifytoken,deleteAcc,Adminsignup,user_update,admin_update}=require("../Controllers/Usercontrollers");
route.post("/signup/student",upload.single('image'),signup);
route.post("/signup/admin",upload.single('image'),Adminsignup);
route.get("/profile" ,auth,user_applications);
route.post("/login",login);
route.post("/reset",reset);
route.get("/logout",logout);
route.get("/verify-email",verifytoken);
route.delete("/deleteAccount",auth,deleteAcc);
route.post("/update/user",upload.single('image'),user_update);
route.post("/update/admin",upload.single('image'),admin_update);
module.exports=route;
const express=require("express");
const route=express.Router();
const {auth,isAdmin}=require("../Middlewares/userMiddleware");
const {getApplicationsByUserId,getStudentsByJobId,getSelectedJobsByUserId,addApplication}=require("../Controllers/ApplicationController");
route.post("/addUser",Adduser);
route.get("/allUser" ,auth,getAllblockedUser);
route.delete("/deleteUser/:email",auth,isAdmin,removeUser);
module.exports=route;
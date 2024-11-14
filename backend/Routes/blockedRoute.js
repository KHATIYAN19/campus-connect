const express=require("express");
const route=express.Router();
const {auth,isAdmin}=require("../Middlewares/userMiddleware");
const {Adduser,getAllblockedUser,removeUser}=require("../Controllers/blockedController");
route.post("/addUser",auth,isAdmin,Adduser);
route.get("/allUser" ,auth,getAllblockedUser);
route.delete("/deleteUser/:email",auth,isAdmin,removeUser);
module.exports=route;
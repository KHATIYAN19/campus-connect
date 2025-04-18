const express=require("express");
const route=express.Router();
const {auth,isAdmin, isStudent}=require("../Middlewares/userMiddleware");
const {addApplication,getApplicationsByUserId,getStudentsByJobId,changeStatus,dashboardController
    ,getPlacementRecord,applied_user_id,getSelectedStudents,getStudentApplications,getSelectedJobsByUserId,record}=require("../Controllers/ApplicationController");
    route.get("/placement/records",auth,record);
route.get("/u/myapplication",auth,applied_user_id);
route.get("/dashboard",auth,dashboardController);
route.get("/find/comapny/:email",auth,getStudentApplications);
route.get("/find/student/:company",auth,getSelectedStudents);
route.get("/placement/Record",auth,getPlacementRecord);
route.patch("/changestatus",auth,isAdmin,changeStatus);
route.get("/selection/myselections",auth,isStudent,getSelectedJobsByUserId);
route.get("/myapplication",auth,isStudent,getApplicationsByUserId);

route.post("/:jobid",auth,addApplication);
route.get("/:jobId",auth,getStudentsByJobId);

module.exports=route;
const express=require("express");
const route=express.Router();
const {auth,isStudent,isAdmin}=require("../Middlewares/userMiddleware");
const {post_job,getall,apply,all_applications,jobbyid,my_jobs,toggle}=require("../Controllers/jobController");
route.post("/jobs/post",auth,isAdmin,post_job);
route.get("/jobs/getall",auth,getall);
route.post("/jobs/apply/:id",auth,isStudent,apply);
route.get("/jobs/applications/:id",auth,isAdmin,all_applications);
route.get("/jobs/get/myjobs",auth,my_jobs);
route.get("/jobs/:id",auth,jobbyid);
route.put("/jobs/:job_id/toggle",auth,isAdmin,toggle);
module.exports=route;
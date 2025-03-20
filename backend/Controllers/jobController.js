const Job=require("../Models/jobModel");
const User=require("../Models/userModel");
const mongoose=require("mongoose");
const { ObjectId } = require('mongodb');
const axios=require("axios");
const  sendEmail=require("../Utils/MailSender");
//const sendEmail = require("../Utils/MailSenderArray");
exports.post_job=async(req,res)=>{
   try{
    let id=req.user.id;
    console.log(req.body);
    const {company,description,salary,location,position,tenth,tweleth,graduationMarks,batch}=req.body;
    if(!company||!description||!salary||!location||!position||!tenth||!tweleth||!graduationMarks){
       return res.status(400).json({
            message:"All feild required",
            success:false
       })
    }
    const user=await User.find({_id:id});
    if(!user){
        return res.send({
           message:"User does not exist",
           success:false,
        })
    }
    const jobid = company.substring(0, 2).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    const job=await Job.create({
         company,
         description,
         salary,
         location,
         position,
         postby:id,
         tenth,
         tweleth,
         graduationMarks,
         logo:`https://img.logo.dev/${company}.com?token=pk_LhuGWkxESfCNeTIfkWoI8w`,
         jobid,
         batch
    })
    const emailcontent=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Opportunity: ${position}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4CAF50;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
    }
    .job-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .job-details h2 {
      color: #333;
    }
    .details-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .details-list li {
      margin: 10px 0;
    }
    .details-list span {
      font-weight: bold;
    }
    .cta-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #fff;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }
    .cta-button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <h1>Exciting Job Opportunity: ${position}</h1>
    <p>Dear User,</p>
    <p>We are pleased to inform you about a fantastic career opportunity posted on Campus Connect for a ${position} position. If you're passionate about technology and want to join an innovative company, this could be the perfect fit for you!</p>
    <div class="job-details">
      <h2>Job Details</h2>
      <ul class="details-list">
        <li><span>Position:</span> ${position}</li>
        <li><span>Company:</span> ${company}</li>
        <li><span>Location:</span> ${location}</li>
        <li><span>Salary:</span> ${salary} per annum</li>
        <li><span>Job Description:</span> ${description}</li>
      </ul>
    </div>

    <p>If you meet the qualifications and are eager to join a dynamic team, we encourage you to apply for this exciting role. </p>
    
      <a href="[Job Application Link]" class="cta-button">Apply Now</a>
    To apply, simply click the button below:
    <p>Best regards,</p>
    <p><strong>The Placement Connect Team</strong></p>
  </div>
</body>
</html>
`
  const users = await User.find({}).select('email');
  // const emails = users.map(user => 
  //   user.email
  // );
  // emails.map(email=>sendEmail(email,"New Job Posted","",emailcontent))
     //sendEmail(emails,"New Job Posted","",emailcontent);
    return res.status(200).json({
       message:"Job created Successfully",
       success:true,
       job
    })
   }catch(e){
    console.log(e.message);
      return res.status(400).json({
         message:e.message,
         error:e,
         success:false
      })
   }
}

exports.apply=async(req,res)=>{
      try{
         var job_id = req.params.id;
         var user_id =req.user.id;
         const  data=await Job.findOne({_id:job_id});
         if(!data){
            return res.status(400).json({
               message:"No job found",
               success:false
            })
         }
         const  user_data=await User.findOne({_id:user_id});
         if(!user_data){
            return res.status(400).json({
               message:"No User found",
               success:false
            })
         }
         if(user_data.Applied.includes(job_id)){
            return res.status(400).json({
               message:"Already Applied",
               success:false
            })
         }
         user_data.Applied.push(job_id);
         const res1=await user_data.save();
         data.applicants.push(user_id);
         const res2=await data.save();
         return res.status(200).json({
            message:"applied successfully",
            success:true,
            data:res2
         })
      }catch(e){
         return res.status(200).json({
            message:"Error",
            error:e.message,
            success:false
         })
      }
}
exports.all_applications=async(req,res)=>{
     try{
        const job_id=req.params.id;
        const job=await Job.findOne({_id:job_id}).populate('applicants').populate('postby').exec();
        if(!job){
         return res.status(400).json({
            message:"No job found",
            success:false
          })
        }
        const data=job.applicants;
        return res.status(200).json({
         message:"All applications fetched",
         success:true,
         data,
         postby:job.postby
       })
     
     }catch(e){
        return res.status(400).json({
          message:"Something went wrong",
          success:false
        })
     }
}
exports.getall=async(req,res)=>{
   try {
      const Jobs = await Job.find({}).sort({ createdAt: -1 }).populate('postby').exec();
      res.status(200).json({
          message: "All Job fetched",
          success: true,
          Jobs
      })
  } catch (e) {
      return res.status(400).json({
          message: "Something went wrong",
          success: false
      })
  }
}
exports.jobbyid=async(req,res)=>{
   try{
       let job_id=req.params.id;
       const job=await Job.findOne({_id:job_id}).populate('postby');
        if(!job){
         return res.status(400).json({
            message:"No job found",
            success:false
          })
        }
        return res.status(200).json({
         message:"JOB FETCHED",
         success:true,
         job,
         postby:job.postby
       })
     
     }catch(e){
      console.log(e.message);
        return res.status(400).json({
          message:"Something went wrong",
          success:false,
          error:e
        })
     }
}

exports.my_jobs=async(req,res)=>{
  var user_id =req.user.id;
  try{
    const  user_data=await User.findOne({_id:user_id});
    if(!user_data){
       return res.status(400).json({
          message:"No User found",
          success:false
       })
    }
      const jobs = await Job.find({ postby: user_id })
      return res.status(200).json({
        message:"Jobs fetched",
        success:true,
        jobs
      })
  }catch(e){
     return res.status(400).json({
      message:"Something went wrong",
      success:false,
      e
     })
  }
}
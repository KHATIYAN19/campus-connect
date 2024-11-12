const Job=require("../Models/jobModel");
const User=require("../Models/userModel");
exports.post_job=async(req,res)=>{
   try{
    let id=req.user.id;
    const {company,description,salary,location,position,testdate}=req.body;
    if(!company||!description||!salary||!location||!position||!testdate){
       return res.status(400).json({
            message:"All feild required",
            success:false
       })
    }
    const user=await User.find({_id:id});
    if(!user){
        return res.send({
           message:"User didnot exist",
           success:false,
        })
    }
    const job=await Job.create({
         company,
         description,
         salary,
         location,
         position,
         postby:id,
    })
    return res.status(200).json({
       message:"Job created Successfully",
       success:true,
       job
    })
   }catch(e){
      return res.status(400).json({
         message:"Unable to create a job",
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
          message: "all Job fetched",
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
const Job=require("../Models/jobModel");
const User=require("../Models/userModel");
exports.post_job=async(req,res)=>{
   try{
    let id=(req.params.id);
    const {company,description,salary,location,position}=req.body;
    if(!id||!company||!description||!salary||!location||!position){
       return res.status(400).json({
            message:"All feild required",
            success:false
       })
    }
    console.log("!");
    const user=await User.find({_id:id});
    console.log("2");
    console.log(user);
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
         postby:user._id
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
exports.getall=async(req,res)=>{
    const job=await Job.find({}).sort({createdAt:-1}).populate('postby').exec();
    res.status(200).json({
        message:"all data fetched",
        success:true,
         job
    })
}
exports.apply=async(req,res)=>{
      try{
         var job_id = req.params.id;
         var user_id =req.user.id;
         console.log(job_id,user_id);
         const  data=await Job.findOne({_id:job_id});
         console.log(data);
         if(!data){
            return res.status(400).json({
               message:"No job found",
               success:false
            })
         }
         const  user_data=await User.findOne({_id:user_id});
         console.log(user_data);
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
            res1,
            res2
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
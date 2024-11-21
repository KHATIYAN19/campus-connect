const Blocked =require("../Models/blockedUser");
const User=require("../Models/userModel");
exports.Adduser=async(req,res)=>{
    try{
        let {email}=req.body;
        console.log(req.body);
        if(!email){
             return res.status(400).json({
                success:false,
                message:"All field required"
             })
        }
        email=email.toLowerCase();
        console.log(email);
        const block=await Blocked.findOne({email});
        console.log("4");
        console.log("block",block);
        if(block){
            return res.status(400).json({
                success:false,
                message:"User Already Blocked"
             })
        }
        const user=await User.findOne({email});
        console.log("user",user);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"No user available"
             })
        }
        if(user.role==="admin"){
            return res.status(401).json({
                success:false,
                message:"Cannot Block Admin"
             })
        }
        const blockeduser=await Blocked.create({email});
        return res.status(200).json({
            success:true,
            message:"User Blocked"
         })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
         })
    }
}
exports.getAllblockedUser=async(req,res)=>{
    try{
         const blockeduser=await Blocked.find({});
         return res.status(200).json({
            success:true,
            data:blockeduser,
            message:"Fetched"
         })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
         })
    }
}
exports.removeUser=async(req,res)=>{
      try{
        const {email}=req.params;
        console.log("email",email);
        const result = await Blocked.deleteOne({ email: email });
        if (result.deletedCount === 0) {
            return res.status(200).json({
                success:false,
                message:"No user Found"
             })
          }
          return res.status(200).json({
            success:true,
            message:"User Unblocked"
         })
      }catch(e){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
         })
      }
}
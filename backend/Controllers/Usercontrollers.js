const User = require("../Models/userModel");
const Job=require("../Models/jobModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
    try {
        let { name, phone, email, year, role, password,key } = req.body;
        if (!name || !phone || !email || !year || !role || !password||!key) {
            return res.status(400).json({
                message: "All Feild required !",
                success: false
            })
        }
        email=email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                success: false,
                message: "Already Signup please Login !"
            })
        }
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        const Data = await User.create({
            name,
            role,
            year,
            phone,
            email,
            key,
            password: hashedpass,
        })
        Data.password=undefined;
        return res.status(200).json({
            success: true,
            message: "User Signup Successfully",
            Data
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong please try again",
            success: false,
            error_msg: e.message
        })
    }
}
exports.login=async (req,res)=>{
    try{
        let {email,password}=req.body;
        if(!email||!password){
             return res.status(400).json({
                success:false,
                message:"All feild required"
             })
        }
        email=email.toLowerCase();
        console.log(email);
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:true,
                message:"No user available",
             })
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        if(await bcrypt.compare(password,user.password)){
             let token=jwt.sign(payload,"asdfdsdfd",{
                expiresIn:"2h"
             });
             const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
             }
             user.password=undefined;
             user.Applied=undefined;
             req.token=token;
            return res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User login",
                token,
                user
             })
        }else{
            return res.status(400).json({
                success:false,
                message:"Email or password is incorrect"
             })
        } 
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
         })
    }
}
exports.user_applications = async (req, res) => {
    try {
        const _id = req.user.id;
        const user = await User.findOne({ _id }).sort({createdAt:-1}).populate('Applied');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not exists !"
            })
        }
        const data = user.Applied;
        return res.status(200).json({
            message: "All Applications Fetched",
            "data": data,
            success: true
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong !please try again",
            success: false
        })
    }
}


exports.reset = async (req, res) => {
    try{
         let {email,password,key}=req.body;
         if(!email||!password||!key){
            return res.status(400).json({
                success:false,
                message:"All feild required"
             })
         }
         email=emai.toLowerCase();
         const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"No user available",
             })
        }
        if(user.key!==key){
            return res.status(400).json({
                success:false,
                message:"Invalid Secret Key",
             })
        }
        if(await bcrypt.compare(password,user.password)){
            return res.status(400).json({
                success:false,
                message:"Cannot change to last password",
             })
        }
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        user.password=hashedpass;
        user.save();
        
        return res.status(200).json({
            success:true,
            message:"Password Reset"
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Something went wrong !"
        })
    }
}
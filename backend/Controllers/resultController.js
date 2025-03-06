const Job = require('../Models/jobModel');
const User=require("../Models/userModel");
const Result = require('../Models/resultModel');
const { validationResult } = require('express-validator');

exports.createResult = async (req, res) => {
    const { userEmail, salary, companyJobId ,companyName} = req.body;
    if(!userEmail || !salary || !companyJobId||!companyName){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found',success:false });
        }
        let company;
        if(companyJobId==='na'||companyJobId==='NA'||companyJobId==='Na'||companyJobId==='nA'){
            company=null;
        }else{
             company = await Job.findOne({ jobId: companyJobId });
            if(!company){
                res.status(400).json({
                    message:"Company Not found Write NA if offcampus",
                    success:false
                });
            }
        }


        const result = new Result({
            student:user._id,
            salary,
            company:company==null?null:company._id,
            name:companyName
        });
        const savedResult = await result.save();
        return res.status(201).json({
            success:true,
            message:"Result add"
        })
    } catch (error) {
        res.status(500).json({ message: error.message,success:false });
    }
};


exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find().populate('student').populate('company');
        res.status(200).json({ results, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
exports.getResultsByUserEmail = async (req, res) => {
    const { userEmail } = req.params;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const results = await Result.find({ _id: user._id })
            .populate('student')
            .populate('company');
        res.status(200).json({ results, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
exports.getResultCompanyWise=async(res,res)=>{
    const { job_id } = req.params;
    try {
        const company=await Job.findOne({job_id:company});
        if (!company) {
            return res.status(404).json({ message: 'Job not found',success:false });
        }
        const results = await Result.find({ company:job_id })
            .populate('student')
            .populate('company');
        res.status(200).json({ results, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}



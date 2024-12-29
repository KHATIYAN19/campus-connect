const Company = require('../Models/companyModel');
const User=require("../Models/userModel");
const Result = require('../Models/resultModel');
const { validationResult } = require('express-validator');

exports.createResult = async (req, res) => {
    const { userEmail, salary, companyJobId ,companyName} = req.body;
    if(!userEmail || !salary || !companyJobId,companyName){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const company = await Company.findOne({ jobId: companyJobId });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const result = new Result({
            userEmail,
            salary,
            companyJobId
        });
        const savedResult = await result.save();
        user.results.push(savedResult._id);
        await user.save();
        res.status(201).json({savedResult,
            success: true
    });
    } catch (error) {
        res.status(500).json({ message: error.message,success:false });
    }
};


exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find().populate('userEmail').populate('companyJobId');
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
        const results = await Result.find({ userEmail: userEmail })
            .populate('userEmail')
            .populate('companyJobId');
        res.status(200).json({ results, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
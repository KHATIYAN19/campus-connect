const User=require("../Models/userModel");
const Job=require("../Models/jobModel")

exports.getStudentsByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ _id: jobId }).populate('student', 'name email');
        if (!applications.length) {
            return res.status(404).json({ message: 'No students found for this job', success: false });
        }
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};
exports.getApplicationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await Application.find({ student: userId }).populate('company', 'name offer');
        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for this user', success: false });
        }
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

const getSelectedJobsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await Application.find({ student: userId, status: 'selected' }).populate('company', 'name offer');
        if (!applications.length) {
            return res.status(404).json({ message: 'No selected jobs found for this user', success: false });
        }
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

const addApplication = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        const company = await Job.findById(jobId);
        if (!company) return res.status(404).json({ message: "Company not found", success: false });

        // if (user.marks < company.minMarks) {
        //     return res.status(400).json({ message: "You do not meet the minimum marks requirement", success: false });
        // }

        const existingApplication = await Application.findOne({ student: userId, company: jobId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }

      
        const maxOffer = Math.max(...user.offers.map(o => o.offer), 0);
        // if (maxOffer >= 2 * company.offer) {
        //     return res.status(400).json({ message: "You cannot apply as your existing offer is 2x or more", success: false });
        // }
        const newApplication = new Application({ student: userId, company: jobId, status: "pending" });
        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully", success: true, application: newApplication });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

const User=require("../Models/userModel");
const Job=require("../Models/jobModel")
const Application=require("../Models/Application")
exports.getStudentsByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const existingApplication = await Application.findOne({company: jobId });
        if (!existingApplication) {
            return res.status(400).json({ message: "No Job found", success: false });
        }
        const applications = await Application.find({ company: jobId }).populate('student', 'name image email phone profile');
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
        const  userId = req.user.id;
        console.log(userId)
        const applications = await Application.find({ student: userId }).populate('company');
        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for this user', success: false });
        }
        res.json({ success: true, applications });
    } catch (error) {
        console.log(error)
        res.status(500).json({error, error: error.message, success: false });
    }
};
exports.getSelectedJobsByUserId = async (req, res) => {
    try {
        const userId=req.user.id; 
        const applications = await Application.find({ student: userId, status: 'selected' }).populate('company');
        if (!applications.length) {
            return res.status(404).json({ message: 'No selected jobs found for this user', success: false });
        }
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};
exports.addApplication = async (req, res) => {
    try {
        const  jobId  = req.params.jobid;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        const company = await Job.findById(jobId);
        if (!company) return res.status(404).json({ message: "Company not found", success: false });
        if(user.role=='admin'){
            return res.status(400).json({ message: "Admin Can't Apply", success: false });
        }
        if(user.year!=company.batch){
            return res.status(400).json({ message: "This Drive is not for your batch", success: false });
        }
        if(user.tenth<company.tenth||user.graduationMarks<company.graduationMarks||user.tweleth<company.tweleth){
             return res.status(400).json({ message: "You do not meet the minimum marks requirement", success: false });
        }
        const existingApplication = await Application.findOne({ student: userId, company: jobId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }
        if(user.maxoffer*2>company.salary){
            return res.status(400).json({ message: "Can't Apply due to placement policies", success: false });
        }
        const newApplication = new Application({
                   batch:user.year,
                   salary:company.salary,
                   companyName:company.company,
                   student: userId,
                   company: jobId,
                   companyImage:company.logo       
        });
         await newApplication.save();
        res.status(200).json({ message: "Application submitted successfully", success: true, application: newApplication });
    } catch (error) {
      console.log(error)
        res.status(500).json({ error: error.message, success: false });
    }
};
exports.applied_user_id = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const applications = await Application.find({ student: userId });
        if (!applications.length) {
            return res.status(200).json({ message: 'No applications found for this user', success: false });
        }
        const companyIds = applications.map(app => app.company);
        res.json({ success: true, companies: companyIds });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};
const getSelectedStudents = async () => {
    try {
        const companyName=req.params.company;
        const normalizedCompanyName = companyName.replace(/\s+/g, "").toLowerCase();
        const company = await Job.findOne({
            company: { $regex: new RegExp(`^${normalizedCompanyName}$`, "i") }
        });

        if (!company) {
            return { status: 404, success: false, message: "Company not found" };
        }


        const selectedApplications = await Application.find({
            company: company._id,
            status: "selected"
        }).populate("student");
       console.log("seelecef",selectedApplications);
        // if (selectedApplications.length === 0) {
        //     return { status: 200, success: true, message: "No selected students found", data: [] };
        // }
        const selectedStudents = selectedApplications.map(app => ({
            id: app.student._id,
            name: app.student.name,
            email: app.student.email,
            phone: app.student.phone ,
            year:app.student.year
        }));

        

        return { status: 200, success: true, message: "Selected students fetched successfully", data: selectedApplications };
    } catch (error) {
        console.error("Error fetching selected students:", error);
        return { status: 500, success: false, message: "Internal server error" };
    }
};


exports.getSelectedStudents = async (req, res) => {
  try {
      const jobId = req.params.company;
      let jobs = [];

      if (jobId) {
          jobs = await Job.find({ jobid: jobId });
      }

      if (!jobs.length) {
          const normalizedCompanyName = jobId.replace(/\s+/g, "").toLowerCase();
          jobs = await Job.find({
              company: { $regex: new RegExp(`^${normalizedCompanyName}$`, "i") }
          });
      }

      if (!jobs.length) {
          return res.status(404).json({ success: false, message: "Job or company not found" });
      }

      const finalResult = [];

      for (const job of jobs) {
          const selectedApplications = await Application.find({
              company: job._id,
              status: "selected"
          })
          .populate("student", "name email phone image year profile.graduationdegree");

          if (selectedApplications.length > 0) {
              const users = selectedApplications.map(app => ({
                  username: app.student.name,
                  salary: app.salary,
                  useremail: app.student.email,
                  userphonenumber: app.student.phone,
                  userbatch: app.batch,
                  userdegree: app.student?.profile?.graduationdegree || "Not Provided",
                  userimage: app.student.image,
              }));

              finalResult.push({
                  companyName: selectedApplications[0].companyName,
                  companyImage: selectedApplications[0].companyImage,
                  userSelected: users
              });
          }
      }

      return res.status(200).json({
          success: true,
          message: finalResult.length ? "Selected students fetched successfully" : "No selected students found",
          data: finalResult
      });

  } catch (error) {
      console.error("Error fetching selected students:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.getStudentApplications = async (req, res) => {
    try {
        const studentEmail = req.params.email.toLowerCase();
        const student = await User.findOne({ email: studentEmail });
        if (!student||student.role=='admin') {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        const applications = await Application.find({ student: student._id }).populate('company').sort({createdAt:-1});
        const companies = applications.map(app => ({
             company:app.company,
             status:app.status,
             createdAt:app.createdAt
        }));
        const response = {
            success: true,
            message: "Student applications fetched successfully",
            student: {
                name: student.name,
                email: student.email,
                image: student.image,
                phone: student.phone,
                profile:student.profile,
                year:student.year
            },
            companies: companies

        };
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching student applications:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.dashboardController = async (req, res) => {
    try {
      // Total number of admin users
      const totalAdmins = await User.countDocuments({ role: "admin" });
  
      // Total number of student users
      const totalStudents = await User.countDocuments({ role: "student" });
  
      // Total number of graduated students per year
      const graduatedStudentsByYear = await User.aggregate([
        {
          $match: {
            role: "student",
            "profile.graduationdegree": { $exists: true, $ne: null, $ne: "" },
            year: { $exists: true },
          },
        },
        {
          $group: {
            _id: "$year",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            year: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
  
      // Total offers (total students whose application status is 'selected')
      const totalOffers = await Application.countDocuments({ status: "selected" });
  
      // Total unique students with 'selected' status, batch-wise (assuming 'year' in User model represents the batch)
      const batchwiseUniqueSelectedStudents = await Application.aggregate([
        {
          $match: {
            status: "selected",
          },
        },
        {
          $lookup: {
            from: "users", // The name of the User collection
            localField: "student",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
        {
          $group: {
            _id: "$studentInfo.year",
            uniqueStudents: { $addToSet: "$student" },
          },
        },
        {
          $project: {
            batch: "$_id",
            totalUniqueSelectedStudents: { $size: "$uniqueStudents" },
            _id: 0,
          },
        },
        {
          $sort: { batch: 1 },
        },
      ]);
  
      // Total offers batch-wise
      const batchwiseTotalOffers = await Application.aggregate([
        {
          $match: {
            status: "selected",
          },
        },
        {
          $lookup: {
            from: "users", // The name of the User collection
            localField: "student",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
        {
          $group: {
            _id: "$studentInfo.year",
            totalOffersInBatch: { $sum: 1 },
          },
        },
        {
          $project: {
            batch: "$_id",
            totalOffersInBatch: 1,
            _id: 0,
          },
        },
        {
          $sort: { batch: 1 },
        },
      ]);
  
      res.status(200).json({
        totalAdmins,
        totalStudents,
        graduatedStudentsByYear,
        totalOffers,
        batchwiseUniqueSelectedStudents,
        batchwiseTotalOffers, // Added the new result
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
};
exports.changeStatus=async(req,res)=>{
    try{
        const {application_id,status}=req.body;
        if(!application_id){
          return res.status(400).json({
            message:"Application id required",
            success:false
         })
        }
        const application=await Application.findOne({_id:application_id});
        if(!application){
           return res.status(400).json({
              message:"Invalid Application",
              success:false
           })
        }
        const user_id=application.student
        const user=await User.findOne({_id:user_id});
        
        // if(application.status!='pending'){
        //   return res.status(400).json({
        //     message:"Status Already Changed",
        //     success:false
        //  })
        // }
        if(status=='selected'){
           const maxoffer=Math.max(application.salary,user.maxoffer);
           user.maxoffer=maxoffer;
           await user.save();
        }
        application.status=status;
        await application.save();
        return res.status(200).json({
           message:"Student status changed",
           success:true
        })
    }catch(e){
      return res.status(400).json({
        message:"Something went wrong",
        success:false,
        error:e
      }) 
    }
}
exports.getPlacementRecord=async(req,res)=>{
  try {
    const batchData = await Application.aggregate([
      {
        $match: {
          status: "selected",
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $group: {
          _id: "$studentInfo.year",
          students: {
            $addToSet: "$studentInfo._id", // Get unique student IDs in the batch
          },
          totalOffers: { $sum: 1 },
          highestOffer: { $max: "$salary" },
          averageOffer: { $avg: "$salary" },
        },
      },
      {
        $sort: { highestOffer: -1 }, // Sort by highest offer in descending order
      },
    ]);

    const populatedBatchData = await Promise.all(
      batchData.map(async (batch) => {
        const students = await User.find({ _id: { $in: batch.students } });
        return {
          year: batch._id,
          totalOffers: batch.totalOffers,
          highestOffer: batch.highestOffer,
          averageOffer: batch.averageOffer,
          selectedStudents: students,
        };
      })
    );

    res.status(200).json(populatedBatchData);
  } catch (error) {
    console.error("Error fetching batch placement data:", error);
    res.status(500).json({ message: "Failed to fetch batch placement data" });
  }
}

exports.record=async(req,res)=>{
  try {
   
    const applications = await Application.find({ status: "selected" })
        .populate("student", "name image") // Fetch student name & image
        .populate("company", "image") // Fetch company image
        .sort({ salary: -1 }); // Sort applications by salary in descending order

    // Structure data by batch
    const result = {};
    applications.forEach(app => {
        const batch = app.batch;
        if (!result[batch]) {
            result[batch] = [];
        }
        
        result[batch].push({
            studentName: app.student.name,
            studentImage: app.student.image,
            companyName: app.companyName,
            companyImage: app.company?.image || null, // Handle if company image is not present
            salary: app.salary
        });
    });
    
    res.status(200).json(result);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}
}
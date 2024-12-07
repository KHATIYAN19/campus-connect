const Interview = require("../Models/interview");
const User = require("../Models/userModel");

exports.post_interview = async (req, res) => {
    console.log(req.body,"red");
    try {
        let id = req.user.id;
        const { title,company,experience} = req.body;
        if (!title||!company||!experience) {
            return res.status(400).json({
                message: "All field Required",
                success: false
            })
        }
        const user = await User.findById(id);
        if (!user) {
              return res.status(404).json({
                 message: 'User not found',
                 success:false 
              });
            }
            let interview = new Interview({
               title,
               company,
               description:experience,
               postby: id
            });
              await interview.save();
            interview=await Interview.findById(interview._id).populate('postby').exec();
            res.status(201).json({
                success:"true",
                message:"Interview Upload",
                interview
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error posting Interview' });
          }    
}
exports.getAll = async (req, res) => {
    try {
        console.log(req.user);
        let interview = await Interview.find({}).sort({ createdAt: -1 }).populate('postby').exec();
        res.status(200).json({
            message: "All interview fetched",
            success: true,
            interview
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false
        })
    }
}
exports.getmymsg = async (req, res) => {
    try {
        let id = req.user.id;
        const data=await Interview.find({postby:id});
        return res.status(200).json({
            message: "All interview fetched",
            data,
            success: true
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
        })
    }
}
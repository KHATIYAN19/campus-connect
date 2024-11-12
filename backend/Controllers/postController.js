// const Post = require("../Models/postModel");
// const User = require("../Models/userModel");
// exports.post = async (req, res) => {
//     try {
//         let id = req.user.id;
//         const { description } = req.body;
//         if (!msg) {
//             return res.status(400).json({
//                 message: "Message should not empty",
//                 success: false
//             })
//         }
//         const user = await User.find({ _id: id });
//         if (!user) {
//             return res.send({
//                 message: "User does not exist",
//                 success: false,
//             })
//         }
//         const message = await Post.create({
//             msg,
//             postby: user_id
//         })
//         user.messages.push(message._id);
//         await user.save();
//         return res.status(200).json({
//             message: "Message post Successfully",
//             success: true,
//         })
//     } catch (e) {
//         return res.status(400).json({
//             message: "Unable to post a message",
//             error: e,
//             success: false
//         })
//     }
// }
// exports.getallmsg = async (req, res) => {
//     try {
//         const messages = await Message.find({}).sort({ createdAt: -1 }).populate('postby').exec();
//         res.status(200).json({
//             message: "all message fetched",
//             success: true,
//             messages
//         })
//     } catch (e) {
//         return res.status(400).json({
//             message: "Something went wrong",
//             success: false
//         })
//     }
// }
// exports.getmymsg = async (req, res) => {
//     try {
//         let id = req.user.id;
//         const user_data = await User.findOne({ _id: id });
//         const data = user_data.message
//         return res.status(200).json({
//             message: "All message fetched",
//             data,
//             success: true
//         })

//     } catch (e) {
//         return res.status(400).json({
//             message: "Something went wrong",
//             success: false
//         })
//     }
// }
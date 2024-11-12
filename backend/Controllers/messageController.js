const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
exports.post_msg = async (req, res) => {
    try {
        let id = req.user.id;
        const { msg } = req.body;
        console.log(msg);
        if (!msg) {
            return res.status(400).json({
                message: "Message should not empty",
                success: false
            })
        }
        const user = await User.find({ _id: id });
        if (!user) {
            return res.send({
                message: "User does not exist",
                success: false,
            })
        }
        console.log(1);
        const message = await Message.create({
            msg,
            postby:id
        })
        
        
        const idd=message._id;
        console.log(idd);
        
        return res.status(200).json({
            message: "Message post Successfully",
            success: true,
        })
    } catch (e) {
        return res.status(400).json({
            message: "Unable to post a message",
            error: e,
            success: false
        })
    }
}
exports.getallmsg = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 }).populate('postby').exec();
        res.status(200).json({
            message: "all message fetched",
            success: true,
            messages
        })
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
        const user_data = await User.findOne({ _id: id });
        const data = user_data.message
        return res.status(200).json({
            message: "All message fetched",
            data,
            success: true
        })

    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false
        })
    }
}
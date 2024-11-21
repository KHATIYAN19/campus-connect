const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
exports.post_msg = async (req, res) => {
    try {
        let id = req.user.id;
        const { msg ,year} = req.body;
        console.log(msg);
        if (!msg||!year) {
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
            const message = new Message({
              msg,
              year,
              postby: user._id
            });
            await message.save();
            user.messages.push(message._id);
            await user.save();
            res.status(201).json({
                success:"true",
                message:"Message Posted"
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error posting message' });
          }    
}
exports.getallmsg = async (req, res) => {
    try {
        console.log(req.user);
        const messages = await Message.find({}).sort({ createdAt: -1 }).populate('postby').exec();
        if(req.user.role==='admin'){
        res.status(200).json({
            message: "All message fetched",
            success: true,
            messages
        })}else{
            const year=req.user.year;
            const filtermsg=messages.filter(message=>message.year==year);
            res.status(200).json({
                message: "All message fetched",
                success: true,
                filtermsg
            });
        }
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
        const user_data = await User.findOne({ _id: id }).populate('messages').exec();
        const data = user_data.messages;
        return res.status(200).json({
            message: "All message fetched",
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
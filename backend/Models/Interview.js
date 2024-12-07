const mongoose=require("mongoose");
const interviewSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    postby:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{timestamps:true});
module.exports=mongoose.model("Interview",interviewSchema);
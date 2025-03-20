const mongoose=require("mongoose");
const jobSchema=mongoose.Schema({
        company:{
            type:String,
            requires:true,
        },
        description:{
            type:String,
            requires:true,
        },
        salary:{
            type:Number,
            require:true,
        },
        logo:{
            type:String,
            require:true
        },
        location:{
            type:String,
            requires:true,
        },
        postby:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        applicants:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        ],
        position:{
            type:String,
            required:true,
        },
        tenth:{
            type:Number,
            required:true,
        },
        graduationMarks:{
            type:Number,
            required:true,
        },
        tweleth:{
            type:Number,
            required:true,
        },
        jobid:{
            type:String,
            required:true,
            unique:true
        },
        batch:{
            default:2025,
            type:Number,
            required:true
        },
        closed:{
            default:false,
            type:Boolean
        }
},{timestamps:true});
module.exports=mongoose.model("Job",jobSchema);
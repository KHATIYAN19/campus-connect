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
            type:String,
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
        numbers:{
            type:Number,
            required:true,
            default:3
        },
        // tenth:{
        //     type:Number,
        //     required:true,
        // },
        // graduation:{
        //     type:Number,
        //     required:true,
        // },
        // tweleth:{
        //     type:Number,
        //     required:true,
        // }
},{timestamps:true});
module.exports=mongoose.model("Job",jobSchema);
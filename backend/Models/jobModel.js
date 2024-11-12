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
            requires:true,
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
        testdatae:{
            type:Date,
        },
        numbers:{
            type:Number,
            required:true,
            default:3
        }
},{timestamps:true});
module.exports=mongoose.model("Job",jobSchema);
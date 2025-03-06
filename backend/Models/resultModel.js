const mongoose=require("mongoose");
const resultSchema=mongoose.Schema({
     company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        default:null
     },
     name:{
        type:String,
        required:true,
     },
     salary:{
        type:Number,
        required:true,
     },
     student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
     }
},{timestamps:true});
module.exports=mongoose.model("Result",resultSchema);
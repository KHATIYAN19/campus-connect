const mongoose=require("mongoose");
const resultSchema=mongoose.Schema({
      student:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      salary:{
        required:true,
        type:Number
      },
      company:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Company'
      },
      companyName:{
        required:true,
        type:String
      }
},{timestamps:true});
module.exports=mongoose.model("Result",resultSchema);
const mongoose=require("mongoose");
const blockSchema=mongoose.Schema({
     email:{
        type:String,
        required:true
     }
},{timestamps:true});
module.exports=mongoose.model("Block",blockSchema);
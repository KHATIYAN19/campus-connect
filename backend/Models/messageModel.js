const mongoose=require("mongoose");
const messageSchema=mongoose.Schema({
      msg:{
        type:String,
        required:true
      },
      postby: { 
        required:true,
        type:mongoose.Schema.Types.ObjectId,
         ref: 'User' 
      },
      year:{
        required:true,
        type:String
      },
      topic:{
        required:true,
        type:String
      }
},{timestamps:true});
module.exports=mongoose.model("Message",messageSchema);
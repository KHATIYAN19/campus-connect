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
      }
},{timestamps:true});

module.exports=mongoose.model("Message",messageSchema);
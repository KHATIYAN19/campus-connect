const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
      image:{
        type:String,
        required:true
      },
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

module.exports=mongoose.model("Post",postSchema);
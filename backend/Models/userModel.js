const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
      name:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
      },
      phone:{
        type:String,
        required:true
      },
      password:{
        type:String,
        required:true
      },
      role:{
        type:String,
        required:true,
        enum:["student","admin"]
      },
      year:{
        type:Number,
        required:true,
      },
      profile:{
         bio:{
            type:String,
         },
         address:{
            type:String,
         },
         graduatedeg:{
           type:String
         },
         graduatemarks:{
            type:Number,
         },
         tenth:{
            type:Number,
         },
         tweleth:{
           type:Number
         },
         resume:{
           type:Number
         }
      },
      key:{
        type:String,
        required:true
      },
      Applied:[ { 
        type:mongoose.Schema.Types.ObjectId,
         ref: 'Job' }
      ],
      messages:[{
        type:mongoose.Schema.Types.ObjectId,
         ref: 'Message'
      }]
},{timestamps:true});
module.exports=mongoose.model("User",userSchema);
const mongoose=require("mongoose");

const alumniSchema=mongoose.Schema({
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
        type:Number
      },
      isVerified:{
        type:Boolean,
        default:false
      },
      image:{
        type:String,
        required:true,
      },
      profile:{
         bio:{
            type:String,
         },
         address:{
            type:String,
         },
         graduationdegree:{
           type:String
         },
         graduationMarks:{
            type:Number,
         },
         tenth:{
            type:Number,
         },
         tweleth:{
           type:Number
         },
         resume:{
           type:String
         }
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
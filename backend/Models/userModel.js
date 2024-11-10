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
        enum:["student","admin","owner"]
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
         dob:{
            type:Date
         }
      },
      key:{
        type:String,
        required:true
      },
      Applied:[ { 
        type:mongoose.Schema.Types.ObjectId,
         ref: 'Job' }
      ]
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);
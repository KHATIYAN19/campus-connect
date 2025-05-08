const mongoose=require("mongoose");
const applicationSchema =mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
    salary:{type:Number,required:true},
    companyName:{type:String,required:true},
    batch:{type:Number,required:true},
    companyImage:{type:String,requied:true,default:"https://imgs.search.brave.com/1b3AtnTjHDMNofRnIkvaZColTS5-LlFQpIcJ_2GpoVo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vYzc4YmJk/ZGY3MDRlYmU2NDE3/ODgzOTFmNGE4Yjk3/NjNiMzdjMzc0My0z/NDV4MzQ1LnBuZz93/PTEwODAmcT03MiZm/bT13ZWJw"}
},{timestamps:true});
module.exports=mongoose.model('Application', applicationSchema);
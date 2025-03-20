const mongoose=require("mongoose");
const applicationSchema =mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
    salary:{type:Number,required:true},
    companyName:{type:String,required:true}
},{timestamps:true});
module.exports=mongoose.model('Application', applicationSchema);
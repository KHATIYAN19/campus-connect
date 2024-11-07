const express=require("express");
const app=express();
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const Dbconnect=require("./Utils/DbConnections");
const userRoute=require("./Routes/userRoute");
const jobRoute=require("./Routes/jobRoute");
const auth=require("./Middlewares/userMiddleware");
require('dotenv').config()
app.use(express.json());
app.use("/",userRoute);
app.use("/",jobRoute);
app.use(express.urlencoded({extended:true}));
app.listen(process.env.PORT,()=>{
    console.log(`App is listen ${process.env.PORT}`)
})
// app.get("/find",(auth),async (req,res)=>{
//      res.status(200).json({
//         message:"wlcm back",
//         user:req.body
//      })
// });
Dbconnect();


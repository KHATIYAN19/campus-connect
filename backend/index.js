const express=require("express");
const cors = require("cors");
const app=express();
var cookieParser = require('cookie-parser');
const Dbconnect=require("./Utils/DbConnections");
const userRoute=require("./Routes/userRoute");
const jobRoute=require("./Routes/jobRoute");
const messageRoute=require("./Routes/messageRoute");
const blockedRoute=require("./Routes/blockedRoute");
const interviewRoute=require("./Routes/interviewRoute");
const  contactRoute=require("./Routes/contactRoute");
const applicationRoute=require("./Routes/applicationRoute");
const auth=require("./Middlewares/userMiddleware");
require('dotenv').config();

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use("/",userRoute);
app.use("/",jobRoute);
app.use("/",messageRoute);
app.use("/blocked",blockedRoute);
app.use("/",interviewRoute);
app.use("/contact",contactRoute);
app.use("/application",applicationRoute)
app.use(express.urlencoded({extended:true}));


app.listen(process.env.PORT,()=>{
    console.log(`App is listening on ${process.env.PORT}`);
});
// app.get("/find",(auth),async (req,res)=>{
//      res.status(200).json({
//         message:"wlcm back",
//         user:req.body
//      })
// });

Dbconnect();



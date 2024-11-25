const User = require("../Models/userModel");
const Job = require("../Models/jobModel");
const Block=require("../Models/blockedUser.js");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const sendMail = require("../Utils/MailSender");
require('dotenv').config();
const upload =require("../Utils/cloudinary.js")
exports.signup = async (req, res) => {
    try {
    //     console.log("req",req.body.phone);
    //    // console.log(req.file," fole");
        let { name, phone, email, year,password,tenth,tweleth,graduationdegree,graduationMarks,resume } = req.body;
        if (!name || !phone || !email || !year || !password||!tenth||!tweleth||!graduationMarks||!graduationdegree||!resume) {
            return res.status(400).json({
                message: "All Feild required !",
                success: false
            })
        }
        if (!req.file) {
            return res.status(400).send({ message: 'Profile image is required' });
        }
       
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                success: false,
                message: "Already Signup please Login !"
            })
        }
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        const result = await upload.uploadFile(req.file.path);
        
        image=result.secure_url
        const newUser = await User.create({
            name,
            role:"student",
            year,
            phone,
            email,
            password: hashedpass,
            image,
            profile:{
                tenth,
                tweleth,
                resume,
                graduationMarks,
                graduationdegree,
            }
        })
        newUser.password = undefined;
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const emailContent = `
            <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Campus Connect</title>
        <style>
          /* Include the previous CSS code here */
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td class="email-container">
              <img src="https://via.placeholder.com/150x50?text=Campus+Connect" alt="Campus Connect Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
              <h1>Welcome to Campus Connect, ${name}!</h1>
              <p class="welcome-message">
                Hi ${name},<br><br>
                Thank you for signing up for Campus Connect! We're excited to have you join our community.<br><br>
                To get started, click the button below to verify your email and complete your registration.
              </p>
              
              <a href="http://localhost:5173/verify-email?token=${token}" class="cta-button">Verify Your Email</a>
              <p class="footer">
                If you didn’t sign up for this account, please ignore this email or <a href="mailto:placementconnect9@gmail.com">contact support</a>.
              </p>
              <p class="footer">
                © 2024 Campus Connect | <a href="https://placementconnect.com">Visit our Website</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
        `;
        await sendMail(email, 'Please verify your email addres', "", emailContent);
        return res.status(200).json({
            success: true,
            message: "Please Verify your Account",
            Data: newUser
        })
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            message: "Something went wrong please try again",
            success: false,
            error_msg: e.message
        })
    }
}
exports.Adminsignup = async (req, res) => {
    try {
        let { name, phone, email, password, adminkey } = req.body;
        if (!name || !phone || !email ||  !password || !adminkey) {
            return res.status(400).json({
                message: "All Field required !",
                success: false
            })
        }
        if (!req.file) {
            return res.status(400).send({ message: 'Profile image is required' });
        }
        if(adminkey!='Admin'){
            return res.status(400).json({
                message: "Invalid Admin key!",
                success: false
            })
        }
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                success: false,
                message: "Already Signup please Login !"
            })
        }
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        const result = await upload.uploadFile(req.file.path);
        image=result.secure_url
        const newUser = await User.create({
            name,
            phone,
            email,
            password: hashedpass,
            image,
            role:"admin"
        })
        newUser.password = undefined;
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const emailContent = `
            <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Campus Connect</title>
        <style>
          /* Include the previous CSS code here */
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td class="email-container">
              <img src="https://via.placeholder.com/150x50?text=Campus+Connect" alt="Campus Connect Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
              <h1>Welcome to Campus Connect, ${name}!</h1>
              <p class="welcome-message">
                Hi ${name},<br><br>
                Thank you for signing up for Campus Connect! We're excited to have you join our community.<br><br>
                To get started, click the button below to verify your email and complete your registration.
              </p>
              
              <a href="http://localhost:5173/verify-email?token=${token}" class="cta-button">Verify Your Email</a>
              <p class="footer">
                If you didn’t sign up for this account, please ignore this email or <a href="mailto:placementconnect9@gmail.com">contact support</a>.
              </p>
              <p class="footer">
                © 2024 Campus Connect | <a href="https://placementconnect.com">Visit our Website</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
        `;
        await sendMail(email, 'Please verify your email addres', "", emailContent);
        return res.status(200).json({
            success: true,
            message: "Please Verify your Account",
            Data: newUser
        })
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            message: "Something went wrong please try again",
            success: false,
            error_msg: e.message
        })
    }
}
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All field required"
            })
        }
        email = email.toLowerCase();
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user available",
            })
        }
        const block=await Block.findOne({email});
        if(block){
            return res.status(400).json({
                success: false,
                message: "User Block,contact to Admin",
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
            year: user.year
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, "asdfdsdfd", {
                expiresIn: "2h"
            });
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            user.password = undefined;
            req.token = token;
            if (!user.isVerified) {
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                const emailContent = `
                    <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Campus Connect</title>
                <style>
                  /* Include the previous CSS code here */
                </style>
              </head>
              <body>
                <table>
                  <tr>
                    <td class="email-container">
                      <img src="https://via.placeholder.com/150x50?text=Campus+Connect" alt="Placement Connect Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
                      <h1>Welcome to Placement Connect, ${user.name}!</h1>
                      <p class="welcome-message">
                        Hi ${user.name},<br><br>
                        Thank you for signing up for Placement Connect! We're excited to have you join our community.<br><br>
                        To get started, click the button below to verify your email and complete your registration.
                      </p> 
                      <a href="http://localhost:5173/verify-email?token=${token}" class="cta-button">Verify Your Email</a>
                      <p class="footer">
                        If you didn’t sign up for this account, please ignore this email or <a href="placementconnect9@gmail.com">contact support</a>.
                      </p>
                      <p class="footer">
                        © 2024 Campus Connect | <a href="https://placementconnect.com">Visit our Website</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
                `;

                await sendMail(email, 'Please verify your email address', "", emailContent);
                return res.status(400).json({
                    success: true,
                    message: "Please verify your account",
                })
            }
            function getCurrentTime() {
                const now = new Date();
                const options = {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                };
                return now.toLocaleDateString('en-US', options);
            }
            const currentTime = getCurrentTime()
            const emailContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Successful - Placement Connect</title>
    <style>
        /* Reset some default styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
        }

        .content {
            padding: 30px;
            text-align: center;
        }

        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
            color: #555555;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #45a049;
        }

        .footer {
            background-color: #f1f1f1;
            color: #777777;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
        }

        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>You've Successfully Logged In!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We're happy to inform you that you've successfully logged into your Placement Connect account.</p>
            <p>The login was completed on <strong>${currentTime}</strong>.</p>
            <p>Now you're ready to explore new job opportunities, internships, and connect with recruiters!</p>
            <p>If this wasn't you or if you have any issues with your account, please reach out to our support team at <a href="mailto:placementconnect9@gmail.com">placementconnect9@gmail.com</a>.</p>
            <a href="[Dashboard Link]" class="cta-button">Go to Your Dashboard</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Placement Connect. All rights reserved.</p>
        </div>
    </div>

</body>
</html>
`
            await sendMail(email, 'Login Successful', "", emailContent);
            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User login",
                token,
                user
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect"
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
exports.user_applications = async (req, res) => {
    try {
        const _id = req.user.id;
        const user = await User.findOne({ _id }).sort({ createdAt: -1 }).populate('Applied');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist !"
            })
        }
        const data = user.Applied;
        return res.status(200).json({
            message: "All Applications Fetched",
            "data": data,
            user,
            success: true
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong! Please try again",
            success: false
        })
    }
}
exports.reset = async (req, res) => {
    try {
        let { email, password, key } = req.body;
        if (!email || !password || !key) {
            return res.status(400).json({
                success: false,
                message: "All field required"
            })
        }
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user available",
            })
        }
        if (user.key !== key) {
            return res.status(400).json({
                success: false,
                message: "Invalid Secret Key",
            })
        }
        if (await bcrypt.compare(password, user.password)) {
            return res.status(400).json({
                success: false,
                message: "Cannot change to last password",
            })
        }
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        user.password = hashedpass;
        user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset"
        })

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}
exports.logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxage: 0 }).json({
            message: "Logout successfully ",
            success: true
        })
    } catch (e) {
        return res.status(400).json({
            message: "unable to logout",
            success: false
        })
    }
}

exports.verifytoken = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = true;
        const name = user.name;
        const email = user.email;
        await user.save();
        const emailContent = `
      <!DOCTYPE html>
         <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Verified - Placement Connect</title>
            <style>
             * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
        }
       

        .content {
            padding: 30px;
            text-align: center;
        }

        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
            color: #555555;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #45a049;
        }

        .footer {
            background-color: #f1f1f1;
            color: #777777;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
        }

        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }

       </style>
      </head>
     <body>

    <div class="container">
        <div class="header">
            <h1>Your Account Has Been Verified!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Congratulations! Your account has been successfully verified with Placement Connect.</p>
            <p>You're now all set to explore exciting career opportunities, connect with placement cell, and take your professional journey to the next level.</p>
            <p>To get started, click the button below to log in to your account:</p>
            <a href="" class="cta-button">Go to My Account</a>
            <p>If you have any questions or need assistance, don't hesitate to reach out to us at <a href="mailto:placementconnect9@gmail.com">placementconnect9@gmail.com</a>.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Placement Connect. All rights reserved.</p>
        </div>
    </div>

     </body>
    </html>`
        await sendMail(email, 'Welcome to Placement Connect', "", emailContent);
        res.status(200).json({ success: true, message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
}

exports.edit=async(req,res)=>{
     let id=req.user.id;
     const user=await User.findOne({id});
     if(!user){
        return res.status(200).json({
            success:"false",
            message:"No user Found"
        })
     }
     const {}=req.body;
     
}
exports.deleteAcc=async(req,res)=>{
    try{       
        let id=req.user.id;
        const user=await User.findById({_id:id});
        if(!user){
            return res.status(200).json({
                success:"false",
                message:"No account Find"
             })
        }
        await User.findByIdAndDelete({_id:id});
        return res.status(200).cookie("token", "", { maxage: 0 }).json({
          success:"true",
          message:"Account deleted"
       })
    }catch(e){
        console.log(e);
        return res.status(207).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

exports.user_update=async(req,res)=>{
    try{
        let {  email,phone,bio, tenth,tweleth,graduationMarks,resume } = req.body;
        if ( !phone || !email || !tenth||!tweleth||!graduationMarks||!resume||!bio) {
            return res.status(400).json({
                message: "All Feild required !",
                success: false
            })
        }
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No user available"
            })
        }
       console.log("email",user);
        let image='';
        if (req.file) {
            image = await upload.uploadFile(req.file.path);
        } 
        user.phone=phone;
        bio, tenth,tweleth,graduationMarks,resume
        user.profile.bio=bio;
        user.profile.tenth=tenth;
        user.profile.tweleth=tweleth;
        user.profile.graduationMarks=graduationMarks;
        user.profile.resume=resume;
        if(image!==''){
            user.image=image.secure_url;
        }
        console.log("image",image.secure_url);
        await user.save();
        return res.status(200).json({
            success:true,
            user,
            message:"User Profile Updated"
        })
    }catch(e){
        return res.status(200).json({
            success:false,
            e,
            message:"Something went wrong"
        })
    }
}

exports.admin_update=async(req,res)=>{
    try{
        let {  email,phone,bio} = req.body;
        if ( !phone || !email || !bio) {
            return res.status(400).json({
                message: "All Feild required !",
                success: false
            })
        }
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No user available"
            })
        }
        let image='';
        if (req.file) {
            image = await upload.uploadFile(req.file.path);
        } 
        user.phone=phone;
        user.profile.bio=bio;
        if(image!==''){
            user.image=image.secure_url;
            console.log("image",image.secure_url);
        }
        await user.save();
        return res.status(200).json({
            success:true,
            user,
            message:"User Profile Updated"
        })
    }catch(e){
        return res.status(200).json({
            success:false,
            e,
            message:"Something went wrong"
        })
    }
}

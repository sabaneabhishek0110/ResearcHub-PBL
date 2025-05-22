const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const mongoose = require('mongoose');
require("dotenv").config();
const {generateOTP,sendOTP} = require('../Services/otpService');

const JWT_SECRET = process.env.JWT_SECRET ;

// exports.CreateUser = async (req,res) => {
//     try{
//         console.log("Entered in CreateUser in userController.js");
//         const {name,email,password} = req.body;
        
//         if(!validator.isEmail(email)){
//             res.status(400).json({message : "Incorrect Email"});
//             return;
//         }
//         console.log(req.body); 
//         const existUser = await User.findOne({ email });
//         if(existUser){
//             return res.status(409).json({message : "User is Already Exists" });
//         }
        
//         const newUser = new User({
//             name,
//             email,
//             password,
//             isEmailVerified: false,
//         });
//         await newUser.save();

//         const otp = generateOTP();
//         const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//         await sendOTP(email, otp);
//         await User.findOneAndUpdate(
//             { email: userEmail },
//             { otp, otpExpires }, // Save OTP + expiry time
//             { upsert: true, new: true }
//         );
        
//         const token = jwt.sign({userId : newUser._id},JWT_SECRET,{expiresIn:"10h"});
//         console.log("Completed CreateUser successfully in userController.js");
//         res.status(201).json({token,message:"User Created Successfully",user : newUser});
//     }
//     catch(error){
//         res.status(400).json({error : error.message})
//     }
// }

exports.CreateUser = async (req, res) => {
    try {
      console.log("Entered in CreateUser in userController.js");
      const { name, email, password } = req.body;
  
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Incorrect Email" });
      }
  
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      // Create user (unverified)
      const newUser = new User({
        name,
        email,
        password,
        isEmailVerified: false,
      });
      await newUser.save();
  
      // Generate and send OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      await User.findOneAndUpdate(
        { email }, // Fixed variable name
        { otp, otpExpires },
        { upsert: true }
      );
      await sendOTP(email, otp);
  
      console.log("OTP sent to:", email);
      const token = jwt.sign({userId : newUser._id},JWT_SECRET,{expiresIn:"10h"});
      res.status(201).json({ 
        message: "User created. OTP sent for verification.",
        userId: newUser._id ,
        token
      });
    } catch (error) {
      console.error("Error in CreateUser:", error);
      res.status(500).json({ error: error.message });
    }
  };

exports.getParticularUser = async (req,res) =>{
    try{
        console.log("Entered into getParticularUser in userController.js");
        const {email,password} = req.body;
        
        if (!email || !password) {
            return res.status(500).json({ message: "Email and Password are required" });
        }
        if(!validator.isEmail(email)){
            res.status(500).json({message : "Incorrect Email"});
            return;
        }
        const existUser = await User.findOne({email});
        
        if(!existUser){
            return res.status(500).json({message : "User Not Found"});
        }
        console.log("dsjkhdkshd",password);
        const isMatch = await existUser.comparePassword(password);
        if(!isMatch){
            return res.status(500).json({message : "Incorrect Password"});
        }
        const user = {
            name : existUser.name,
            email : existUser.email,
            profilePicture: existUser.profilePicture, 
            bio: existUser.bio, 
            researchFields: existUser.researchFields,
            role: existUser.role
        }

        console.log(existUser);
        const token = jwt.sign({userId: existUser._id},JWT_SECRET,{expiresIn: "10h"});
        console.log("Completed getParticularUser successfully in userController.js");
        res.status(200).json({token,message : "User get Logged In Successfully",user});
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
}

exports.getAllUsers = async (req,res) => {
    try{
        console.log("Entered into getAllUsers in userController.js");
        const users = await User.find({},'name email');
        console.log("Completed getAllUsers successfully in userController.js");
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
}

exports.googleCallback = async (req,res) =>{
    try{
        console.log("Entered in googleCallback in userController.js");
        const {token,user} = req.user;
        console.log(user.name);
        console.log("Completed googleCallback successfully in userController.js");
        res.status(200).json({message : "Google Login Successfull",token,user});
    }
    catch(error){
        res.status(500).json({message : "Internal Error",error});
    }
}

exports.getUser = async (req,res) =>{
    try{
        console.log("Entered into getUser in usercontroller.js");
        const userId = req.user.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const existUser = await User.findOne({_id : userId});

        console.log(existUser);
        if(!existUser){
            return res.status(500).json({message : "User Not Found"});
        }
        const user = {
            name : existUser.name,
            email : existUser.email,
            profilePicture: existUser.profilePicture, 
            bio: existUser.bio, 
            researchFields: existUser.researchFields,
            role: existUser.role
        }
        console.log("completed getUser successfully in usercontroller.js");
        res.status(200).json({token,message : "User found successfully",user});
    }
    catch(error){
        res.status(500).json({message : "failed to fetch user "});
    }
}

exports.set_password = async(req,res) =>{
    try{
        console.log("Entered into set_password in usercontroller.js");
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            res.status(500).json({message : "User not found"});
        }
        
        user.password = password;

        await user.save();
        console.log("completed set_password successfully in usercontroller.js");
        res.status(200).json("Password set successfully");
    }
    catch(error){
        res.status(500).json({message : "failed to set password",error});
    }
}
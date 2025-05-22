const express = require('express');
const userController = require('../Controllers/userController');
const passport = require("passport");
const { generateOTP, sendOTP } = require('../Services/otpService');
const userMiddleware = require('../Middlewares/userMiddleware');
const upload = require('../Middlewares/upload');
const User = require('../Models/User');
const auth = require('../Middlewares/auth');
const validator = require('validator');

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Auth middleware passed, user ID:', req.user._id);
    
    // const user = await User.findById(req.user._id)
    //   .select('-password -otp -otpExpires')
    //   .populate('teams', 'name')
    //   .populate('pendingRequests', 'name')
    //   .populate('assignedTasks', 'title status');

    const user = await User.findById(req.user._id)
      .select('name email profilePicture teams pendingRequests assignedTasks') // Explicitly include only needed fields
      .populate('teams', 'name')
      .populate('pendingRequests', 'name email profilePicture') // Added more fields if needed
      .populate('assignedTasks', 'title status dueDate priority');
    
    if (!user) {
      console.log('User not found for ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.name);
    res.json(user);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
});

// Get all users (for chat)
router.get('/all', auth, async (req, res) => {
  try {
    console.log('Fetching all users for chat');
    
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email profilePicture')
      .sort({ name: 1 });
    
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error in /all route:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
});

router.post('/createUser',userController.CreateUser);
router.post('/getParticularUser',userController.getParticularUser);
router.get('/getAllUsers',userController.getAllUsers);
router.get('/getUser',userMiddleware,userController.getUser);
router.post('/set-password',userController.set_password);

router.get("/google",
    passport.authenticate("google", {scope: ["profile", "email"], prompt: "select_account consent",})
);

router.get("/google/callback",
    passport.authenticate("google",{
        failureRedirect: "/login",
        session: false, // Disable session (using JWT)
      }),
    (req, res) => {
        const token = req.user.token;

        const hasPassword = !!req.user.password; // Check dynamically

        if (!hasPassword) {
            // Redirect user to set password page if they don't have one
            return res.redirect(`http://localhost:5173/set-password?email=${req.user.email}`);
        }

        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
  
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  
    try {
      // Save OTP to user (or create temp record)
      await User.findOneAndUpdate(
        { email },
        { otp, otpExpires },
        { upsert: true, new: true }
      );
  
      // Send OTP
      const sent = await sendOTP(email, otp);
      if (!sent) throw new Error('Failed to send OTP');
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Check OTP validity
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const checkVerified = (req, res, next) => {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }
    next();
};
  
// Usage example
router.get('/protected-route', userMiddleware, checkVerified, (req, res) => {
    res.json({ message: 'Verified access' });
});

router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true }
    );
  
    // Send OTP via email (use your email service)
    await sendOTPEmail(email, otp);
  
    res.status(200).json({ message: 'New OTP sent' });
});

module.exports = router;

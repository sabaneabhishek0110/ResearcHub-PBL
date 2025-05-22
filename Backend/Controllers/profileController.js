const User = require('../Models/User');
const Team = require('../Models/Team');
const Tasks = require('../Models/Tasks');
const Document = require("../Models/Document");
const Notification = require("../Models/Notification");
const Activity = require('../Models/Activities');
const cloudinary = require('../config/cloudinary');

exports.getParticularUser = async (req,res) =>{
    try{
        console.log("Entered into getParticularUser in profileController");
        
        const userId = req.user.userId;
        console.log(userId);
        if (!userId ) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const existUser = await User.findOne({_id : userId});
        console.log(existUser);
        if (!existUser) {
            return res.status(404).json({ message: "User not found" });
        } 

        
        const user = {
            name : existUser.name,
            email : existUser.email,
            profilePicture: existUser.profilePicture, 
            bio: existUser.bio, 
            researchFields: existUser.researchFields,
            role: existUser.role,
            groups : existUser.groups,
            pendingRequests : existUser.pendingRequests,
            assignedTasks : existUser.assignedTasks,
            workspaceAccess : existUser.workspaceAccess
        }
        console.log("getParticularUser ran successfully in profileController.js");
        res.status(200).json({message : "User data fetched successfully",user});

    }
    catch(error){
        res.status(500).json({message : "Internal Error", error});
    }
}

exports.giveAccess = async (req,res) =>{
    try{
        console.log("Entered into giveAccess into profileController.js");
        const {notification} = req.body;
        const {relatedTeam,_id,requestedBy} = notification;
        const team = await Team.findById(relatedTeam._id);
        if(!team){
            res.status(500).json("failed to find team");
        }
        if(!team.members.includes(requestedBy)){
            team.members.push(requestedBy);
            await team.save();
        }

        const exists = Notification.exists(_id);

        if(!exists){
            res.status(500).json({message : "failed to remove notification from Notification"});
        }
        const response = await Notification.deleteOne({_id : _id});
        const activity = new Activity({
            user : requestedBy,
            activityType : "team_join",
            entityType : "Team",
            entityId : team._id,
            metadata : {
                teamName : team.title
            },
            team : team._id,
            visibility : "public"
        })
        await activity.save();

        console.log("Completed giveAccess into profileController.js");
        res.status(200).json({message : "access is given successfully"});
    }
    catch(error){
        res.status(500).json({message : "failed to give access",error : error.message});
    }
}

// exports.updateProfile = async (req, res) => {
//     try {
//       console.log("rtruuriod");
//       const userId = req.user.userId;
//       const { name,bio, researchFields,role,profilePicture } = req.body;
  
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { name,
//           bio,
//           researchFields: researchFields.filter(f => f.trim() !== ''),
//           role
//         },
//         { new: true }
//       );
  
//       if (!user.profilePicture.includes('149071.png')) {
//         const publicId = user.profilePicture.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
//       }
  
//       const user = await User.findById(req.user.userId);
//       if (!user) return res.status(404).json({ error: 'User not found' });

//       // Update with new Cloudinary URL
//       user.profilePicture = req.file.path;
//       await user.save();

//       res.status(200).json({ 
//         success: true,
//         message: 'Profile updated successfully',
//         user: {
//           bio: updatedUser.bio,
//           researchFields: updatedUser.researchFields
//         }
//       });
//     } catch (error) {
//       res.status(500).json({ 
//         success: false,
//         message: 'Failed to update profile',
//         error: error.message
//       });
//     }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { name, bio, role } = req.body;
//     let { researchFields } = req.body;
    
//     // Convert researchFields to array if it's a string
//     if (typeof researchFields === 'string') {
//       researchFields = researchFields.split(',')
//         .map(f => f.trim())
//         .filter(f => f !== '');
//     }
    
//     // Ensure researchFields is an array before filtering
//     if (!Array.isArray(researchFields)) {
//       researchFields = [];
//     }

//     const updateData = {
//       name,
//       bio,
//       role,
//       researchFields: researchFields.filter(f => f.trim() !== '')
//     };

//     console.log("sdksjdk",req.file);
//     // Handle profile picture update if file was uploaded
//     if (req.file) {
//       console.log('Uploaded file path:', req.file.path); // Debug log
      
//       const user = await User.findById(userId);
      
//       // Delete old image from Cloudinary if it exists and isn't default
//       if (user.profilePicture && !user.profilePicture.includes('149071.png')) {
//         try {
//           // Extract public_id from Cloudinary URL (works for most formats)
//           const urlParts = user.profilePicture.split('/');
//           const publicIdWithExtension = urlParts[urlParts.length - 1];
//           const publicId = publicIdWithExtension.split('.')[0];
          
//           await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
//           console.log('Deleted old image from Cloudinary');
//         } catch (cloudinaryError) {
//           console.error('Cloudinary deletion error:', cloudinaryError);
//           // Continue even if deletion fails
//         }
//       }

//       // Add new image path to update data
//       updateData.profilePicture = req.file.path;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updateData,
//       { new: true }
//     );

//     res.status(200).json({ 
//       success: true,
//       message: 'Profile updated successfully',
//       user: {
//         name: updatedUser.name,
//         bio: updatedUser.bio,
//         researchFields: updatedUser.researchFields,
//         role: updatedUser.role,
//         profilePicture: updatedUser.profilePicture
//       }
//     });
//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to update profile',
//       error: error.message
//     });
//   }
// };
  

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio, role } = req.body;
    let { researchFields } = req.body;

    // Debug: Check if file was uploaded
    console.log("Uploaded file:", req.file); // Should show Cloudinary result

    // Convert researchFields to array if it's a string
    if (typeof researchFields === 'string') {
      researchFields = researchFields.split(',')
        .map(f => f.trim())
        .filter(f => f !== '');
    }
    
    // Ensure researchFields is an array
    if (!Array.isArray(researchFields)) {
      researchFields = [];
    }

    const updateData = {
      name,
      bio,
      role,
      researchFields: researchFields.filter(f => f.trim() !== '')
    };

    // If a new profile picture was uploaded
    if (req.file) {
      const user = await User.findById(userId);

      // Delete the old image from Cloudinary if it exists and isn't the default
      if (user.profilePicture && !user.profilePicture.includes('149071.png')) {
        try {
          // Extract public_id from the Cloudinary URL
          const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
          console.log("Deleted old Cloudinary image:", publicId);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // Set the new Cloudinary URL
      updateData.profilePicture = req.file.path; // req.file.path contains Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
exports.getUserStats1 = async (req, res) => {
try {
    const userId = req.user.userId;
    
    const stats = {
        tasks : await Tasks.countDocuments({"stages.members": userId, status: 'completed'}),
        Teams_Admin : await Team.countDocuments({ members: userId , Admin : userId}),
        documents : await Document.countDocuments({$or : [{owner : userId},{"permissions.user" : userId}] })
    };
    console.log(stats);
    res.status(200).json({ message : "user stats fetched successfully", stats });
} catch (error) {
    console.log(error);
    res.status(500).json({ 
    success: false,
    message: 'Failed to fetch stats',
    error: error.message
    });
}
};

// exports.updateProfile = async (req, res) => {
//     try {
//       const userId = req.user.userId;
//       const { name, bio, researchFields, role } = req.body;
  
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { 
//           name,
//           bio,
//           researchFields: researchFields.filter(f => f.trim() !== ''),
//           ...(role && { role }) // Only update role if provided
//         },
//         { new: true, runValidators: true }
//       ).select('-password'); // Exclude sensitive fields
  
//       res.status(200).json({
//         success: true,
//         message: 'Profile updated successfully',
//         user: updatedUser
//       });
//     } catch (error) {
//       console.error('Profile update error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update profile',
//         error: error.message
//       });
//     }
// };

exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete old image from Cloudinary (if not default)
    if (!user.profilePicture.includes('149071.png')) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
    }

    // Update with new Cloudinary URL
    user.profilePicture = req.file.path;
    await user.save();

    res.json({ 
      profilePicture: user.profilePicture,
      message: 'Profile picture updated!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}



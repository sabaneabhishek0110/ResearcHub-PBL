const Task = require('../Models/Tasks');
const Notification = require('../Models/Notification');
const mongoose = require('mongoose');
const Activity = require('../Models/Activities');


exports.getTaskNotification = async (req,res) =>{
    try{
        console.log("Entered in getTaskNotification in notificationController.js");
        const {userId} = req.params;
        const notifications = Notification.find({user:userId}).sort({createdAt:-1});
        
        console.log("Completed getTaskNotification successfully in notificationController.js");
        res.status(200).json(notifications);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
}

exports.updateNotificationStatus = async (req,res) =>{
    try{
        console.log("Entered in updateNotificationStatus in notificationController.js");
        const {notificationId} = req.params;
        await Notification.findByIdAndUpdate(notificationId,{status:"read"});
        console.log("Completed updateNotificationStatus successfully in notificationController.js");
        res.status(200).json({message:"Notification marked as read"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.addToGroupRequest = async (req,res) =>{
    try{
        console.log("Entered in addToGroupRequest in NotificationController.js");
        const user_Id = req.user.userId;
        const {Admin,Team_Id} = req.body;

        console.log(user_Id);
        const AddToGroup = new Notification({
            recipient : Admin,
            type : "team_request",
            requestedBy : user_Id,
            message : `User ${user_Id} requested to join team ${Team_Id}`,
            relatedTeam : Team_Id,
        })

        await AddToGroup.save();

        const activity = new Activity({
            user : req.user.userId,
            activityType : "team_join",
            entityType : "Team",
            entityId : Team_Id,
            metadata : {
                taskTitle : Team_Id
            },
            team : Team_Id,
            visibility : "team"
        })
        activity.save();
        console.log("Completed addToGroupRequest in NotificationController.js Successfully");
        res.status(200).json({message : "Notification sent successfully"});
        
    }
    catch(error){
        res.status(500).json({message : "Failed to send request to join team " ,error})
    }
}

exports.getNotifications = async (req,res) =>{
    try{
        console.log("Entered into getNotifications in notificationController.js");
        const AdminId = req.user.userId;
        if(!AdminId){
            res.status(500).json("Invalid token format");
            return;
        }
        const notifications = await Notification.find({recipient:AdminId,type : "team_request"}).populate("requestedBy","name email profilePicture").populate("relatedTeam","Team_name").sort({createdAt:-1});
        console.log(notifications);
        console.log("completed getNotifications in notificationController.js");
        res.status(200).json(notifications);

    }
    catch(error){
        res.status(500).json("failed to fetch notifications");
    }
}

exports.getUnReadCount = async (req, res) =>{
    try {
        const filter = {
            recipient: req.params.userId,
            isRead: false
        };
        // Add team filter if provided
        if (req.query.team) {
            filter.relatedTeam = req.query.team;
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }
        const count = await Notification.countDocuments(filter);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
      
}

exports.getAllNotifications = async (req, res) =>{
    try {
        const filter = { recipient: req.user.userId };
        
        // Apply custom filters from query parameters
        if (req.query.team) {
            filter.relatedTeam = req.query.team;
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .populate('recipient', 'name')
            .populate('requestedBy', 'name')
            .populate('relatedTeam', 'Team_name')
            .populate('relatedTask', 'title');

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.markAllAsRead = async (req, res) =>{
    try {
        await Notification.updateMany(
            { recipient: req.user.userId, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
    
}

exports.getCountNotifications = async (req, res) => {
    const { userId, teamId } = req.query;
    
    const filter = {
      recipient: userId,
      isRead: false,
      ...(teamId && { relatedTeam: teamId })
    };
  
    const count = await Notification.countDocuments(filter);
    res.json({ count });
  }

exports.getUnReadNotifications = async (req, res) => {
    try {
        console.log("afjdkfjkdhfkjdfkjdnf");
        const { teamId } = req.params;
        const userId = req.user.userId;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(teamId)){
            return res.status(400).json({ error: 'Invalid team ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Check if user has any unread notifications for this team
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            relatedTeam: teamId,
            isRead: false
        });

        res.json({ 
            hasUnread: unreadCount > 0,
            unreadCount
        });

    } catch (error) {
        console.error('Error checking unread notifications:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.MarkAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.notificationId,
            { isRead: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.handleAction = async (req, res) => {
    try {
        const { action } = req.body;
        const notification = await Notification.findById(req.params.notificationId)
            .populate('relatedTeam','Team_name')
            .populate('requestedBy','name email profilePicture')
            .populate('relatedTask','title');

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        notification.isRead=true;
        await notification.save();
        let responseMessage = '';
        
        switch(notification.type) {
            case 'team_request':
                if (action === 'approve') {
                    // Add user to team
                    await Team.findByIdAndUpdate(
                        notification.relatedTeam._id,
                        { $addToSet: { members: notification.requestedBy._id } }
                    );
                    responseMessage = `You have been added to team ${notification.relatedTeam.Team_name}`;
                } else {
                    responseMessage = `Your request to join ${notification.relatedTeam.Team_name} was declined`;
                }
                
                // Create response notification
                await Notification.create({
                    recipient: notification.requestedBy._id,
                    type: 'team_request_response',
                    message: responseMessage,
                    relatedTeam: notification.relatedTeam._id,
                    requestedBy : notification.recipient._id
                });
                break;

            case 'stage_update':
                if (action === 'approve') {
                    // Update task stage
                    await Task.findByIdAndUpdate(
                        notification.relatedTask,
                        { $set: { "stages.$[elem].status": "completed" } },
                        { 
                            arrayFilters: [{ "elem.no": notification.relatedStage }],
                            new: true
                        }
                    );
                    const task = await Task.findOne({_id : notification.relatedTask});
                    task.stages.filter(stage=>(stage.no===notification.relatedStage?stage.status="Completed" : stage.status=stage.status));
                    await task.save();
                    
                    let count = 0;
                    task.stages.forEach(stage=>(stage.status==="Completed"?count+=1:count=count));
                    const total = task.stages.length;
                    if(total!=0){
                        const progress1 = (count/task.stages.length)*100;
                        task.progress=progress1;
                        if(progress1===100){
                            task.status="completed";
                        }
                        await task.save();
                    }
                    
                    responseMessage = `Stage ${notification.relatedStage + 1} approval for task ${notification.relatedTask.title}`;
                } else {
                    console.log("task : ",notification.relatedTask.title);
                    const task = await Task.findOne({_id : notification.relatedTask});
                    if(!task){
                        return res.status(400).json({message : "Task Not Found"});
                    }
                    task.stages.filter(stage=>(stage.no===notification.relatedStage?stage.status="Pending":stage.status=stage.status));
                    await task.save();
                    responseMessage = `Stage ${notification.relatedStage + 1} was rejected for task ${notification.relatedTask.title}`;
                }
                
                // Create response notification
                await Notification.create({
                    recipient: notification.requestedBy._id,
                    type: 'stage_update_response',
                    message: responseMessage,
                    relatedTask: notification.relatedTask,
                    relatedStage: notification.relatedStage,
                    relatedTeam : notification.relatedTeam._id,
                    requestedBy : notification.recipient._id
                });
                break;

            default:
                return res.status(400).json({ error: 'Invalid notification type for action' });
        }

        // Delete the original notification
        await Notification.findByIdAndDelete(notification._id);
        
        res.json({ success: true, message: `Request ${action}d successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}


exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // From auth middleware

        // 1. Verify notification exists and belongs to user
        const notification = await Notification.findOne({
            _id: id,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or unauthorized'
            });
        }

        const newNotification = new Notification({
            recipient : notification.requestedBy,
            type : "team_reject",
            requestedBy : notification.recipient,
            message : `Admin ${notification.recipient} rejected to join team ${notification.relatedTeam}`,
            relatedTeam : notification.relatedTeam,
        })

        await newNotification.save();        
        // 2. Delete the notification
        await Notification.findByIdAndDelete(id);


        // 3. Return success response
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};
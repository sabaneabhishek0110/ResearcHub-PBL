const Tasks = require("../Models/Tasks");
const Notification = require("../Models/Notification");
const Activity = require("../Models/Activities");
const mongoose = require('mongoose');
const { Types } = mongoose;
const moment = require('moment'); 

// exports.createTask = async (req, res) => {
//     try {
//         console.log("Entered createTask in taskController.js");

//         const { title, description, startDate, deadline, stages, relatedTeam } = req.body;
//         console.log("Request Body:", req.body);

//         const userId = req.user.userId;

//         // Validate required fields
//         if (!title || !description || !deadline || !relatedTeam || !startDate || !stages) {
//             return res.status(400).json({ message: "All fields are required, and at least one stage must be assigned." });
//         }

//         console.log(req.body);

//         const formattedStartDate = new Date(startDate.split('-').reverse().join('-'));
//         const formattedDeadline = new Date(deadline.split('-').reverse().join('-'));

//         if (isNaN(formattedStartDate) || isNaN(formattedDeadline)) {
//             return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY." });
//         }

//         const currentDate = new Date();
//         const status = currentDate < formattedStartDate ? "upcoming" : "ongoing";

//         const cleanedStages = stages.map(stage => ({
//             no: stage.no,
//             title: stage.title,
//             members: stage.members.map(member => {
//                 const memberId = typeof member === "object" && member.value ? member.value : member;
//                 return mongoose.isValidObjectId(memberId) ? new mongoose.Types.ObjectId(memberId) : null;
//             }).filter(member => member !== null) // Remove invalid members
//         }));

//         // Creating new Task
//         const newTask = new Tasks({
//             title : title,
//             description : description,
//             status : status,
//             assignedBy: new mongoose.Types.ObjectId(userId), // Ensure assignedBy is an ObjectId
//             stages: cleanedStages,
//             relatedTeam: new mongoose.Types.ObjectId(relatedTeam),
//             progress: 0,
//             startDate: formattedStartDate,
//             deadline: formattedDeadline
//         });

//         console.log("New Task Data:", newTask);

//         // Save the task to DB
//         const savedTask = await newTask.save();

//         const activity = new Activity({
//             user : req.user.userId,
//             activityType : "task_assigned",
//             entityType : "Task",
//             entityId : newTask._id,
//             metadata : {
//                 taskTitle : newTask.title
//             },
//             team : relatedTeam,
//             visibility : "team"
//         })
//         activity.save();

//         console.log("Task saved successfully:", savedTask);
//         res.status(200).json({ message: "Task created successfully", task: savedTask });
//     } catch (error) {
//         console.error("Error in createTask:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.createTask = async (req, res) => {
    try {
        console.log("Entered createTask in taskController.js");
        const { title, description, startDate, deadline, stages, relatedTeam } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!title || !description || !deadline || !relatedTeam || !startDate || !stages?.length) {
            return res.status(400).json({ 
                message: "All fields are required, and at least one stage must be assigned." 
            });
        }

        // Date handling with moment.js (more reliable)
        const formattedStartDate = moment(startDate, 'DD-MM-YYYY').toDate();
        const formattedDeadline = moment(deadline, 'DD-MM-YYYY').toDate();

        if (!moment(formattedStartDate).isValid() || !moment(formattedDeadline).isValid()) {
            return res.status(400).json({ 
                message: "Invalid date format. Please use DD-MM-YYYY." 
            });
        }

        // Status determination
        const currentDate = new Date();
        let status;
        if (currentDate < formattedStartDate) {
            status = "upcoming";
        } else if (currentDate > formattedDeadline) {
            status = "overdue";
        } else {
            status = "ongoing";
        }

        // Process stages
        const cleanedStages = stages.map(stage => {
            const validMembers = stage.members
                .map(member => {
                    const memberId = typeof member === "object" ? member.value : member;
                    return mongoose.Types.ObjectId.isValid(memberId) 
                        ? new mongoose.Types.ObjectId(memberId) 
                        : null;
                })
                .filter(Boolean);

            return {
                no: stage.no,
                title: stage.title,
                members: validMembers
            };
        });

        // Create new task
        const newTask = new Tasks({
            title,
            description,
            status,
            assignedBy: new mongoose.Types.ObjectId(userId),
            stages: cleanedStages,
            relatedTeam: new mongoose.Types.ObjectId(relatedTeam),
            progress: 0,
            startDate: formattedStartDate,
            deadline: formattedDeadline
        });

        // Save task
        const savedTask = await newTask.save();

        // Create activity (with proper error handling)
        try {
            const activity = new Activity({
                user: req.user.userId,
                activityType: "task_created",
                entityType: "Task",
                entityId: savedTask._id,
                metadata: {
                    taskTitle: title,
                    teamId: relatedTeam
                },
                team: relatedTeam,
                visibility: "team"
            });
            await activity.save();
        } catch (activityError) {
            console.error("Activity creation failed:", activityError);
            // Don't fail the whole request if activity fails
        }

        res.status(201).json({ 
            message: "Task created successfully", 
            task: savedTask 
        });

    } catch (error) {
        console.error("Error in createTask:", error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getUserTask = async(req,res) =>{
    try{
        console.log("Entered in getUserTask in taskController.js");
        const {selectedTeam} = req.params;
        const userId = req.user.userId;
        const currentDate = new Date();

        const Ongoing = [];
        const Completed = [];
        const Upcoming = [];

        const tasks = await Tasks.find({"stages.members" : userId,relatedTeam : selectedTeam}).populate("stages.members","name email profilePicture").populate("assignedBy","name email profilePicture");

        tasks.forEach(task=>{
            if(task.progress==100){
                Completed.push(task);
            }
            else if(task.startDate>currentDate){
                Upcoming.push(task);
            }
            else if(task.startDate<=currentDate && (task.deadline>=currentDate || task.progress<100)){
                Ongoing.push(task);
            }
        })

        console.log("completed getUserTask successfully in taskController.js");
        res.status(200).json({Ongoing,Completed,Upcoming});

    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.getAllTasks = async(req,res) =>{
    try{
        console.log("Entered in getAlltasks in taskController.js");
        const {selectedTeam} = req.params;
        console.log("selectedTeam : ",selectedTeam);
        const currentDate = new Date();

        const Ongoing = [];
        const Completed = [];
        const Upcoming = [];
        const tasks = await Tasks.find({ relatedTeam: selectedTeam })
            .populate({
                path: "stages.members",
                select: "name"
            })
            .populate("stages.members")
            .populate("assignedBy", "name") // Populate assignedBy field
            .populate("relatedTeam", "name"); // If needed, populate team name

        tasks.forEach(task=>{
            if(task.progress==100){
                Completed.push(task);
            }
            else if(task.startDate>currentDate){
                Upcoming.push(task);
            }
            else if(task.startDate<=currentDate && (task.deadline>=currentDate || task.progress<100)){
                Ongoing.push(task);
            }
        })
        console.log("completed getAllTasks successfully in taskController.js");
        res.status(200).json({Ongoing,Completed,Upcoming});
    }
    catch(error){
        console.error("Error in getAllTasks:", error);
        res.status(500).json({error:error.message});
    }
}

exports.updateTaskProgress = async (req,res) =>{
    try{
        console.log("Entered in updateTaskProgress in taskController.js");
        const userId = req.user.userId;
        const {task,stage} = req.body;

        const task1 = await Tasks.findOne({_id:task});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }

        const existTask = await Tasks.findOne({_id : task,stages : stage});

        if(!existTask){
            return res.status(200).json({message:"You dont have access to update task"});
        }

        existTask.progress = Progress;

        if(task.progress===100){
            task.status="completed";
        }
        await task.save();
        console.log("completed updateTaskProgress successfully in taskController.js");
        res.status(200).json({message:"Task progress updated",task});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.deleteTask = async (req,res) =>{
    try{
        console.log("Entered in deleteTask in taskController.js");
        const userId = req.user.userId;
        const {task} = req.body;

        const task1 = await Tasks.findOne({_id:task});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }
        if(userId!==task1.Admin._id){
            return res.status(500).json({message:"No access to delete task"});
        }

        task1.isDeleted = true;

        await task1.save();

        const activity = new Activity({
            user : req.user.userId,
            activityType : "task_delete",
            entityType : "Task",
            entityId : task1._id,
            metadata : {
                taskTitle : task1.title
            },
            team : task1.relatedTeam,
            visibility : "team"
        })
        activity.save();

        console.log("completed deleteTask successfully in taskController.js");
        res.status(200).json({message:"Task Deleted"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

exports.updateStage = async (req,res) =>{
    try{
        console.log("Entered in updateStage in taskController.js");
        const userId = req.user.userId;
        const {taskId,stageNo} = req.params;
        const {action,updateData} = req.body;

        const task1 = await Tasks.findOne({_id:taskId});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }
        if(userId!==task1.Admin._id){
            return res.status(500).json({message:"No access to delete task"});
        }

        let stage = task1.stages.find(stage=>stage.no===stageNo);
        if(stageIndex===-1){
            return res.status(404).json({ message: "Stage not found" });
        }

        if(action=="delete"){
            task1.stages.filter(stage=>stage.no!==parseInt(stageNo))
        }
        else{
            Object.assign(stage,updateData);
        }

        await task1.save();
        console.log("completed updateStage successfully in taskController.js");
        res.status(200).json({message: action=="delete"?`stage deleted`:`task updated`,task1});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

exports.submitStageUpdate = async (req, res) => {
    try {
        const { taskId, stageIndex, description, files = [], teamDocuments = [], teamId } = req.body;

        if (!taskId || stageIndex === undefined || !description || !teamId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const formattedFiles = files.map(file => ({
            name: file.name || 'unnamed',
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
            url: file.url || ''
        }));

        const updateRequest = {
            stageIndex,
            description,
            files: formattedFiles,
            teamDocuments: teamDocuments,
            submittedBy: req.user.userId,
            status: 'pending',
            submittedAt: new Date()
        };

        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            { $push: { updateRequests: updateRequest } },
            { new: true, runValidators: true }
        );

        const task = await Tasks.findOne({_id : taskId});

        if (!updatedTask || !task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.stages.filter(stage=>(stage.no===stageIndex?stage.status="For_Approval" : stage.status=stage.status));
        await task.save();
        
        // Get the newly added updateRequest's ID
        const latestUpdateRequest = updatedTask.updateRequests[updatedTask.updateRequests.length - 1];
        const updateRequestId = latestUpdateRequest?._id;

        // Create notification
        const notification = new Notification({
            recipient: updatedTask.assignedBy,
            type: 'stage_update',
            message: `New stage update request for "${updatedTask.title}"`,
            requestedBy: req.user.userId,
            relatedTeam: teamId,
            relatedTask: taskId,
            relatedStage: stageIndex,
            updateRequestId
        });

        await notification.save();

        res.status(200).json({ 
            message: 'Update submitted for approval',
            updateRequestId
        });

    } catch (error) {
        console.error('Error in submitStageUpdate:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.handleStageUpdate = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { action } = req.body;
      
      const task = await Tasks.findOne({ 'updateRequests._id': requestId });
      if (!task) {
        return res.status(404).json({ message: 'Update request not found' });
      }
      
      const updateRequest = task.updateRequests.id(requestId);
      
      if (action === 'approve') {
        const stage = task.stages[updateRequest.stageIndex];
        
        // Add the update to the stage's updates array
        stage.updates.push({
          updatedBy: updateRequest.submittedBy,
          comments: updateRequest.description,
          attachment: updateRequest.files.length > 0 ? updateRequest.files[0].url : null
        });
        
        // Add team documents if any
        if (updateRequest.teamDocuments && updateRequest.teamDocuments.length > 0) {
          stage.attachedDocuments = stage.attachedDocuments || [];
          stage.attachedDocuments.push(...updateRequest.teamDocuments);
        }
      }
      
      // Update request status
      updateRequest.status = action;
      updateRequest.processedBy = req.user.id;
      updateRequest.processedAt = new Date();
      
      await task.save();
      
      // Create response notification
      const notification = new Notification({
        recipient: updateRequest.submittedBy,
        type: 'stage_update_response',
        message: `Your stage update was ${action}`,
        requestedBy: req.user.id,
        relatedTeam: task.relatedTeam,
        relatedTask: task._id,
        relatedStage: updateRequest.stageIndex
      });
      await notification.save();
      
      res.status(200).json({ message: `Update ${action}d successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
}

exports.getPendingUpdates = async (req, res) => {
try {
    const { teamId } = req.params;
    
    const tasks = await Task.find({
    team: teamId,
    'updateRequests.status': 'pending'
    })
    .populate('updateRequests.submittedBy', 'name email')
    .populate('updateRequests.teamDocuments', 'title')
    .lean();
    
    // Flatten the update requests with task info
    const updateRequests = tasks.flatMap(task => 
    task.updateRequests
        .filter(req => req.status === 'pending')
        .map(req => ({
        ...req,
        task: {
            _id: task._id,
            title: task.title,
            stages: task.stages
        }
        }))
    );
    
    res.status(200).json({ updateRequests });
} catch (error) {
    res.status(500).json({ message: 'Server error', error });
}
}

exports.uploadFileToDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const files = req.files; // Assuming you're using multer or similar
        
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Process each uploaded file
        const uploadedFiles = files.map(file => ({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            url: file.path, // Or the URL from cloud storage
            storageType: "local" // Change if using cloud storage
        }));

        // Update document
        document.files = [...document.files, ...uploadedFiles];
        document.documentType = document.content ? "mixed" : "file";
        await document.save();

        res.status(200).json({ 
            message: "Files uploaded successfully",
            files: uploadedFiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Failed to upload files", 
            error: error.message 
        });
    }
};
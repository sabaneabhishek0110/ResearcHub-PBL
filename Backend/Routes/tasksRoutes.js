const express = require('express');
const taskcontroller = require('../Controllers/taskController');
const notificationController = require('../Controllers/notificationController')
const taskMiddleware = require('../Middlewares/taskMiddleware')

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.post('/createtask',taskMiddleware,taskcontroller.createTask);
router.get('/getAllTasks/:selectedTeam',taskMiddleware,taskcontroller.getAllTasks);
router.get('/getUserTasks/:selectedTeam',taskMiddleware,taskcontroller.getUserTask);
router.post('/updateProgress',taskMiddleware,taskcontroller.updateTaskProgress);

router.get('/taskNotification',notificationController.getTaskNotification);
router.put('/updateNotificationStatus',notificationController.updateNotificationStatus);

router.put('/deleteTask',taskMiddleware,taskcontroller.deleteTask);
router.put('/updateStage/:taskId/:stageNo',taskMiddleware,taskcontroller.updateStage);

// Submit stage update for approval
router.post('/submitStageUpdate', taskMiddleware,taskcontroller.submitStageUpdate);
  
// Approve/reject stage update (admin only)
router.put('/handleStageUpdate/:requestId', taskMiddleware,taskcontroller.handleStageUpdate);

// Get pending update requests for a team
router.get('/getPendingUpdates/:teamId', taskMiddleware,taskcontroller.getPendingUpdates);

module.exports = router;
const express = require('express');
const profileMiddleware = require('../Middlewares/profileMiddleware');
const authMiddleware = require('../Middlewares/userMiddleware')
const notificationController = require('../Controllers/notificationController');
const userMiddleware = require('../Middlewares/userMiddleware');

const router = express.Router();

router.post('/addRequest',profileMiddleware,notificationController.addToGroupRequest);
router.get('/getNotifications',profileMiddleware,notificationController.getNotifications);
// Delete notification (for reject request)
router.delete('/reject_Team_join/:id', profileMiddleware, notificationController.deleteNotification);

// Get unread count
router.get('/unreadCount',userMiddleware, notificationController.getUnReadCount);

// Get all notifications for user
router.get('/user', userMiddleware,notificationController.getAllNotifications);

// Mark as read
router.put('/markAllAsRead',userMiddleware, notificationController.markAllAsRead);

// Mark notification as read
router.put('/markAsRead/:notificationId', userMiddleware, notificationController.MarkAsRead);

router.get('/notifications/count', userMiddleware, notificationController.getCountNotifications);

// Check for unread notifications for specific user in specific team
router.get('/userUnread/:teamId', userMiddleware,notificationController.getUnReadNotifications);

router.post('/handleAction/:notificationId', userMiddleware, notificationController.handleAction);


module.exports = router;
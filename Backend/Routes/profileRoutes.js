const express = require('express');
const profileController = require('../Controllers/profileController');
const profileMiddleware = require('../Middlewares/profileMiddleware');
const ActivityController = require('../Controllers/activityController');
const upload = require('../Middlewares/upload');

const router = express.Router();

router.get('/',profileMiddleware,profileController.getParticularUser);

router.get("/stats",profileMiddleware,profileController.getUserStats1);

router.get("/activities",profileMiddleware,ActivityController.getUserActivities);

router.post('/giveAccess',profileController.giveAccess);

router.patch('/updateProfile',profileMiddleware,upload.single('profilePicture'),profileController.updateProfile);


module.exports = router;
const express = require('express');
const userMiddleware = require('../Middlewares/userMiddleware');
const yourTeamController = require('../Controllers/yourTeamsController');

const router = express.Router();

router.get('/getYourTeams',userMiddleware,yourTeamController.getAllTeams);
router.get('/getParticularTeam/:teamId',userMiddleware,yourTeamController.getParticularTeam);
router.get('/CheckAdminOrNot/:adminId',userMiddleware,yourTeamController.CompareIsAdminOrNot);

module.exports = router;
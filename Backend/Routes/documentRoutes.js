const express = require('express');
const documentController = require('../Controllers/documentController');
const taskController = require("../Controllers/taskController");

const router = express.Router();

router.get('/getUserDocuments',userMiddleware,documentController.getUserDocuments);

router.post('/:documentId/files',userMiddleware,taskController.uploadFileToDocument);

module.exports = router;
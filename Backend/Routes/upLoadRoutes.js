const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile } = require('../Controllers/upLoadController');
const auth = require('../Middlewares/auth');

// Protected routes - require authentication
router.post('/', auth, uploadFile);
router.delete('/delete/:filename', auth, deleteFile);

module.exports = router;
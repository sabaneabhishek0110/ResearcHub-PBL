const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and Office documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.uploadFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const isImage = req.file.mimetype.startsWith('image/');
      const resourceType = isImage ? 'image' : 'raw';

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        // folder: `users/${req.user._id}/${new Date().toISOString().split('T')[0]}`,
        resource_type: resourceType,
        access_mode: 'public',
        // type: isImage ? 'upload' : 'authenticated', // authenticated only for non-images
        // sign_url: !isImage
      });

      fs.unlinkSync(req.file.path); // Cleanup temp file

      let fileUrl = uploadResult.secure_url;

      if (!isImage) {
        fileUrl = cloudinary.url(uploadResult.public_id, {
          resource_type: 'raw',
          // secure: true,
          // sign_url: true,
          // type: 'authenticated'
        });
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        url: fileUrl,
        originalName: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: error.message
      });
    }
  }
];

// Optional delete endpoint
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    }
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

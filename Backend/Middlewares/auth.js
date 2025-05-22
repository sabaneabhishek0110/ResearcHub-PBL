const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Invalid or missing Authorization header');
            return res.status(401).json({ message: 'Invalid or missing Authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Extracted token:', token.substring(0, 20) + '...');

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        if (!decoded || !decoded.userId) {
            console.log('Invalid token structure');
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        // Find user by id
        const user = await User.findById(decoded.userId)
            .select('-password -otp -otpExpires'); // Exclude sensitive fields
        
        if (!user) {
            console.log('User not found for ID:', decoded.userId);
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user and token to request object
        req.user = user;
        req.token = token;
        
        console.log('Auth successful for user:', user.email);
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        
        res.status(401).json({ 
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = auth; 
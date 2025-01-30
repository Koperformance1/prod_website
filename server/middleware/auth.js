// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Log the incoming authorization header
        console.log('Auth header:', req.header('Authorization'));

        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided');
            throw new Error('No authentication token provided');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded successfully:', decoded);
            req.user = decoded;
            next();
        } catch (err) {
            console.log('Token verification failed:', err.message);
            throw new Error('Invalid token');
        }
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ message: err.message || 'Please authenticate' });
    }
};

module.exports = authMiddleware;
// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// server/routes/auth.js
// Add this route after your login route:

// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, adminSecret } = req.body;
        
//         // Check admin secret (store this in your .env file)
//         if (adminSecret !== process.env.ADMIN_SECRET) {
//             return res.status(403).json({ message: 'Invalid admin secret' });
//         }

//         // Check if user exists
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username already exists' });
//         }

//         // Create new admin user
//         const user = new User({
//             username,
//             password,
//             isAdmin: true
//         });

//         await user.save();
//         res.status(201).json({ message: 'Admin user created successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;
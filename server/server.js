const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const parqRoutes = require('./routes/parq');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

const app = express();
const journeyRoutes = require('./routes/journeys');
const contactRoutes = require('./routes/contact');

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/journeys', journeyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', parqRoutes);


console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error details:', {
            message: err.message,
            code: err.code,
            name: err.name
        });
        console.error('Server will continue running but database functionality will be limited');
    });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build', 'index.html'));
    });
}

// JWT Secret check
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required');
    process.exit(1);
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});
// First, install necessary packages:
// npm install multer cloudinary multer-storage-cloudinary

const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'journeys',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: resize images
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Public routes (no authentication required)
// Get all journeys
router.get('/', async (req, res) => {
    try {
        const journeys = await Journey.find().sort({ completedAt: -1 });
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single journey
router.get('/:id', async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.json(journey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected routes (require authentication)
// Create a new journey with image upload
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
    try {
        // Debug logs
        console.log('Files received:', req.files);
        console.log('Body received:', req.body);
        
        // Get uploaded file URLs from Cloudinary
        const imageUrls = req.files ? req.files.map(file => file.path) : [];
        console.log('Image URLs:', imageUrls);

        // Parse technologies array if it's a string
        let technologies = req.body.technologies;
        if (typeof technologies === 'string') {
            technologies = JSON.parse(technologies);
        }

        const journey = new Journey({
            ...req.body,
            technologies,
            images: imageUrls
        });

        console.log('Journey before save:', journey);

        const newJourney = await journey.save();
        console.log('Journey after save:', newJourney);
        
        res.status(201).json(newJourney);
    } catch (error) {
        console.error('Error in POST /journeys:', error);
        // If there's an error, clean up any uploaded images
        if (req.files) {
            for (const file of req.files) {
                try {
                    const publicId = file.filename;
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Cleaned up file:', publicId);
                } catch (cleanupError) {
                    console.error('Error cleaning up file:', cleanupError);
                }
            }
        }
        res.status(400).json({ message: error.message });
    }
});

// Update a journey with image upload
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        // Get existing images from the request
        let existingImages = [];
        try {
            existingImages = JSON.parse(req.body.existingImages || '[]');
        } catch (error) {
            console.error('Error parsing existingImages:', error);
            existingImages = [];
        }

        // Get URLs of newly uploaded images
        const newImageUrls = req.files ? req.files.map(file => file.path) : [];

        // Combine existing and new images
        const allImages = [...existingImages, ...newImageUrls];

        // Parse other fields
        let technologies = req.body.technologies;
        if (typeof technologies === 'string') {
            technologies = JSON.parse(technologies);
        }

        // Update journey
        Object.assign(journey, {
            ...req.body,
            technologies,
            images: allImages
        });

        const updatedJourney = await journey.save();
        res.json(updatedJourney);
    } catch (error) {
        // If there's an error, clean up any newly uploaded images
        if (req.files) {
            for (const file of req.files) {
                const publicId = file.filename;
                await cloudinary.uploader.destroy(publicId);
            }
        }
        res.status(400).json({ message: error.message });
    }
});

// Delete a journey
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        // Delete images from Cloudinary
        for (const img of journey.images) {
            const publicId = img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await journey.deleteOne();
        res.json({ message: 'Journey deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
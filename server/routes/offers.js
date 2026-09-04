const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'offers',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

// Public - get the current offer (creates a default one if none exists yet)
router.get('/', async (req, res) => {
    try {
        let offer = await Offer.findOne();
        if (!offer) {
            offer = await Offer.create({});
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected - update the offer (creates it if it doesn't exist yet)
router.put('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        let offer = await Offer.findOne();

        const updates = {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        };

        // New image uploaded - use it
        if (req.file) {
            updates.image = req.file.path;
        } else if (req.body.existingImage !== undefined) {
            // No new file, but frontend tells us what the image should be
            // (keeps it, or clears it if existingImage is empty string)
            updates.image = req.body.existingImage;
        }

        if (offer) {
            // Clean up old image from Cloudinary if it's being replaced or removed
            if (offer.image && offer.image !== updates.image) {
                try {
                    const publicId = offer.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`offers/${publicId}`);
                } catch (cleanupError) {
                    console.error('Error cleaning up old offer image:', cleanupError);
                }
            }
            Object.assign(offer, updates);
            offer = await offer.save();
        } else {
            offer = await Offer.create(updates);
        }

        res.json(offer);
    } catch (error) {
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded file:', cleanupError);
            }
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
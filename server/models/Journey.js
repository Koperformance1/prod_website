const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        required: true
    }],
    imageUrl: {
        type: String,
        required: false
    },
    images: [{
        type: String
    }],
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

const Journey = mongoose.model('Journey', journeySchema);

module.exports = Journey;
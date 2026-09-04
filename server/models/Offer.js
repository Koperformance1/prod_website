const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'This Month\'s Offer'
    },
    body: {
        type: String,
        required: true,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Offer', offerSchema);
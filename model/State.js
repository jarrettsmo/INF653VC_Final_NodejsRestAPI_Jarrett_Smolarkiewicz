const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    admission: {
        type: Date,
        required: true,
        index: true,
        unique: false
    },
    capital: {
        type: String,
        required: true,
        unique: true
    },
    population: {
        type: Number,
        required: true,
        index: true,
        unique: false
    },
    funfacts: [{
        type: String,
        default: "No fun facts yet!"
    }]
});

// Export module (Database Schema)
module.exports = mongoose.model('State', stateSchema);
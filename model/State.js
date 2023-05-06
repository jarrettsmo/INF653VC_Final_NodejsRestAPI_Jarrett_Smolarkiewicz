const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    contig: {
        type: Boolean,
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
        unique: true
    },
    capital: {
        type: String,
        required: true,
        unique: true
    },
    population: {
        type: Number,
        required: true,
        unique: true
    },
    funfacts: [{
        type: String,
        default: "No fun facts yet!"
    }]
});

module.exports = mongoose.model('State', stateSchema);
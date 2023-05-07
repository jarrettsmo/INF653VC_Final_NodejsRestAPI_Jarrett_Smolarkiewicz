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
        index: true,
        unique: false
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

module.exports = mongoose.model('State', stateSchema);
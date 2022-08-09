// import dependencies
const mongoose = require('mongoose')

// toy is a subdocument NOT A MODEL
// toy will be part of the toys array added to specfic pets

// we dont, DO NOT, need to get the model from mongoose, so we're goling to save a little real estate in our file and skip destructuring in favor of the regular syntax
const salsaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    condition: {
        type: String,
        enum: ['hot', 'medium', 'mild'],
        default: 'mild'
    },

}, {
    timestamps: true
})

module.exports = salsaSchema
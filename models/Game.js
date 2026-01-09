const mongoose = require('mongoose')

const Game = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    version: {type: String, default: '1.0'},
    previewUrl: {type: String, required: true},
    downloadUrl: {type: String, required: true},
    rating: {type: Number, default: 0},
    summRating: {type: Number, default: 0},
    marks: {type: Number, default: 0}
})

module.exports = mongoose.model('Game', Game)
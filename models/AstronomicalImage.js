const mongoose = require('mongoose')

const AstronomicalImage = new mongoose.Schema({
    imageUrl: {type: String, required: true},
    text: {type: String, default: ""},
    event: {type: mongoose.Types.ObjectId, required: true}
})

module.exports = mongoose.model('AstronomicalImage', AstronomicalImage)

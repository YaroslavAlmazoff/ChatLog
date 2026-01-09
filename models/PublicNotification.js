const mongoose = require('mongoose')

const PublicNotification = new mongoose.Schema({
    text: {type: String, required: true},
    public: {type: mongoose.Types.ObjectId, required: true},
})

module.exports = mongoose.model('PublicNotification', PublicNotification)

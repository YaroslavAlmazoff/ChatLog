const mongoose = require('mongoose')

const PublicComment = new mongoose.Schema({
    text: {type: String, required: true},
    date: {type: String, required: true},
    postID: {type: mongoose.Types.ObjectId, required: true},
    user: {type: mongoose.Types.ObjectId, required: true},
    likes: {type: Number, default: 0}
})

module.exports = mongoose.model('PublicComment', PublicComment)

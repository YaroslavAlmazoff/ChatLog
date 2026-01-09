const mongoose = require('mongoose')

const Comment = new mongoose.Schema({
    comment: {type: String, required: true},
    date: {type: String, required: true},
    articleID: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, required: true},
    likes: {type: Number, default: 0}
})

module.exports = mongoose.model('Comment', Comment)
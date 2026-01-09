const mongoose = require('mongoose')

const UserPost = new mongoose.Schema({
    title: {type: String},
    date: {type: String, required: true},
    images: [{type: String, required: true}],
    likes: {type: Number, required: true, default: 0},
    comments: {type: Number, required: true, default: 0},
    likers: [{type: mongoose.Types.ObjectId, default: []}],
    user: {type: String, required: true},
})

module.exports = mongoose.model('UserPost', UserPost)

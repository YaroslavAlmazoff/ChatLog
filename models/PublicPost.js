const mongoose = require('mongoose')

const PublicPost = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: String, required: true},
    likes: {type: Number, required: true, default: 0},
    comments: {type: Number, required: true, default: 0},
    images: [{type: String, required: true}],
    public: {type: mongoose.Types.ObjectId, required: true},
})

module.exports = mongoose.model('PublicPost', PublicPost)

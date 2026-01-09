const mongoose = require('mongoose')

const Like = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, required: true},
    post: {type: mongoose.Types.ObjectId, required: true}
})

module.exports = mongoose.model('Like', Like)
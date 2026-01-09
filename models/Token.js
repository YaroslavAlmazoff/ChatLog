const mongoose = require('mongoose')

const Token = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, required: true},
    token: {type: String, required: true}
})

module.exports = mongoose.model('Token', Token)
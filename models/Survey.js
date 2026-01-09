const mongoose = require('mongoose')

const Survey = new mongoose.Schema({
    title: {type: String, required: true},
    variants: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('Survey', Survey)
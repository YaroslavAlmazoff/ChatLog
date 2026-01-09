const mongoose = require('mongoose')

const TestQuestion = new mongoose.Schema({
    title: {type: String, required: true},
    variants: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('TestQuestion', TestQuestion)
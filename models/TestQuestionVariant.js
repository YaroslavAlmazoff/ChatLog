const mongoose = require('mongoose')

const TestQuestionVariant = new mongoose.Schema({
    title: {type: String, required: true},
    people: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('TestQuestionVariant', TestQuestionVariant)
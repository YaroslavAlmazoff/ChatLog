const mongoose = require('mongoose')

const Test = new mongoose.Schema({
    title: {type: String, required: true},
    questions: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('Test', Test)
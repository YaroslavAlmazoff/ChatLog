const mongoose = require('mongoose')

const SurveyVariant = new mongoose.Schema({
    title: {type: String, required: true},
    people: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('SurveyVariant', SurveyVariant)
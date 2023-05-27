const mongoose = require('mongoose')

const AEPNotificationToken = new mongoose.Schema({
    token: {type: String, required: true}
})

module.exports = mongoose.model('AEPNotificationToken', AEPNotificationToken)
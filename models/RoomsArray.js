const mongoose = require('mongoose')

const RoomsArrray = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, required: true},
    rooms: [{type: mongoose.Types.ObjectId, required: true}]
})

module.exports = mongoose.model('RoomsArray', RoomsArrray)
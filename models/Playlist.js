const mongoose = require('mongoose')

const Playlist = new mongoose.Schema({
    name: {type: String, default: 'Новый плейлист'},
    public: {type: mongoose.Types.ObjectId, required: true},
})

module.exports = mongoose.model('Playlist', Playlist)

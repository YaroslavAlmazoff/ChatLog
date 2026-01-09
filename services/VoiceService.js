const uuid = require('uuid')
const sphinx = require('node-sphinx')
const UserPost = require('../models/UserPost.js')
const FileService = require('../services/FileService.js')
const path = require('path')
const User = require('../models/User.js')

class VoiceService {
    async createVoicePost(req, res) {
        const {date} = req.body
        sphinx.recognizerInit({
            hmm: path.join(__dirname,"node_modules/node-sphinx/src/pocketsphinx/model/en-us/en-us"),
            lm: path.join(__dirname,"node_modules/node-sphinx/src/pocketsphinx/model/en-us/en-us.lm.bin"),
            dict: path.join(__dirname,"node_modules/node-sphinx/src/pocketsphinx/model/en-us/cmudict-en-us.dict")
        },(error,data) => {
            if(error) {
                console.log(error)           
                return   
            }
            if(data.rc != 0) {
                console.log("Ошибка инициализации: rc=" + data.rc)
                return
            }
            
            console.log("Инициализированно");       
        })
        sphinx.recognizerStart((error,data) => {
            if(error) {
                console.log(error)
                return
            }
            if(data.rc != 0) {
                console.log("Ошибка распознавания: rc=" + data.rc + "; message=" + data.result)
                return
            }
            const getImages = () => {
                if(req.files) {
                    return Object.keys(req.files).map((file) => {
                        const filename = uuid.v4() + '.jpg'
                        return filename
                    })
                } else {
                    return []
                }
    
            }
    
            const images = getImages()
            UserPost.create({title: data.result, date, images, user: req.user.userId})
            .then(async data => {
                const user = await User.findById(req.user.userId)
                user.friends.forEach(async el => {
                    const friend = await User.findById(el)
                    const friendsNews = friend.friendsNews
                    friendsNews.unshift(data._id)
                    await User.findByIdAndUpdate(el, {friendsNews})
                })
            })
                
            if(req.files) {Object.keys(req.files).forEach((file, i) => {
                FileService.insertUserPostImage(req.files[file], images[i])
            })}
    
            res.json("")  
        })
    }
}

module.exports = new VoiceService()
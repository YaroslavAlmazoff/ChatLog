const uuid = require('uuid')
const AEPNotificationToken = require('../../models/AEPNotificationToken')
const AstronomicalEvent = require('../../models/AstronomicalEvent')
const FileService = require('../FileService')
const request = require('request')
const {getMonth, is31} = require('./getMonth')
const AstronomicalImage = require('../../models/AstronomicalImage')

class AEPController { 
    async events(req, res) {
        const events = await AstronomicalEvent.find({})
        const result = events.filter(item => item.upcoming)
        const result2 = events.filter(item => !item.upcoming)
        result.sort((a, b) => parseFloat(a.sort) - parseFloat(b.sort))
        result2.sort((a, b) => parseFloat(b.sort) - parseFloat(a.sort))
        res.json({future: result, past: result2})
    }
    async uploadImage(req, res) {
        const filename = uuid.v4() + '.jpg'
        let text = req.body.text.replace("\"", "")
        text = text.replace("\"", "")
        await AstronomicalImage.create({imageUrl: filename, event: req.params.event, text})
        FileService.insertAstronomicalImage(req.files.file, filename)
        res.json("")
    }
    async imagesList(req, res) {
        const images = await AstronomicalImage.find({event: req.params.event})
        res.json({images})
    }
    async newEvent(req, res) {
        let {text, month, day, time, interesting, information, sort} = req.body
        const events = await AstronomicalEvent.find({})
        if(!sort) {
            if(!events.length) {
                sort = 0
            } else {
                sort = events[events.length - 1].sort + 10
            }
        }
        const filename = uuid.v4() + '.png'
        await AstronomicalEvent.create({text, month: month.toLowerCase(), day, time, interesting, image: filename, information, sort})
        FileService.insertAstronomicalEvent(req.files.file, filename)
        res.json({message: 'OK'})
    }
    async newToken(req, res) {
        const token = req.params.token
        const tokens = await AEPNotificationToken.find({})
        let tokenExists = false
        tokens.forEach(item => {
            if(item.token === token) {
                tokenExists = true
                res.json({m:"token exists"})
                return
            }
        })
        if(!tokenExists) {
            await AEPNotificationToken.create({token})
            res.json({message:'success!'})
        }
    }
    async startNotifications() {
        const getEventExists = async () => {
            const events = await AstronomicalEvent.find({})
            const tokens = await AEPNotificationToken.find({})
            let date = new Date()
            for(var item of events) {
                if(item.month == getMonth().string && item.day == date.getDate() && item.time.split(':')[0] < date.getHours() && item.time.split(':')[1] < date.getMinutes()) {
                    console.log("upcoming")
                    await AstronomicalEvent.findByIdAndUpdate(item._id, {upcoming: false})
                }

                if(item.month == "июнь" && item.day == "4") {
                    console.log(item.month, getMonth().string, item.month == getMonth().string)
                    console.log(item.day, date.getDate() + 1, item.day == date.getDate() + 1)
                    console.log(item.month == getMonth().string && item.day == date.getDate() + 1)
                    console.log(item.month, getMonth().next(), item.month == getMonth().next())
                    console.log(item.day, 1, item.day == 1)
                    console.log(date.getDate(), is31(getMonth().string), date.getDate() == is31(getMonth().string))
                    console.log(item.month == getMonth().next() && item.day == 1 && date.getDate() == is31(getMonth().string))
                }
                console.log(date.getDate())
                if((item.month == getMonth().string && item.day == date.getDate() + 1) || (item.month == getMonth().next() && item.day == 1 && date.getDate() == is31(getMonth().string)) || (item.month == getMonth().string && item.day == date.getDate() && item.time.split(':')[0] < date.getHours())) {
                    console.log("хрень")
                    tokens.forEach((el) => {
                        const message = {
                            to: el.token,
                            notification: {
                                title: item.interesting ? "Новое ИНТЕРЕСНОЕ астрособытие!" : "Новое астрособытие!",
                                body: item.text
                            }, 
                        }
                        request("https://fcm.googleapis.com/fcm/send", {
                            method: "POST",
                            json: true,
                            headers: {
                                Authorization: "key=AAAApp-k10w:APA91bHKfJHbb-noT-O7XyJ1Ue2qWZBj_-0jIlXHT8Ob1-RkCi9saM_ySPPF8Uuu5nGcFhppW5yJ2ebuE_Ur7OOuzHeLzLl1tbrw9Xjq8pvsrIEDHU9Q0BYMkSy8bA_axsKS8I7GLSnN"
                            },
                            body: message
                        }, (err, response) => {
                            if(err) console.log(err)
                            //console.log(response)
                        })
                    })
                } else {
                    //return false
                }
            }
        }
        getEventExists()
    }
}

module.exports = new AEPController()
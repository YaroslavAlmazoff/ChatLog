const Room = require('../models/Room')
const events = require('events')
const path = require('path')
const emitter = new events.EventEmitter()
const Message = require('../models/Message')
const User = require('../models/User')
const FileService = require('./FileService')
const uuid = require('uuid')
const RoomsArray = require('../models/RoomsArray')
const ImageService = require('./ImageService')



class MessengerService {
    async createRoom(req, res) {
        const user1 = req.user.userId
        const user2 = req.params.to

        const room1 = await Room.findOne({user1, user2})
        const room2 = await Room.findOne({user1: user2, user2: user1})

        if(room1) {
            res.json({err: 1, room: room1})
        } else if(room2) {
            res.json({err: 1, room: room2})
        } else {
            await Room.create({user1, user2})
            res.json({msg: 'success'})
        }
    }
    async getRooms(req, res) {
        const user = req.user.userId

        let rooms1 = await Room.find({user1: user})
        let rooms2 = await Room.find({user2: user})
        const rooms = rooms1.concat(rooms2)
        
        res.json({rooms})
    }
    async getNotReadedRooms(req, res) {
        const user = req.user.userId

        let rooms1 = await Room.find({user1: user})
        let rooms2 = await Room.find({user2: user})
        const rooms = rooms1.concat(rooms2)

        const newRooms = rooms.filter(async el => {
            const messages = await Message.find({room: el._id})
            if(!messages.length) {
                res.json({msg: 'err'})
                return
            }
            const isNotReaded = messages[messages.length - 1].isNotReaded
            console.log(isNotReaded, user != messages[messages.length - 1].user)
            return isNotReaded && user != messages[messages.length - 1].user
        })
        Promise.all(newRooms)
        .then(data => {
            res.json({rooms: data})
        })
        .catch(e =>
            res.json({rooms: []})
        )
    }
    async getRoomsMobile(req, res) {
        const user = req.user.userId

        let rooms1 = await Room.find({user1: user})
        let rooms2 = await Room.find({user2: user})
        const rooms = rooms1.concat(rooms2)
        
        const fullRooms = rooms.map(async el => {
            const room = el
            if(room == null) return null
            const user1 = await User.findById(room.user1)
            const user2 = await User.findById(room.user2)

            if(!user1 || !user2) {
                return null
            }

            const messages = await Message.find({room: room._id})
            if(!messages.length) {
                return null
            }
            const roomObj = room.toObject()
            roomObj.read = !messages[messages.length - 1].isNotReaded || user.toString() == messages[messages.length - 1].user.toString()

            if(user == room.user1) {
                roomObj.name = user2.name + " " + user2.surname
                roomObj.avatar = user2.avatarUrl
                return roomObj
            } else {
                roomObj.name = user1.name + " " + user1.surname
                roomObj.avatar = user1.avatarUrl
                return roomObj
            }
        })
        Promise.all(fullRooms)
        .then(r => {
            const filtered = r.filter(item => item != null)
            res.set({
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Charset': 'utf-8'
            }).json({rooms: filtered})
        })
        .catch((e)=>{
            console.log(e)
            res.json({rooms: [], e: e.message})
        })
    }
    async getRoom(req, res) {
        const user1 = req.user.userId
        const user2 = req.params.user2

        let room = await Room.findOne({user1, user2})
        if(!room) {
            room = await Room.findOne({user1: user2, user2: user1})
        }
        res.json({room})
    }
    async getRoomId(req, res) {
        const user1 = req.user.userId
        const user2 = req.params.user2

        let room = await Room.findOne({user1, user2})
        if(!room) {
            room = await Room.findOne({user1: user2, user2: user1})
        }
        res.json({room: room._id})
    }
    async getRoomById(req, res) {
        const id = req.params.id
        const room = await Room.findById(id)
        const roomObj = room.toObject()
        if(!roomObj.bg) {
            roomObj.bg = ""
        }
        res.json({room: roomObj})
    }
    async getMessageStart(req, res) {
        const room = req.params.room
        const messages = await Message.find({room})
        const fullMessages = messages.map(async el => {
            const message = el.toObject()
            if(!message.message) message.message = ""
            if(!message.to) message.to = ""
            return message
        })
        Promise.all(fullMessages)
        .then(data => {
            const filtered = data.filter((v,i,a)=>a.findIndex(t=>(t.message === v.message && t.date===v.date))===i)
            res.json({messages: filtered})
            res.end()
            return
        })
        .catch(e => {
            console.log(e)
            res.json({messages: []})
            res.end()
            return
        })
    }

    async deleteMessage(req, res) {
        const message = await Message.findById(req.params.id)
        await Room.findByIdAndUpdate(message.room, {lastMessage: ""})
        const sameMessages = await Message.find({message: message.message, date: message.date, room: message.room})
        for await(var i of sameMessages) {
            if(i.imageUrl != "") {
                await ImageService.deleteFile(path.resolve('..', 'static', 'messagefotos', i.imageUrl))
            } else if(i.videoUrl != "") {
                await ImageService.deleteFile(path.resolve('..', 'static', 'messagevideos', i.videoUrl))
            } else if(i.audioUrl != "") {
                await ImageService.deleteFile(path.resolve('..', 'static', 'messageaudios', i.audioUrl))
            }
            await Message.findByIdAndDelete(i._id)
        }
        res.json({msg: 'deleted'})
    }
    async editMessage(req, res) {
        const message = await Message.findById(req.params.id)
        await Message.findByIdAndUpdate(req.params.id, {old: message.message, message: req.body.message})
        await Room.findByIdAndUpdate(message.room, {lastMessage: req.body.message})
        res.json({msg: 'updated'})
    }

    async lastMessage(req, res) {
        const lastMessage = req.body.lastMessage
        console.log(lastMessage)
        const room = req.params.room

        await Room.findByIdAndUpdate(room, {lastMessage})
        res.json({msg: 'success'})
    }
    async newMessageExists(req, res) {
        const room = req.params.id

        const messages = await Message.find({room})
        if(!messages.length) {
            res.json({msg: 'err'})
            return
        }
        const isNotReaded = messages[messages.length - 1].isNotReaded
        res.json({isNotReaded})
    }
    async read(req, res) {
        const id = req.params.id
        const messages = await Message.find({room: id})
        if(!messages[messages.length - 1]) {
            res.json({msg: 'err'})
            return
        }
        const lastMessage = messages[messages.length - 1]
        await Message.findByIdAndUpdate(lastMessage._id, {isNotReaded: false})
        res.json({msg: 'success'})
    }
    async checkRooms(req, res) {
        const user1 = req.user.userId
        const user2 = req.params.user

        const room1 = await Room.findOne({user1, user2})
        const room2 = await Room.findOne({user1: user2, user2: user1})

        if(room1) {
            res.json({room: room1._id, exists: true})
        } else if(room2) {
            res.json({room: room2._id, exists: true})
        } else {
            res.json({room: null, exists: false})
        }
    }
    async getFullLastMessage(req, res) {
        const id = req.params.id
        const messages = await Message.find({room: id})
        if(!messages.length) {
            res.json({msg: 'err'})
            return
        }
        const lastMessage = messages[messages.length - 1]
        res.json({fullLastMessage: lastMessage})
    }
    async lastMessageMobile(req, res) {
        const id = req.params.id
        const messages = await Message.find({room: id})
        if(!messages.length) {
            res.json({msg: 'err'})
            return
        }
        const lastMessage = messages[messages.length - 1]
        const lastMessageObj = lastMessage.toObject()
        if(!lastMessage.message) lastMessage.message = ""
        if(!lastMessage.to) lastMessage.to = ""
        res.json(lastMessageObj)
    }
    async uploadBg(req, res) {
        const filename = uuid.v4() + '.jpg'
        await Room.findByIdAndUpdate(req.params.id, {bg: filename})
        FileService.insertRoomBackground(req.files.file, filename)
        res.json({filename})
    }
    async uploadBgMobile(req, res) {
        const filename = uuid.v4() + '.jpg'
        await Room.findByIdAndUpdate(req.params.id, {bg: filename})
        FileService.insertRoomBackground(req.files.file, filename)
        res.json("")
    }
    async user2byRoom(req, res) {
        const room = await Room.findById(req.params.id)
        console.log("ну пипец", room.user1.toString(), req.params.user, room.user1.toString() == req.params.user)
        console.log("ну капец", room.user2.toString(), req.params.user, room.user2.toString() == req.params.user)
        if(room.user1.toString() == req.params.user) {
            const user = await User.findById(room.user2)
            res.json({user})
            res.end()
            return
        } else if(room.user2.toString() == req.params.user) {
            const user = await User.findById(room.user1)
            res.json({user})
            res.end()
            return
        } else {
            res.json({user: {name: "fuck", surname: "fuckович", lastVisit: "сегодня"}})
            res.end()
            return
        }
    }
}

module.exports = new MessengerService()
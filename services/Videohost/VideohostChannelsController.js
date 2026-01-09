const uuid = require('uuid')
const Channel = require('../../models/Channel')
const User = require('../../models/User')
const FileService = require('../FileService')

class VideohostChannelsController {
    subscribersToPopular = 5
    newChannelsToShow = 30
    popularChannelsToShow = 30
    recommendedChannelsToShow = 50
    recommendedChannelsToShowMain = 5
    sameChannelsToShow = 5
    subscribesToShow = 3 

    async create(req, res) {
        const admin = req.user.userId
        const {name, description, category, date} = req.body

        const exists = await Channel.findOne({name})
        if(exists) {
            res.json({error: 'Имя канала должно быть уникальным'})
            return
        }

        const avatarUrl = uuid.v4() + '.jpg'
        const bannerUrl = uuid.v4() + '.jpg'

        await Channel.create({name, description, category, admin, date})

        if(req.files) {
            if(req.files.avatar) {
                FileService.insertVideohostChannelAvatar(req.files.avatar, avatarUrl)
                await Channel.findOneAndUpdate({name}, {avatarUrl})
            }
            if(req.files.banner) {
                FileService.insertVideohostChannelBanner(req.files.banner, bannerUrl)
                await Channel.findOneAndUpdate({name}, {bannerUrl})
            }
        }
        res.json({msg: 'registered'})
    }
    async all(req, res) {
        const channels = await Channel.find({})
        res.json({channels})
    }
    async edit(req, res) {
        const {name, description, category} = req.body
        const exists = await Channel.findOne({name})
        if(exists) {
            res.json({error: 'Имя канала должно быть уникальным'})
            return
        }

        const avatarUrl = uuid.v4() + '.jpg'
        const bannerUrl = uuid.v4() + '.jpg'

        await Channel.findByIdAndUpdate(req.params.id, {name, description, category})

        if(req.files) {
            if(req.files.avatar) {
                FileService.insertVideohostChannelAvatar(req.files.avatar, avatarUrl)
                await Channel.findOneAndUpdate({name}, {avatarUrl})
            }
            if(req.files.banner) {
                FileService.insertVideohostChannelBanner(req.files.banner, bannerUrl)
                await Channel.findOneAndUpdate({name}, {bannerUrl})
            }
        }
        res.json({msg: 'updated'})
    }
    async channel(req, res) {
        const channel = await Channel.findById(req.params.id)
        res.json({channel})
    }
    async channelByName(req, res) {
        const channel = await Channel.findOne({name: req.body.name})
        res.json({channel})
    }
    async channelByAdmin(req, res) {
        if(!req.params.id) {
            res.json({msg: false})
            return
        }
        const channel = await Channel.findOne({admin: req.params.id})
        res.json({channel})
    }
    async popular(req, res) {
        const allChannels = await Channel.find({})
        const popular = allChannels.filter(el => el.subscribers.length >= this.subscribersToPopular)
        const channels = popular.slice(this.popularChannelsToShow, popular.length)
        res.json({channels})
    }
    async new(req, res) {
        const allChannels = await Channel.find({})
        const newChannels = allChannels.filter(el => el.date.split('.')[0] === req.params.date.split('.')[0])
        const channels = newChannels.slice(this.newChannelsToShow, newChannels.length)
        res.json({channels})
    }
    async recommendedMain(req, res) {
        const user = await User.findById(req.params.id)
        if(user.videohostCategories.length > 0) {
            const recommended = []
            const allChannels = await Channel.find({})
            allChannels.forEach(el => {
                user.videohostCategories.forEach(item => {
                    if(item === el.category && 
                        req.params.id != el.admin.toString()) {
                        el.subscribers.forEach(sub => {
                            if(sub != req.params.id) {
                                recommended.push(el)
                            }
                        })
                    }
                });
            })
            const channels = recommended.slice(0, this.recommendedChannelsToShowMain)
            res.json({channels})
        } else {
            res.json({channels: []})
        }
    }
    async recommended(req, res) {
        const user = await User.findById(req.params.id)
        if(user.videohostCategories.length > 0) {
            const allChannels = await Channel.find({})
            const channels = []
            allChannels.forEach(item => {
                user.videohostCategories.forEach(el => {
                    if(el === item.category) {
                        channels.push(item)
                    }
                })
            })
            res.json({channels})
        } else {
            res.json({channels: []})
        }
    }
    async same(req, res) {
        const allChannels = await Channel.find({})
        const same = allChannels.filter(el => el.category === req.body.category)
        const channels = same.slice(this.sameChannelsToShow, same.length)
        res.json({channels})
    }
    async delete(req, res) {
        await Channel.findByIdAndDelete(req.params.id)
        res.json({msg: 'deleted'})
    }
    async checkName(req, res) {
        const name = req.body.name
        const channel = await Channel.findOne({name})
        if(channel) {
            res.json({message: true})
        } else {
            res.json({message: false})
        }
    }
    async subscribers(req, res) {
        const channel = await Channel.findById(req.params.id)
        const subscriberIDs = channel.subscribers
        const subscribers = subscriberIDs.map(async el => {
            const user = await User.findById(el)
            return user
        })
        res.json({subscribers})
    }
    async subscribersCount(req, res) {
        const channel = await Channel.findById(req.params.id)
        res.json({subscribers: channel.subscribers.length})
    }
    async subscribes(req, res) {
        const user = req.params.id
        const allChannels = await Channel.find({})
        const subscribes = []
        allChannels.forEach(el => {
            el.subscribers.forEach(item => {
                if(item == user) {
                    subscribes.push(el)
                }
            })
        })
        const channels = subscribes.slice(0, this.subscribesToShow)
        res.json({channels})
    }
    async allSubscribes(req, res) {
        const user = req.params.id
        const channels = await Channel.find({})
        const subscribes = []
        channels.forEach(el => {
            el.subscribers.forEach(item => {
                if(item == user) {
                    subscribes.push(el)
                }
            })
        })
        console.log(subscribes)
        res.json({channels: subscribes})
    }
}

module.exports = new VideohostChannelsController()
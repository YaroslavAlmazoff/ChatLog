const Channel = require('../../models/Channel')
const User = require('../../models/User')
const Video = require('../../models/Video')
const Comment = require('../../models/VideohostComment')

class VideohostUserActionsController {
    async likeVideo(req, res) {
        const video = await Video.findById(req.params.id)
        const likes = video.likes + 1
        await Video.findByIdAndUpdate(req.params.id, {likes})
        res.json({msg: 'liked'})
    }
    async likeComment(req, res) {
        const comment = await Comment.findById(req.params.id)
        const likes = comment.likes + 1
        await Comment.findByIdAndUpdate(req.params.id, {likes})
        res.json({msg: ''})
    }
    async dislikeVideo(req, res) {
        const video = await Video.findById(req.params.id)
        const likes = video.likes - 1
        await Video.findByIdAndUpdate(req.params.id, {likes})
        res.json({msg: 'disliked'})
    }
    async dislikeComment(req, res) {
        const comment = await Comment.findById(req.params.id)
        const likes = comment.likes - 1
        await Comment.findByIdAndUpdate(req.params.id, {likes})
        res.json({msg: 'disliked'})
    }
    async view(req, res) {
        const video = await Video.findById(req.params.id)
        const views = video.views + 1
        await Video.findByIdAndUpdate(req.params.id, {views})
        res.json({msg: 'viewed'})
    }
    async comment(req, res) {
        const {text, date} = req.body
        await Comment.create({text, date, videoID: req.params.id, user: req.user.userId})
        const video = await Video.findById(req.params.id)
        const comments = video.comments + 1
        await Video.findByIdAndUpdate(req.params.id, {comments})
        res.json({msg:'success'})
    }
    async deleteComment(req, res) {
        await Comment.findByIdAndDelete(req.params.id)
        const video = await Video.findById(req.params.id)
        const comments = video.comments - 1
        await Video.findByIdAndUpdate(req.params.id, {comments})
        res.json({msg: 'deleted'})
    }
    async subscribe(req, res) {
        const channel = await Channel.findById(req.params.id)
        const subscribers = channel.subscribers
        const isSubscriber = []
        subscribers.forEach(el => {
            if(el.toString() == req.user.userId.toString()) {
                isSubscriber.push(req.user.userId.toString())
            }
        });
        console.log(isSubscriber.length)
        if(isSubscriber.length) {
            const index = subscribers.findIndex(el => {
                console.log('!!!', el, el.toString(), req.user.userId, req.user.userId.toString(), el.toString() == req.user.userId.toString())
                return el.toString() == req.user.userId.toString()
            })
            console.log(index)
            subscribers.splice(index, 1)
            await Channel.findByIdAndUpdate(req.params.id, {subscribers})
            const newchannel = await Channel.findById(req.params.id)
            console.log(newchannel)
            console.log(isSubscriber, true)
            res.json({isSubscriber: false})
        } else {
            subscribers.push(req.user.userId)
            await Channel.findByIdAndUpdate(req.params.id, {subscribers})
            console.log(isSubscriber, false)
            res.json({isSubscriber: true})
        }
    }
    async isSubscriber(req, res) {
        const channel = await Channel.findById(req.params.id)
        const subscribers = channel.subscribers
        const isSubscriber = []
        subscribers.forEach(el => {
            if(el.toString() == req.user.userId.toString()) {
                isSubscriber.push(req.user.userId)
            }
        })
        if(isSubscriber.length) {
            console.log(isSubscriber, true)
            res.json({isSubscriber: true})
        } else {
            console.log(isSubscriber, false)
            res.json({isSubscriber: false})
        }
    }
    async prefer(req, res) {
        const {category} = req.body
        const id = req.user.userId
        const user = await User.findById(id)
        const videohostCategories = user.videohostCategories
        videohostCategories.push(category)
        await User.findByIdAndUpdate(id, {videohostCategories})
        res.json({urburbur: 'efjenei'})
    }
}

module.exports = new VideohostUserActionsController()
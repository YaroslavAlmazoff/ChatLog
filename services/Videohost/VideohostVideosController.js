const uuid = require('uuid')
const Video = require('../../models/Video')
const Channel = require('../../models/Channel')
const User = require('../../models/User')
const FileService = require('../FileService')
const Comment = require('../../models/VideohostComment')
const Playlist = require('../../models/Playlist')

class VideohostVideosController {
    likesToPopular = 4
    newVideosToShow = 30
    popularVideosToShow = 30
    recommendedVideosToShowMain = 50
    recommendedVideosToShowVideoPage = 5
    sameVideosToShow = 5
    interestingVideosToShowLikes = 4
    interestingVideosToShowCommments = 1 

    async create(req, res) {
        const channel = await Channel.findOne({admin: req.user.userId})
        const {title, description, date} = req.body

        const previewUrl = uuid.v4() + '.jpg'
        const videoUrl = uuid.v4() + '.mp4'

        await Video.create({title, description, date, category: channel.category, channel: channel._id, previewUrl, videoUrl})

        FileService.insertVideohostVideoPreview(req.files.preview, previewUrl)
        FileService.insertVideohostVideo(req.files.video, videoUrl)

        res.json({id: channel._id})
    }
    async edit(req, res) {
        const {title, description} = req.body

        const previewUrl = uuid.v4() + '.jpg'

        await Video.findByIdAndUpdate(req.body.id, {title, description})
        if(req.files) {
            if(req.files.preview) {
                FileService.insertVideohostVideoPreview(req.files.preview, previewUrl)
                await Video.findOneAndUpdate({title}, {previewUrl})
            }
        }
        res.json({msg: 'updated'})
    }
    async video(req, res) {
        const video = await Video.findById(req.params.id)
        res.json({video})
    }
    async popular(req, res) {
        const user = await User.findById(req.user.userId)
        const allVideos = await Video.find({})
        const popular = []
        user.videohostCategories.forEach(el => {
            allVideos.forEach(item => {
                if(item.category === el && item.likes >= this.likesToPopular) {
                    popular.push(item)
                }
            })
        })
        const videos = popular.slice(0, this.popularVideosToShow)
        res.json({videos})
    }
    async new(req, res) {
        const allVideos = await Video.find({})
        const newVideos = allVideos.filter(el => el.date.split('.')[0] === req.params.date.split('.')[0])
        const videos = newVideos.slice(0, this.newVideosToShow)
        res.json({videos})
    }
    async sameMain(req, res) {
        const allVideos = await Video.find({})
        const same = allVideos.filter(el => el.category === req.body.category)
        const videos = same.slice(this.sameVideosToShow, same.length)
        res.json({videos})
    }
    async same(req, res) {
        const allVideos = await Video.find({})
        const videos = allVideos.filter(el => el.category === req.body.category)
        res.json({videos})
    }
    async recommended(req, res) {
        const user = await User.findById(req.params.id)
        if(user.videohostCategories.length > 0) {
            const allVideos = await Video.find({})
            const videos = allVideos.filter(el => {
                user.videohostCategories.forEach(item => {
                    if(item === el.category) return true
                });
            })
            res.json({videos})
        } else {
            res.json({videos: []})
        }
    }
    async recommendedMain(req, res) {
        const user = await User.findById(req.params.id)
        if(user.videohostCategories.length > 0) {
            const allVideos = await Video.find({})
            const recommended = []
            allVideos.forEach(el => {
                user.videohostCategories.forEach(item => {
                    console.log(item === el.category)
                    if(item === el.category) {
                        recommended.push(el)
                    }
                });
            })
            if(recommended.length > 5) {
                const videos = recommended.slice(0, this.recommendedVideosToShowMain)
                res.json({videos})
            } else {
                res.json({videos: recommended})
            }
        } else {
            res.json({videos: []})
        }
    }
    async recommendedVideoPage(req, res) {
        const user = await User.findById(req.params.id)
        if(user.videohostCategories.length > 0) {
            const allVideos = await Video.find({})
            const recommended = []
            allVideos.forEach(el => {
                user.videohostCategories.forEach(item => {
                    console.log(item === el.category)
                    if(item === el.category) {
                        recommended.push(el)
                    }
                });
            })
            if(recommended.length > 5) {
                const videos = recommended.slice(0, this.recommendedVideosToShowVideoPage)
                res.json({videos})
            } else {
                res.json({videos: recommended})
            }
        } else {
            res.json({videos: []})
        }
    }
    
    async delete(req, res) {
        await Video.findByIdAndDelete(req.params.id)
        res.json({msg: 'deleted'})
    }
    async checkName(req, res) {
        const name = req.body.name
        const video = await Video.findOne({name})
        if(video) {
            res.json({message: true})
        } else {
            res.json({message: false})
        }
    }
    async comments(req, res) {
        const comments = await Comment.find({videoID: req.params.id})
        res.json({comments})
    }
    async author(req, res) {
        const channelID = req.params.id
        const channel = await Channel.findById(channelID)
        res.json({name: channel.name})
    }
    async channelVideos(req, res) {
        const videos = await Video.find({channel: req.params.id})
        res.json({videos})
    }
    async videosCount(req, res) {
        const videos = await Video.find({channel: req.params.id})
        res.json({count: videos.length})
    }
    async isAdmin(req, res) {
        const user = req.user.userId
        const videoId = req.params.id
        const video = await Video.findById(videoId)
        const channel = await Channel.findById(video.channel)
        if(channel.admin == user) {
            res.json({isAdmin: true})
        } else {
            res.json({isAdmin: false})
        }
    }
    async all(req, res) {
        const videos = await Video.find({})
        console.log(videos)
        res.json({videos})
    }
    async interesting(req, res) {
        const user = await User.findById(req.user.userId)
        console.log('!!!',user, '!!!')
        const allVideos = await Video.find({})
        const videos = []
        allVideos.forEach(item => {
            user.videohostCategories.forEach(el => {
                console.log(el, item, item.category === el && item.likes >= this.interestingVideosToShowLikes && item.comments >= this.interestingVideosToShowCommments)
                if(item.category === el && item.likes >= this.interestingVideosToShowLikes && item.comments >= this.interestingVideosToShowCommments) {
                    videos.push(item)
                }
            })
        })
        res.json({videos})
    }
    async category(req, res) {
        const {category} = req.body
        const id = req.user.userId
        const user = await User.findById(id)
        if(!user.videohostCategories.length) {
            const videohostCategories = user.videohostCategories
            videohostCategories.push(category)
            await User.findByIdAndUpdate(id, {videohostCategories})
        }
        const allVideos = await Video.find({})
        const videos = []
        allVideos.forEach(item => {
            if(item.category === category) {
                videos.push(item)
            }
        })

        res.json({videos})
    }
    async createPlaylist(req, res) {
        const {ids, name} = req.body
        Playlist.create({public: req.params.id, name})
        .then(value => {
            ids.forEach(async el => {
                await Video.findByIdAndUpdate(el, {playlist: value._id})
            })
            res.json({playlist: value})
        })
        .catch(() => res.json({msg: 'error'}))
    }
    async playlists(req, res) {
        const playlists = await Playlist.find({public: req.params.id})
        res.json({playlists})
    }
}

module.exports = new VideohostVideosController()
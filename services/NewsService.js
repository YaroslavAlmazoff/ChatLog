const PublicPost = require('../models/PublicPost')
const User = require('../models/User')
const UserPost = require('../models/UserPost')
const Public = require('../models/Public')
const Like = require('../models/Like')

class NewsService {
    async getPublicNews(req, res) {
        const user = await User.findById(req.user.userId)
        res.json({posts: user.publicNews})
    }
    
    async getPublicNewsPost(req, res) {
        const post = await PublicPost.findById(req.params.id)
        if(post) {
            res.json({post})
        } else {
            res.json({post: null})
        }
    }
    async getFriendsNews(req, res) {
        const user = await User.findById(req.user.userId)
        res.json({posts: user.friendsNews})
    }
    async fullUserPublicNews(req, res) {
        const user = await User.findById(req.params.id)
        const publicNews = user.publicNews
        const fullPublicNews = publicNews.map(async el => {
            const post = await PublicPost.findById(el)
            if(post == null) return null
            const pub = await Public.findById(post.public)
            const liked = await Like.findOne({user: req.params.id, post: el})
            const postObj = post.toObject()
            postObj.publicName = `${pub.name}`
            postObj.avatar = pub.avatarUrl
            postObj.liked = !!liked
            return postObj
        })
        Promise.all(fullPublicNews)
        .then(fpn => {
            const filtered = fpn.filter(item => item != null)
            res.json({news: filtered})
        })
        .catch(()=>{res.json({news: []})})
    }
    async fullUserFriendsNews(req, res) {
        const user = await User.findById(req.params.id)
        const friendsNews = user.friendsNews
        const fullFriendsNews = friendsNews.map(async el => {
            const post = await UserPost.findById(el)
            if(post == null) return null
            const user = await User.findById(post.user)
            const liked = await Like.findOne({user: req.params.id, post: el})
            const postObj = post.toObject()
            postObj.userName = `${user.name} ${user.surname}`
            postObj.avatar = user.avatarUrl
            postObj.liked = !!liked
            return postObj
        })
        Promise.all(fullFriendsNews)
        .then(ffn => {
            const filtered = ffn.filter(item => item != null)
            res.json({news: filtered})
        })
        .catch((e)=>{console.log(e);res.json({news: []})})
    }
    async getFriendsNewsPost(req, res) {
        const post = await UserPost.findById(req.params.id)
        if(post) {
            res.json({post})
        } else {
            res.json({post: null})
        }
    }
}

module.exports = new NewsService()
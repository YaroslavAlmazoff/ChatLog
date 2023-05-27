const { Router } = require("express")
const router = Router()
const auth = require('../../middleware/auth.middleware')
const VideohostVideosController = require("../../services/Videohost/VideohostVideosController")

router.post('/create', auth, (req, res) => {
    try {
        VideohostVideosController.create(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.post('/edit', auth, (req, res) => {
    try {
        VideohostVideosController.edit(req, res)
    } catch (e) {
        console.log(e)
    }
})

router.get('/video/:id', (req, res) => {
    try {
        VideohostVideosController.video(req, res)
    } catch (e) {
        console.log(e)
    }
})

router.get('/popular', auth, (req, res) => {
    try {
        VideohostVideosController.popular(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/new/:date', (req, res) => {
    try {
        VideohostVideosController.new(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/recommendedmain/:id', (req, res) => {
    try {
        VideohostVideosController.recommendedMain(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/recommendedvideopage/:id', (req, res) => {
    try {
        VideohostVideosController.recommendedVideoPage(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/recommended/:id', (req, res) => {
    try {

    } catch(e) {
        console.log(e)
    }
})
router.get('/recommendedchannels/:id', (req, res) => {
    try {
        
    } catch(e) {
        console.log(e)
    }
})

router.post('/samemain', (req, res) => {
    try {
        VideohostVideosController.sameMain(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.post('/same', (req, res) => {
    try {
        VideohostVideosController.same(req, res)
    } catch (e) {
        console.log(e)
    }
})

router.delete('/delete/:id', (req, res) => {
    try {
        VideohostVideosController.delete(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.post('/checkname', (req, res) => {
    try {
        VideohostVideosController.checkName(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/comments/:id', (req, res) => {
    try {
        VideohostVideosController.comments(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/author/:id', (req, res) => {
    try {
        VideohostVideosController.author(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/channelvideos/:id', (req, res) => {
    try {
        VideohostVideosController.channelVideos(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/videoscount/:id', (req, res) => {
    try {
        VideohostVideosController.videosCount(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/isadmin/:id', auth, (req, res) => {
    try {
        VideohostVideosController.isAdmin(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/all', (req, res) => {
    try {
        VideohostVideosController.all(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/interesting', auth, (req, res) => {
    try {
        VideohostVideosController.interesting(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/category', auth, (req, res) => {
    try {
        VideohostVideosController.category(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/createplaylist/:id', (req, res) => {
    try {
        VideohostVideosController.createPlaylist(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/playlists/:id', (req, res) => {
    try {
        VideohostVideosController.playlists(req, res)
    } catch(e) {
        console.log(e)
    }
})


module.exports = router
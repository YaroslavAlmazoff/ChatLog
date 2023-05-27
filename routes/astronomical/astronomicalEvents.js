const { Router } = require("express")
const AEPController = require("../../services/Astronomical/AEPController")
const router = Router()

router.get('/events', (req, res) => {
    try {
        AEPController.events(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.post('/new-event', (req, res) => {
    try {
        AEPController.newEvent(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/new-token/:token', (req, res) => {
    try {
        AEPController.newToken(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.post('/new-image/:event', (req, res) => {
    try {
        AEPController.uploadImage(req, res)
    } catch (e) {
        console.log(e)
    }
})
router.get('/images/:event', (req, res) => {
    try {
        AEPController.imagesList(req, res)
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
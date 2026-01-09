const {Router} = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.send('OK')
})

module.exports = router
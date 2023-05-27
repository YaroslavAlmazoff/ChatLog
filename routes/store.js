const {Router} = require('express')
const StoreService = require('../services/StoreService')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.get('/product/:id', (req, res) => {
    try {
        StoreService.product(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/categories', (req, res) => {
    try {
        StoreService.categories(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/admincategories', auth, (req, res) => {
    try {
        StoreService.adminCategories(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/adminproducts', auth, (req, res) => {
    try {
        StoreService.adminProducts(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/newproduct', auth, (req, res) => {
    try {
        StoreService.newProduct(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/newcategory', auth, (req, res) => {
    try {
        StoreService.newCategory(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/productsbycategory', (req, res) => {
    try {
        StoreService.productsByCategory(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.delete('/deleteproduct/:id', auth, (req, res) => {
    try {
        StoreService.deleteProduct(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.post('/updateproduct/:id', auth, (req, res) => {
    try {
        StoreService.updateProduct(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/addtobasket/:id', auth, (req, res) => {
    try {
        StoreService.addToBasket(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.delete('/removefrombasket/:id', auth, (req, res) => {
    try {
        StoreService.removeFromBasket(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/basket', auth, (req, res) => {
    try {
        StoreService.basket(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.get('/isadmin', auth, (req, res) => {
    try {
        StoreService.isAdmin(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.delete('/removeproduct/:id', auth, (req, res) => {
    try {
        StoreService.deleteProduct(req, res)
    } catch(e) {
        console.log(e)
    }
})
router.delete('/removecategory/:id', auth, (req, res) => {
    try {
        StoreService.deleteCategory(req, res)
    } catch(e) {
        console.log(e)
    }
})




module.exports = router
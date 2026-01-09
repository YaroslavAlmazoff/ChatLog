const Product = require("../models/Product")
const uuid = require('uuid')
const Category = require("../models/Category")
const config = require('config')
const FileService = require('../services/FileService')
const User = require("../models/User")

class StoreService {
    async product(req, res) {
        const product = await Product.findById(req.params.id)
        res.json({product})
    }
    async newProduct(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            const {name, price, category, description, quantity} = req.body 
            const images = Object.keys(req.files).map((file) => {
                const filename = uuid.v4() + '.jpg'
                return filename
            })
            await Product.create({name, price, category, description, images, quantity, inStock: true})
            Object.keys(req.files).forEach((file, i) => {
                FileService.insertProductImage(req.files[file], images[i])
            })
            res.json({msg: 'success'})
        } else {
            res.json({msg: 'denied.'})
        }
    }
    async newCategory(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            await Category.create({name: req.body.name})
            res.json({msg: 'success'})
        } else {
            res.json({msg: 'dennied.'})
        }
    }
    async productsByCategory(req, res) {
        const {category} = req.body
        const products = await Product.find({category})
        res.json({products})
    }
    async categories(req, res) {
        const categories = await Category.find({})
        res.json({categories})
    }
    async adminCategories(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            const categories = await Category.find({})
            res.json({categories})
        } else {
            res.json({msg: 'denied.'})
        }
    }
    async products(req, res) {
        const products = await Product.find({})
        res.json({products})
    }
    async adminProducts(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            const products = await Product.find({})
            res.json({products})
        } else {
            res.json({msg: 'denied.'})
        }
    }
    async deleteProduct(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            await Product.findByIdAndDelete(req.params.id)
        }
        res.json({msg: ''})
    }
    async deleteCategory(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            await Category.findByIdAndDelete(req.params.id)
        }
        res.json({msg: ''})
    }
    async updateProduct(req, res) {
        if(req.user.userId == config.get('STORE_OWNER')) {
            const {name, price, description, category} = req.body
            const images = Object.keys(req.files).map((file) => {
                const filename = uuid.v4() + '.jpg'
                return filename
            })
            Product.findByIdAndUpdate(req.params.id, {name, description, price, images, category})
            Object.keys(req.files).forEach((file, i) => {
                FileService.insertProductImage(req.files[file], images[i])
            })
        }
        res.json({msg: ''})
    }
    async addToBasket(req, res) {
        const user = await User.findById(req.user.userId)
        const basket = user.basket
        basket.unshift(req.params.id)
        await User.findByIdAndUpdate(req.user.userId, {basket})
        res.json({basket})
    }
    async removeFromBasket(req, res) {
        const user = await User.findById(req.user.userId)
        const basket = user.basket
        const index = basket.findIndex(el => el.toString() == req.params.id)
        basket.splice(index, 1)
        await User.findByIdAndUpdate(req.user.userId, {basket})
        res.json({basket})
    }
    async basket(req, res) {
        const user = await User.findById(req.user.userId)
        const basket = user.basket
        const products = basket.map(async item => {
            const product = await Product.findById(item)
            return product
        })
        Promise.all(products)
        .then(prdcts => res.json({products: prdcts}))
        .catch(err => console.log(err))
    }
    async isAdmin(req, res) {
        res.json({isAdmin: req.user.userId == config.get('STORE_OWNER')})
    }
}

module.exports = new StoreService()
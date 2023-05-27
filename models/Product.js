const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    images: [{type: String, required: true}],
    rating: {type: Number, default: 0},
    price: {type: Number, required: true},
    inStock: {type: Boolean, required: true},
    quantity: {type: Number, default: 1},
})

module.exports = mongoose.model('Product', Product)

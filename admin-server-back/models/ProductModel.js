const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: true
    },
    pCategoryId: {
        type: String,
        required: true
    }, // parent category id
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }, // product status: 1: on sale, 2: not on sale
    imgs: {
        type: Array,
        default: []
    },
    detail: {
        type: String
    }
})

const ProductModel = mongoose.model('products', productSchema)

module.exports = ProductModel
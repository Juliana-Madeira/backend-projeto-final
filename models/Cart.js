const mongoose = require('mongoose');

const cartSchema = new Schema({

    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
},  
    {timestamps: true}
);

module.exports = model('Cart', cartSchema);
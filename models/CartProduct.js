const {Schema, model} = require('mongoose'); 

const cartSchema = new Schema({
        cartId: { 
            type: Schema.Types.ObjectId,
            ref: 'Cart' },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product' },
        quantity: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = model('CartProduct', cartSchema);
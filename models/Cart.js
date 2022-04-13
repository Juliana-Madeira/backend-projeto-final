const {Schema, model} = require('mongoose');

const orderSchema = new Schema({

    userId: { 
        type: Schema.Types.ObjectId,
        ref:'User'},
    products: [{
        type: Schema.Types.ObjectId,
        ref:'CartProduct' }],
    status: { 
        type: String,
        enum: [
            'opened',
            'placed',
            'paid',
            'canceled'],
        default: 'opened'
    }
},  
    {timestamps: true}
);

module.exports = model('Cart', orderSchema);
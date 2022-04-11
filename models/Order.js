const {Schema, model} = require('mongoose');

const orderSchema = new Schema({

    userId: { 
        type: Schema.Types.ObjectId,
        ref:'User'},
    products: [{
        type: Schema.Types.ObjectId,
        ref:'Cart' }],
    status: { 
        type: String,
        enum: [
            'order opened',
            'order placed',
            'order paid',
            'order canceled'],
        default: 'open order'
    }
},  
    {timestamps: true}
);

module.exports = model('Order', orderSchema);
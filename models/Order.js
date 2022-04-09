const {Schema, model} = require('mongoose');

const orderSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref:'User'},
    products: [{ type: Schema.Types.ObjectId, ref:'Cart' }],
    status: { type: String, enum: ['aberto', 'fechado', 'pago', 'cancelado'], default: 'aberto'}
},  
    {timestamps: true}
);

module.exports = model('Order', orderSchema);
const { Schema, model } = require('mongoose');

const reviewSchema = new Schema (
{
    review: {
        type:String,
        maxlength: 250},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'},
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'}
},
    { timestamps: true }  

)
module.exports = model('Review', reviewSchema);
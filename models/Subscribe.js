const { Schema, model } = require('mongoose');

const reviewSchema = new Schema (
{
    email: {
        type:String,
        },

},
    { timestamps: true }  

)
module.exports = model('Subscribe', reviewSchema);
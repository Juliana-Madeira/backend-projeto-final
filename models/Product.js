const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img1: {
        type: String,
        required: true
    },
    img2: {
        type: String,
        required: true
    },
    img3: {
        type: String,
    },
    img4: {
        type: String,
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    olfactoryPyramid: {
        type: String
    },
    inStock: {
        type: Boolean,
        default: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'}]
},
    {timestamps: true}
);

module.exports = model('Product', productSchema);
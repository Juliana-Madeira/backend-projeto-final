const { Schema, model } = require('mongoose');

const myFavoritesSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'},
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product' }]
    },
    {
        timestamps: true
    }
);

module.exports = model('MyFavorites', myFavoritesSchema);
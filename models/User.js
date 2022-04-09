const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    },
    passwordHash: {
        type: String,
        required:true
    },
    // cartId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Cart'
    // }
}, 
    {timestamps: true}
);

module.exports = model('User', userSchema);
const { Router } = require('express');
const User = require('../models/User');
const Order = require('../models/Order')
const router = Router();

//get Cart
router.get('/cart', async (req, res) => {
    const { id } = req.user;
     try {
        const order = await Order.findOne({userId: id});
        const cart = await Cart.find({ cartId: order._id }).populate('productId');
        res.status(200).json(cart);
     } catch (error) {
         res.status(500).json(error);
     }
});


//get one Product do user logado
router.get('/cart/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Cart.find({ productId }).populate('productId');
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
});


//deletar todos os productos do cart
router.delete('/cart/all', async (req, res) => {
    const { id } = req.user;

    try {
        //perar o Order id
        const order = await Order.findOne({ userId: id });
        //para deletar
        await Cart.deleteMany({ cartId: order._id});

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all products in Cart', error});
    }
});



module.exports = router;
const { Router } = require('express');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartProduct = require('../models/CartProduct');

const router = Router();

//get Cart
router.get('/', async (req, res) => {
    const { id } = req.user;
     try {
        const userCart = await Cart.findOne({userId: id});
        const cart = await CartProduct.find({ cartId: userCart._id }).populate('productId');
        res.status(200).json(cart);
     } catch (error) {
         res.status(500).json({message: `You don't have any cart`, error});
     }
});


//get one Product do user logado
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await CartProduct.find({ productId }).populate('productId');
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: `You don't have any cart`, error})
    }
});


//deletar todos os productos do cart
router.delete('/all', async (req, res) => {
    const { id } = req.user;

    try {
        //pegar o Order id
        const cart = await Cart.findOne({ userId: id });
        //para deletar
        await CartProduct.deleteMany({ cartId: cart._id});

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all products in Cart', error});
    }
});



module.exports = router;
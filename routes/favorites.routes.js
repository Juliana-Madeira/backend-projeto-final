const { Router } = require('express');
const CartProduct = require('../models/CartProduct');
const Cart = require('../models/Cart');
const MyFavorites = require('../models/MyFavorites');
const User = require('../models/User');

const router = Router();

router.get('/', async(req, res) => {
    const { id } = req.user;
    try {
        const list = await MyFavorites.findOne({ userId: id }).populate('products');
        res.status(200).json(list);
    } catch(error) {
        res.status(500).json({message: `You don't have favorite products`, error});
    }
})

//add
router.post('/:productId', async(req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;
    
    try {
        const list = await MyFavorites.findOne(userId);
      
        const findId = list.products.includes(productId);
        
        if(findId){
            res.status(400).json({ message: 'Product already added in your list'});
            return;
        }
        if(!list) {
            const newintheList = await MyFavorites.create(userId);

            const updatedList = await MyFavorites.findByIdAndUpdate(newintheList._id, { $push: { products: productId } }, { new: true });
            
            await User.findByIdAndUpdate(userId, { my_favorites: newintheLis._id });
            res.status(201).json(updatedList);
        } else {
            await MyFavotires.findOneAndUpdate(list._id, { $push: { products: productId } }, { new: true });
            res.status(200).json({message: 'Product added to your list'})
        }
    } catch(error) {
        res.status(500).json(error);
    }
});

//adicionar no order e deletar do favorites
router.post('/:productId', async(req, res) => {
    const { productId } = req.params;
    const { id } = req.user;

    try {
        const cart = await Cart.findOne({ user_id: id });
        if(!cart) {
            const newCart = await Cart.create({ user_id: id});

            const payload = {
                productId,
                cartId: newCart._id,
                quantity: 1
            }
            const product = await CartProduct.create(payload);
            const updatedCart = await Cart.findByIdAndUpdate(newCart._id, { $push: { products: product._id } }, { new: true });
            res.status(201).json(updatedCart);
        
        } else {
            const payload = {
                productId,
                cartId: cart._id,
                quantity: 1
            }

            const productintheCart = await CartProduct.create(payload);
            const updateCart = await Cart.findByIdAndUpdate(cart._id, { $push: { products: productintheCart._id }}, { new: true });

            await MyFavorites.findOneAndUpdate({userId: id}, { $pull: { products: productId } }, { new: true })
            res.status(201).json(updateCart);
        }
    } catch(error) {
        res.status(500).json({ message: 'Error while moving product to cart, please try again!', error })
    }
});

router.delete('/:productId', async(req, res)=> {
    const { productId } = req.params;
    const { id } = req.user;

    try {
        await MyFavotires.findOneAndUpdate({userId: id}, { $pull: { products: productId } }, { new: true })
        res.status(200).json();
    } catch(error) {
        res.status(500).json({message: `Unable to delete product from favorites`, error});
    };
});


module.exports = router;
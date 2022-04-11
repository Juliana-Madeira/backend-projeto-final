const { Router } = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const MyFavorites = require('../models/MyFavorites');
const User = require('../models/User');

const router = Router();

router.get('/myFavotires', async(req, res) => {
    const { id } = req.user;
    try {
        const list = await MyFavorites.findOne({ userId: id }).populate('products');
        res.status(200).json(list);
    } catch(error) {
        res.status(500).json(error);
    }
})

//add
router.post('/myFavotires/:productId', async(req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;
    
    try {
        const list = await MyFavorites.findOne(userId);
      
        const findId = list.products.includes(productId);
        
        if(findId){
            res.status(400).json({ message: 'product already added in your list'});
            return;
        }
        if(!list) {
            const newintheList = await MyFavorites.create(userId);

            const updatedList = await MyFavorites.findByIdAndUpdate(newintheList._id, { $push: { products: productId } }, { new: true });
            
            await User.findByIdAndUpdate(userId, { my_favorites: newintheLis._id });
            res.status(201).json(updatedList);
        } else {
            await MyFavotires.findOneAndUpdate(list._id, { $push: { products: productId } }, { new: true });
            res.status(200).json({message: 'product added to your list'})
        }
    } catch(error) {
        res.status(500).json(error);
    }
});

//adicionar no order e deletar do favorites
router.post('/myFavotires-order/:productId', async(req, res) => {
    const { productId } = req.params;
    const { id } = req.user;

    try {
        const order = await Order.findOne({ user_id: id });
        if(!order) {
            const newOrder = await Order.create({ user_id: id});

            const payload = {
                productId,
                cartId: newOrder._id,
                quantity: 1
            }
            const product = await Cart.create(payload);
            const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, { $push: { products: product._id } }, { new: true });
            res.status(201).json(updatedOrder);
        
        } else {
            const payload = {
                productId,
                cartId: order._id,
                quantity: 1
            }

            const productintheCart = await Cart.create(payload);
            const updateOrder = await Order.findByIdAndUpdate(order._id, { $push: { products: productintheCart._id }}, { new: true });

            await MyFavorites.findOneAndUpdate({userId: id}, { $pull: { products: productId } }, { new: true })
            res.status(201).json(updateOrder);
        }
    } catch(error) {
        res.status(500).json({ message: 'Error while moving product to cart', error })
    }
});

router.delete('/myFavorites/:productId', async(req, res)=> {
    const { productId } = req.params;
    const { id } = req.user;

    try {
        await MyFavotires.findOneAndUpdate({userId: id}, { $pull: { products: productId } }, { new: true })
        res.status(200).json();
    } catch(error) {
        res.status(500).json(error);
    };
});


module.exports = router;